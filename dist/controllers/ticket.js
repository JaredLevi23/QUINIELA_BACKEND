"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketsByTournament = exports.createTicket = void 0;
const ticket_1 = __importDefault(require("../models/ticket"));
const match_1 = __importDefault(require("../models/match"));
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.uid;
    const { tournamentId, nickName, folio, predictions } = req.body;
    try {
        // Validar el numero de predicciones y ids de partidos al crear el ticket
        if (!predictions || predictions.length === 0) {
            return res.status(400).json({
                msg: 'El ticket debe contener al menos una predicción'
            });
        }
        // Consultar los encuentros del torneo
        const matches = yield match_1.default.where({ tournamentId }).find();
        // Validar que los ids de prediccion corresponden a partidos del torneo
        if (matches.length === 0) {
            return res.status(400).json({
                msg: 'El torneo no tiene partidos asociados o no existe'
            });
        }
        if (predictions.length !== matches.length) {
            return res.status(400).json({
                msg: `El numero de predicciones (${predictions.length}) no coincide con el numero de partidos del torneo (${matches.length})`
            });
        }
        for (const prediction of predictions) {
            const matchExists = matches.some(match => match.matchId === prediction.matchUid);
            if (!matchExists) {
                return res.status(400).json({
                    msg: `El partido con ID ${prediction.matchUid} no pertenece al torneo o no existe`
                });
            }
        }
        const ticket = new ticket_1.default({ userId, tournamentId, nickName, folio, predictions });
        yield ticket.save();
        return res.status(201).json({
            msg: 'Ticket creado correctamente',
            ticket
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Error al crear el ticket'
        });
    }
});
exports.createTicket = createTicket;
const getTicketsByTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        console.log(id);
        const tickets = yield ticket_1.default.where({ tournamentId: id }).find();
        return res.status(200).json({
            msg: 'Tickets obtenidos correctamente',
            tickets
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Error al obtener los tickets'
        });
    }
});
exports.getTicketsByTournament = getTicketsByTournament;
//# sourceMappingURL=ticket.js.map