import { Router } from "express";
import { check } from "express-validator";
import { deleteCategory, getCategories, getCategoryById, postCategory, putCategory } from "../controllers/categories";
import { validation } from "../middlewares/validate-fields";
import { validarJWT } from "../middlewares/validate-jwt";

const router = Router();

router.get(
    '/',
    [
        validarJWT,
        validation
    ],
    getCategories
);

router.get(
    '/:id',
    [
        validarJWT,
        check( 'id', 'No se otorgo el id de la categoria' ),
        validation
    ],
    getCategoryById
);

router.post(
    '/',
    [
        validarJWT,
        check( 'name', 'El nombre de la categoria es obligatorio' ).notEmpty(),
        check( 'description', 'La descripcion es obligatoria' ).notEmpty(),
        validation
    ],
    postCategory
);

router.put(
    '/:id',
    [
        validarJWT,
        check( 'id', 'Debe especificar el id de la categoria' ),
        validation
    ],
    putCategory
);

router.delete(
    '/:id',
    [
        validarJWT,
        check( 'id', 'Debe especificar el id de la categoria' ),
        validation
    ],
    deleteCategory
);


export default router;