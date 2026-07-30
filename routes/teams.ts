import { Router } from "express";
import { validarJWT } from "../middlewares/validate-jwt";
import { validation } from "../middlewares/validate-fields";
import { deleteTeam, getTeamById, getTeams, postTeam, putTeam } from "../controllers/teams";
import { check } from "express-validator";


const router = Router();

router.get( 
    '/',
    [
        validarJWT,
        validation
    ],
    getTeams
);


router.get(
    '/:id',
    [
        validarJWT,
        validation
    ],
    getTeamById
);

router.post(
    '/',
    [
        validarJWT,
        check( 'name', 'El nombre del equipo es obligatorio' ).notEmpty(),
        check( 'shortName', 'El nombre corto del equipo es obligatorio' ).notEmpty(),
        check( 'logo', 'El logo del equipo es obligatorio' ).notEmpty(),
        check( 'league', 'La liga es obligatoria' ).notEmpty(),
        check( 'stadium', 'El estadio es obligatorio' ).notEmpty(),
        validation
    ],
    postTeam
);

router.put(
    '/:id',
    [
        validarJWT,
        validation
    ],
    putTeam
);


router.delete(
    '/:id',
    [
        validarJWT,
        validation
    ],
    deleteTeam
);


export default router;