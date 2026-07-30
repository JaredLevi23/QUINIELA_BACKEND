import { Request, Response } from "express";
import Team from "../models/team";

export const getTeams = async ( req:Request, res:Response )=> {

    const teams = await Team.find();

    return res.status( 200 ).json({
        msg: 'GetTeams',
        teams
    });
}


export const getTeamById = async ( req:Request, res:Response )=> {

    const { id } = req.params;
    const team = await Team.where( { _id: id } ).findOne();

    return res.status( 200 ).json({
        msg: 'GetTeamById',
        team
    });
}

export const postTeam = async ( req:Request, res:Response )=> {
    const { name, shortName, logo, league, stadium, enabled } = req.body;
    const team = await Team.where( { name } ).findOne();

    if( team ){
        return res.status( 400 ).json({
            msg: 'El equipo ya existe',
            name
        });
    }

    const newTeam = new Team({
        name,
        shortName,
        logo,
        league,
        stadium,
        enabled
    });

    await newTeam.save();

    return res.status( 201 ).json({
        msg: 'Equipo creado',
        team: newTeam
    });
}

export const putTeam = async ( req:Request, res:Response )=> {

    const { id } = req.params;
    const { name, shortName, logo, league, stadium, enabled, ...data } = req.body;

    const team = await Team.where( { _id: id } ).findOne();

    if( !team ){
        return res.status( 404 ).json({
            msg: 'El equipo no existe',
            id
        });
    }

    if( team.name !== name ){
        const teamName = await Team.where( { name } ).findOne();
        if( teamName ){
            return res.status( 400 ).json({
                msg: 'El nombre del equipo ya existe',
                name
            });
        }
    }

    data.name = name;
    data.shortName = shortName;
    data.logo = logo;
    data.league = league;
    data.stadium = stadium;
    data.enabled = enabled;

    const updatedTeam = await Team.findByIdAndUpdate( id, data, { new: true } );

    return res.status( 200 ).json({
        msg: 'Equipo actualizado',
        team: updatedTeam
    });
}

export const deleteTeam = async ( req:Request, res:Response )=> {

    const { id } = req.params;

    const team = await Team.where( { _id: id } ).findOne();

    if( !team ){
        return res.status( 404 ).json({
            msg: 'El equipo no existe',
            id
        });
    }

    await Team.findByIdAndDelete( id );

    return res.status( 200 ).json({
        msg: 'Equipo eliminado'
    });
}