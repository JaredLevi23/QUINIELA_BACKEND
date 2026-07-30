import { Router } from "express";
import { check } from "express-validator";
import { deleteUsuario, enableUsuario, getUsuario, getUsuarios, patchUserRole, postUsuario, putUsuario } from "../controllers/user";
import { validation } from "../middlewares/validate-fields";
import { validarJWT } from "../middlewares/validate-jwt";
import { isAdmin } from "../middlewares/validate-roles";
import { UserRole } from "../helpers/enums";

const router = Router();

router.get(
    '/',
    [
        validarJWT,
        isAdmin
    ],
    getUsuarios
);

router.get(
    '/:id',
    [
        validarJWT,
        isAdmin,
        check('id', 'El id debe ser valido' ).isMongoId(),
        validation
    ],
    getUsuario
);

router.post(
    '/',
    [
        check( 'email', 'El nombre es obligatorio' ).isEmail(),
        check( 'name', 'El nombre es obligatorio' ).notEmpty(),
        check( 'lastname', 'El apellido es obligatorio' ).notEmpty(),
        check( 'password', 'La contraseña es obligatoria' ).notEmpty(),
        validation
    ],
    postUsuario
);

router.put(
    '/:id',
    [
        validarJWT,
        isAdmin,
        check('id', 'El id debe ser valido' ).isMongoId(),
        validation
    ],
    putUsuario
);

router.patch(
    '/:id/role',
    [
        validarJWT,
        isAdmin,
        check('id', 'El id debe ser valido' ).isMongoId(),
        check('role', 'El rol debe ser uno de los valores permitidos' ).isIn( Object.values( UserRole ) ),
        validation
    ],
    patchUserRole
);

router.patch(
    '/:id/enable',
    [
        validarJWT,
        isAdmin,
        check('id', 'El id debe ser valido' ).isMongoId(),
        validation
    ],
    enableUsuario
);

router.delete(
    '/:id',
    [
        validarJWT,
        isAdmin,
        check('id', 'El id debe ser valido' ).isMongoId(),
        validation
    ],
    deleteUsuario
);

export default router;