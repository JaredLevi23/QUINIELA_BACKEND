import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/users";

export const getUsuarios = async ( req: Request, res: Response ) => {

    const page = Math.max( Number( req.query.page ) || 1, 1 );
    const limit = Math.min( Math.max( Number( req.query.limit ) || 10, 1 ), 100 );

    const [ users, total ] = await Promise.all([
        User.find()
            .skip( ( page - 1 ) * limit )
            .limit( limit ),
        User.countDocuments()
    ]);

    res.status(200).json({
        msg: 'getUsuarios',
        total,
        page,
        limit,
        users
    });
}


export const getUsuario = async ( req: Request, res: Response ) =>{

    const { id } = req.params;

    const user = await User.findById( id );

    if( !user ){
        return res.status( 404 ).json({
            msg: 'El usuario no existe'
        });
    }

    res.status(200).json({
        msg: 'getUsuario',
        user
    });
}


export const postUsuario = async ( req: Request, res: Response ) =>{

    const { name, lastname, email, password } = req.body;

    const userExist = await User.where({
        email
    });
        
    if( userExist.length !== 0 ){
        return res.status( 400 ).json({
            msg: 'Email already exists',
            email
        });
    }

    const user = new User({
        name,lastname,email
    });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );
    await user.save();

    // Enviar verificacion 

    res.status(200).json({
        msg: 'User created',
        user
    });
}


export const putUsuario = async ( req: Request, res: Response ) =>{

    const { id } = req.params;
    const { name, lastname, email, enabled } = req.body;

    const user = await User.findByIdAndUpdate( id, { name, lastname, email, enabled }, { new: true } );

    if( !user ){
        return res.status( 406 ).json({
            msg: 'El usuario no existe'
        });
    }

    res.status(200).json({
        msg: 'Usuario actualizado',
        user
    });
}


export const patchUserRole = async ( req: Request, res: Response ) =>{

    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate( id, { role }, { new: true } );

    if( !user ){
        return res.status( 406 ).json({
            msg: 'El usuario no existe'
        });
    }

    res.status(200).json({
        msg: 'Rol actualizado',
        user
    });
}


export const enableUsuario = async ( req: Request, res: Response ) =>{

    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, { enabled: true }, { new: true } );

    if( !user ){
        return res.status( 406 ).json({
            msg: 'El usuario no existe'
        });
    }

    res.status(200).json({
        msg: 'Usuario reactivado',
        user
    });
}


export const deleteUsuario = async ( req: Request, res: Response ) =>{

    const { id } = req.params;
    const user = await User.findByIdAndUpdate( id, { enabled: false }, { new: true } );

    if( !user ){
        return res.status( 406 ).json({
            msg: 'El usuario no existe'
        });
    }

    res.status(200).json({
        msg: 'Usuario Desactivado',
        user
    });
}


