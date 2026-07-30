"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const validate_fields_1 = require("../middlewares/validate-fields");
const router = (0, express_1.Router)();
router.post('/', [
    (0, express_validator_1.check)('email', 'El correo electronico es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').notEmpty(),
    validate_fields_1.validation
], auth_1.userAuthentication);
router.get('/check-auth-status', auth_1.checkAuthStatus);
exports.default = router;
