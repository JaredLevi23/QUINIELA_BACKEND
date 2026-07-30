"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const products_1 = require("../controllers/products");
const validate_data_1 = require("../middlewares/validate-data");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], products_1.getProductos);
router.get('/:category', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('category', 'El query es obligatorio').notEmpty(),
    validate_fields_1.validation
], products_1.getProductByCategory);
router.get('/search/:query', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('query', 'El query es obligatorio').notEmpty(),
    validate_fields_1.validation
], products_1.getProductoByQuery);
router.post('/', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('name', 'El nombre es obligatorio').notEmpty(),
    (0, express_validator_1.check)('category', 'La categoria es obligatoria').isMongoId(),
    (0, express_validator_1.check)('category').custom(validate_data_1.findCategory),
    (0, express_validator_1.check)('description', 'La descripcion es obligatorio').notEmpty(),
    (0, express_validator_1.check)('price', 'El precio es obligatorio').notEmpty(),
    (0, express_validator_1.check)('exists', 'La existencia es obligatoria').notEmpty(),
    validate_fields_1.validation
], products_1.postProduct);
router.put('/:id', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'El id del producto es obligatorio').isMongoId(),
    validate_fields_1.validation
], products_1.putProduct);
router.delete('/:id', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'El id del producto es obligatorio').isMongoId(),
    validate_fields_1.validation
], products_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.js.map