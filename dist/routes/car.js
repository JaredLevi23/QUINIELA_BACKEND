"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const car_1 = require("../controllers/car");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/:id', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'No se otorgo el id de la categoria'),
    validate_fields_1.validation
]);
router.post('/:idu/:idp', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('idu', 'El id del usaurio es obligatorio').isMongoId(),
    (0, express_validator_1.check)('idp', 'El id del producto es obligatorio').isMongoId(),
    (0, express_validator_1.check)('car', 'El car es obligatorio').isNumeric(),
    validate_fields_1.validation
], car_1.postCar);
router.put('/:idc', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('idc', 'El id del car es obligatorio').isMongoId(),
    (0, express_validator_1.check)('idp', 'El id del producto es obligatorio').isMongoId(),
    (0, express_validator_1.check)('car', 'El car es obligatorio').isNumeric(),
    validate_fields_1.validation
], car_1.putCar);
router.delete('/:idu', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('idu', 'El id del usaurio es obligatorio').isMongoId(),
    (0, express_validator_1.check)('idp', 'El id del producto es obligatorio').isMongoId(),
    validate_fields_1.validation
]);
exports.default = router;
//# sourceMappingURL=car.js.map