import { Router } from "express";
import { check } from "express-validator";
import { checkAuthStatus, userAuthentication } from "../controllers/auth";
import { validation } from "../middlewares/validate-fields";
import { validarJWT } from "../middlewares/validate-jwt";

const router = Router();

router.post(
    '/',
    [
        check( 'email', 'El correo electronico es obligatorio' ).isEmail(),
        check( 'password', 'La contraseña es obligatoria' ).notEmpty(),
        validation
    ],
    userAuthentication
);


router.get(
    '/check-auth-status',
    checkAuthStatus
);



export default router;