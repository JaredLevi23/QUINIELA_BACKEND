import Tournament from "../models/tournament";
import { Request, Response } from "express";

export const getTournaments = async ( req:Request, res:Response )=> {
    
    const tournaments = await Tournament.find(); 
    return res.status( 200 ).json({
        msg: 'GetTournaments',
        tournaments
    });

}

export const getTournamentById = async ( req:Request, res:Response )=> {

    const { id } = req.params;
    const tournament = await Tournament.where( { _id: id } ).findOne();

    return res.status( 200 ).json({
        msg: 'GetTournamentById',
        tournament
    });
}

export const postTournament = async ( req:Request, res:Response )=> {

    const { name, startDate, endDate } = req.body;
    const tournament = await Tournament.where( { name } ).findOne();

    if( tournament ){
        return res.status( 400 ).json({
            msg: 'El torneo ya existe',
            name
        });
    }

    const newTournament = new Tournament({
        name,
        startDate,
        endDate
    });

    await newTournament.save();

    return res.status( 201 ).json({
        msg: 'Torneo creado',
        tournament: newTournament
    });
}

export const putTournament = async ( req:Request, res:Response )=> {

    const { id } = req.params;
    const { name, startDate, endDate, ...data } = req.body;

    const tournament = await Tournament.where( { _id: id } ).findOne();

    if( !tournament ){
        return res.status( 404 ).json({
            msg: 'El torneo no existe',
            id
        });
    }

    data.name = name;
    data.startDate = startDate;
    data.endDate = endDate;
    data.updateDate = new Date();

    const updatedTournament = await Tournament.findByIdAndUpdate( id, data, { new: true } );

    return res.status( 200 ).json({
        msg: 'Torneo actualizado',
        tournament: updatedTournament
    });
}

export const deleteTournament = async ( req:Request, res:Response )=> {

    const { id } = req.params;

    const tournament = await Tournament.where( { _id: id } ).findOne();

    if( !tournament ){
        return res.status( 404 ).json({
            msg: 'El torneo no existe',
            id
        });
    }

    await Tournament.findByIdAndDelete( id );

    return res.status( 200 ).json({
        msg: 'Torneo eliminado',
        tournament
    });
}
