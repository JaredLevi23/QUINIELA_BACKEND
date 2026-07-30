"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const validate_fields_1 = require("../middlewares/validate-fields");
const teams_1 = require("../controllers/teams");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get('/', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], teams_1.getTeams);
router.get('/:id', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], teams_1.getTeamById);
router.post('/', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('name', 'El nombre del equipo es obligatorio').notEmpty(),
    (0, express_validator_1.check)('shortName', 'El nombre corto del equipo es obligatorio').notEmpty(),
    (0, express_validator_1.check)('logo', 'El logo del equipo es obligatorio').notEmpty(),
    (0, express_validator_1.check)('league', 'La liga es obligatoria').notEmpty(),
    (0, express_validator_1.check)('stadium', 'El estadio es obligatorio').notEmpty(),
    validate_fields_1.validation
], teams_1.postTeam);
router.put('/:id', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], teams_1.putTeam);
router.delete('/:id', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], teams_1.deleteTeam);
exports.default = router;
