"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const validate_jwt_1 = require("../middlewares/validate-jwt");
const validate_roles_1 = require("../middlewares/validate-roles");
const validate_fields_1 = require("../middlewares/validate-fields");
const ticket_1 = require("../controllers/ticket");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.get("/:id", [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], ticket_1.getTicketsByTournament);
router.post("/", [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], ticket_1.createTicket);
router.post("/upload", [
    validate_jwt_1.validarJWT,
    validate_roles_1.isAdmin,
    upload.single('file'),
    (0, express_validator_1.check)('name', 'El nombre del torneo es obligatorio').notEmpty(),
    (0, express_validator_1.check)('startDate', 'La fecha de inicio es obligatoria').notEmpty(),
    (0, express_validator_1.check)('endDate', 'La fecha de fin es obligatoria').notEmpty(),
    validate_fields_1.validation
], ticket_1.createTicketsByExcel);
exports.default = router;
