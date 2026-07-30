
import jwt from "jsonwebtoken";

const generateJWT = async ( uid: '' ) => {

    return new Promise( ( resolve, reject ) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY!,
            {},
            ( error, token ) => {
                if( error ){
                    console.log( error );
                    reject('No se pudo crear el token');
                }else{
                    resolve( token );
                }
    
            }
        );
    });
}

export default generateJWT;