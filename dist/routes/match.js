"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const match_1 = require("../controllers/match");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const validate_fields_1 = require("../middlewares/validate-fields");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get('/', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], match_1.getMatchs);
router.get('/detail/:id', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], match_1.getMatchById);
router.get('/tournament/:tournamentId', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], match_1.getMatchesByTournament);
router.post('/', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('homeTeam', 'El equipo local es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('awayTeam', 'El equipo visitante es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('tournamentId', 'El torneo es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('matchDate', 'La fecha del partido es obligatoria').not().isEmpty(),
    validate_fields_1.validation
], match_1.postMatch);
router.put('/:id', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], match_1.putMatch);
router.delete('/:id', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], match_1.deleteMatch);
exports.default = router;
