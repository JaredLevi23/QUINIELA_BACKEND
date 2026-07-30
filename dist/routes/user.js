"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_1 = require("../controllers/user");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/', [], user_1.getUsuarios);
router.get('/:id', [], user_1.getUsuario);
router.post('/', [
    (0, express_validator_1.check)('email', 'El nombre es obligatorio').isEmail(),
    (0, express_validator_1.check)('name', 'El nombre es obligatorio').notEmpty(),
    (0, express_validator_1.check)('lastname', 'El apellido es obligatorio').notEmpty(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').notEmpty(),
    validate_fields_1.validation
], user_1.postUsuario);
router.put('/:id', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'El id debe ser valido').isMongoId(),
    validate_fields_1.validation
], user_1.putUsuario);
router.delete('/:id', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'El id debe ser valido').isMongoId(),
    validate_fields_1.validation
], user_1.deleteUsuario);
exports.default = router;
//# sourceMappingURL=user.js.map