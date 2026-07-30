import { Router } from "express";
import { check } from "express-validator";
import multer from "multer";
import { validarJWT } from "../middlewares/validate-jwt";
import { isAdmin } from "../middlewares/validate-roles";
import { validation } from "../middlewares/validate-fields";
import { createTicket, createTicketsByExcel, getTicketsByTournament } from "../controllers/ticket";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();


router.get(
    "/:id",
    [
        validarJWT,
        validation
    ],
    getTicketsByTournament
);


router.post(
    "/",
    [
        validarJWT,
        validation
    ],
    createTicket
);

router.post(
    "/upload",
    [
        validarJWT,
        isAdmin,
        upload.single('file'),
        check( 'name', 'El nombre del torneo es obligatorio' ).notEmpty(),
        check( 'startDate', 'La fecha de inicio es obligatoria' ).notEmpty(),
        check( 'endDate', 'La fecha de fin es obligatoria' ).notEmpty(),
        validation
    ],
    createTicketsByExcel
);

export default router;