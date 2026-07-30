import { Request, Response, NextFunction } from "express";
import { UserRole } from "../helpers/enums";

export const hasRole = ( ...allowedRoles: UserRole[] ) => {

    return ( req: Request, res: Response, next: NextFunction ) => {

        const role = (req as any).role;

        if( !role || !allowedRoles.includes( role ) ){
            return res.status( 403 ).json({
                msg: `No tiene permisos para realizar esta accion, se requiere uno de los siguientes roles: ${ allowedRoles.join(', ') }`
            });
        }

        next();
    }
}

export const isAdmin = hasRole( UserRole.ADMIN );
