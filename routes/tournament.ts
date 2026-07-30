import { Router } from "express";
import { validarJWT } from "../middlewares/validate-jwt";
import { validation } from '../middlewares/validate-fields';
import { deleteTournament, getTournamentById, getTournaments, postTournament, putTournament } from "../controllers/tournament";

const router = Router();

router.get(
    "/",
    [
        validarJWT,
        validation
    ],
    getTournaments
);

router.get(
    "/:id",
    [
        validarJWT,
        validation
    ],
    getTournamentById
);

router.post(
    "/",
    [
        validarJWT,
        validation
    ],
    postTournament
);

router.put(
    "/:id",
    [
        validarJWT,
        validation
    ],
    putTournament
);

router.delete(
    "/:id",
    [
        validarJWT,
        validation
    ],
    deleteTournament
);

export default router;