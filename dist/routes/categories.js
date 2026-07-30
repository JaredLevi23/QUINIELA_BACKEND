"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const categories_1 = require("../controllers/categories");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], categories_1.getCategories);
router.get('/:id', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'No se otorgo el id de la categoria'),
    validate_fields_1.validation
], categories_1.getCategoryById);
router.post('/', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('name', 'El nombre de la categoria es obligatorio').notEmpty(),
    (0, express_validator_1.check)('description', 'La descripcion es obligatoria').notEmpty(),
    validate_fields_1.validation
], categories_1.postCategory);
router.put('/:id', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'Debe especificar el id de la categoria'),
    validate_fields_1.validation
], categories_1.putCategory);
router.delete('/:id', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'Debe especificar el id de la categoria'),
    validate_fields_1.validation
], categories_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.js.map