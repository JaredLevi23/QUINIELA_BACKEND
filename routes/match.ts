import { Router } from "express";
import { deleteMatch, getMatchById, getMatchesByTournament, getMatchs, postMatch, putMatch } from "../controllers/match";
import { validarJWT } from "../middlewares/validate-jwt";
import { validation } from "../middlewares/validate-fields";
import { check } from "express-validator";


const router = Router();

router.get( 
    '/',
    [
        validarJWT,
        validation
    ],
    getMatchs  
);


router.get(
    '/detail/:id',
    [
        validarJWT,
        validation
    ],
    getMatchById
);

router.get(
    '/tournament/:tournamentId',
    [
        validarJWT,
        validation
    ],
    getMatchesByTournament  
);

router.post(
    '/',
    [
        validarJWT,
        check( 'homeTeam', 'El equipo local es obligatorio' ).not().isEmpty(),
        check( 'awayTeam', 'El equipo visitante es obligatorio' ).not().isEmpty(),
        check( 'tournamentId', 'El torneo es obligatorio' ).not().isEmpty(),
        check( 'matchDate', 'La fecha del partido es obligatoria' ).not().isEmpty(),
        validation
    ],
    postMatch  
);

router.put(
    '/:id',
    [
        validarJWT,
        validation
    ],
    putMatch  
);


router.delete(
    '/:id',
    [
        validarJWT,
        validation
    ],
    deleteMatch  
);

export default router;