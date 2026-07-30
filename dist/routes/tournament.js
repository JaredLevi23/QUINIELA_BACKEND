"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const validate_fields_1 = require("../middlewares/validate-fields");
const tournament_1 = require("../controllers/tournament");
const router = (0, express_1.Router)();
router.get("/", [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], tournament_1.getTournaments);
router.get("/:id", [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], tournament_1.getTournamentById);
router.post("/", [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], tournament_1.postTournament);
router.put("/:id", [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], tournament_1.putTournament);
router.delete("/:id", [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], tournament_1.deleteTournament);
exports.default = router;
//# sourceMappingURL=tournament.js.map