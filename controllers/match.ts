import Match from "../models/match";
import { Request, Response } from "express";


export const getMatchs = async ( req:Request, res:Response )=> {
    
    const matchs = await Match.find()
        .populate('homeTeam', 'name')
        .populate('awayTeam', 'name')
        .populate('tournamentId', 'name'); 
    return res.status( 200 ).json({
        msg: 'GetMatchs',
        matchs
    });

}

export const getMatchById = async ( req:Request, res:Response )=> {

    const { id } = req.params;
    const match = await Match.findById(id)
        .populate('homeTeam', 'name')
        .populate('awayTeam', 'name')
        .populate('tournamentId', 'name');

    return res.status( 200 ).json({
        msg: 'GetMatchById',
        match
    });
}

export const getMatchesByTournament = async ( req:Request, res:Response )=> {

    const { tournamentId } = req.params;
    const matches = await Match.find({ tournamentId })
        .populate('homeTeam', 'name logo')
        .populate('awayTeam', 'name logo')
        .populate('tournamentId', 'name');

    return res.status( 200 ).json({
        msg: 'GetMatchesByTournament',
        matches
    });
}

export const postMatch = async ( req:Request, res:Response )=> {

    //   homeTeam: string;
    //   awayTeam: string;
    //   homeTeamLogo?: string;
    //   awayTeamLogo?: string;
    //   league: string;
    //   season: string;
    //   matchday?: number;
    //   venue?: string;
    //   date: Date;
    //   status: MatchStatus;
    //   result: IMatchResult;
    //   externalId?: string; // ID de API externa (ej: API-Football)
    //   createdAt: Date;
    //   updatedAt: Date;

    const { homeTeam, awayTeam, tournamentId, matchDate } = req.body;
    const match = await Match.where( { homeTeam, awayTeam, tournamentId, matchDate} ).findOne();

    if( match ){
        return res.status( 400 ).json({
            msg: 'El partido ya existe',
            homeTeam,
            awayTeam,
            tournamentId
        });
    }

    const newMatch = new Match({
        homeTeam,
        awayTeam,
        tournamentId,
        matchDate
    });

    await newMatch.save();

    return res.status( 201 ).json({
        msg: 'Partido creado',
        match: newMatch
    });
}

export const putMatch = async ( req:Request, res:Response )=> {

    const { id } = req.params;
    const { homeTeam, awayTeam, tournamentId, homeScore, awayScore, ...data } = req.body;

    const match = await Match.where( { _id: id } ).findOne();

    if( !match ){
        return res.status( 404 ).json({
            msg: 'El partido no existe',
            id
        });
    }

    data.homeTeam = homeTeam;
    data.awayTeam = awayTeam;
    data.homeScore = homeScore || match.homeScore;
    data.awayScore = awayScore || match.awayScore;
    data.tournamentId = tournamentId;
    data.updateDate = new Date();

    const updatedMatch = await Match.findByIdAndUpdate( id, data, { new: true } );

    return res.status( 200 ).json({
        msg: 'Partido actualizado',
        match: updatedMatch
    });
}

export const deleteMatch = async ( req:Request, res:Response )=> {

    const { id } = req.params;

    const match = await Match.where( { _id: id } ).findOne();

    if( !match ){
        return res.status( 404 ).json({
            msg: 'El partido no existe',
            id
        });
    }

    await Match.findByIdAndDelete( id );

    return res.status( 200 ).json({
        msg: 'Partido eliminado'
    });
}   