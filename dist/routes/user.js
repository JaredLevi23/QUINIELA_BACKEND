"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_1 = require("../controllers/user");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const validate_roles_1 = require("../middlewares/validate-roles");
const enums_1 = require("../helpers/enums");
const router = (0, express_1.Router)();
router.get('/', [
    validate_jwt_1.validarJWT,
    validate_roles_1.isAdmin
], user_1.getUsuarios);
router.get('/:id', [
    validate_jwt_1.validarJWT,
    validate_roles_1.isAdmin,
    (0, express_validator_1.check)('id', 'El id debe ser valido').isMongoId(),
    validate_fields_1.validation
], user_1.getUsuario);
router.post('/', [
    (0, express_validator_1.check)('email', 'El nombre es obligatorio').isEmail(),
    (0, express_validator_1.check)('name', 'El nombre es obligatorio').notEmpty(),
    (0, express_validator_1.check)('lastname', 'El apellido es obligatorio').notEmpty(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').notEmpty(),
    validate_fields_1.validation
], user_1.postUsuario);
router.put('/:id', [
    validate_jwt_1.validarJWT,
    validate_roles_1.isAdmin,
    (0, express_validator_1.check)('id', 'El id debe ser valido').isMongoId(),
    validate_fields_1.validation
], user_1.putUsuario);
router.patch('/:id/role', [
    validate_jwt_1.validarJWT,
    validate_roles_1.isAdmin,
    (0, express_validator_1.check)('id', 'El id debe ser valido').isMongoId(),
    (0, express_validator_1.check)('role', 'El rol debe ser uno de los valores permitidos').isIn(Object.values(enums_1.UserRole)),
    validate_fields_1.validation
], user_1.patchUserRole);
router.patch('/:id/enable', [
    validate_jwt_1.validarJWT,
    validate_roles_1.isAdmin,
    (0, express_validator_1.check)('id', 'El id debe ser valido').isMongoId(),
    validate_fields_1.validation
], user_1.enableUsuario);
router.delete('/:id', [
    validate_jwt_1.validarJWT,
    validate_roles_1.isAdmin,
    (0, express_validator_1.check)('id', 'El id debe ser valido').isMongoId(),
    validate_fields_1.validation
], user_1.deleteUsuario);
exports.default = router;
