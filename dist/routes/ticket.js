"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const validate_fields_1 = require("../middlewares/validate-fields");
const ticket_1 = require("../controllers/ticket");
const router = (0, express_1.Router)();
router.get("/:id", [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], ticket_1.getTicketsByTournament);
router.post("/", [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], ticket_1.createTicket);
exports.default = router;
//# sourceMappingURL=ticket.js.map