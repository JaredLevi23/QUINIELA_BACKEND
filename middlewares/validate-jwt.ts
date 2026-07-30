import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/users";

export const validarJWT = async( req: Request, res: Response, next: NextFunction )=>{
    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ?? '' ) as JwtPayload;
        const userAuth =await User.findOne( { '_id': uid });

        if( !userAuth){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe'
            });
        }
        //Verificar si el usuario esta activo
        if( !userAuth.enabled ){
            return res.status(401).json({
                msg: 'Usuario desactivado'
            });
        }

        console.log( 'Validnado JWT' );


        (req as any).uid = uid;
        (req as any).role = userAuth.role;

        next();

    } catch (error) {
        res.status(401).json({
            msg:'Token no valido'
        });
    }

}
