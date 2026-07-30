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
exports.createTicketsByExcel = exports.getTicketsByTournament = exports.createTicket = void 0;
const ticket_1 = __importDefault(require("../models/ticket"));
const team_1 = __importDefault(require("../models/team"));
const tournament_1 = __importDefault(require("../models/tournament"));
const match_1 = __importDefault(require("../models/match"));
const node_1 = __importDefault(require("read-excel-file/node"));
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
            const matchExists = matches.some(match => String(match._id) === prediction.matchId);
            if (!matchExists) {
                return res.status(400).json({
                    msg: `El partido con ID ${prediction.matchId} no pertenece al torneo o no existe`
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
/**
 * Excepción usada para distinguir errores de datos del Excel (400) de errores inesperados (500).
 */
class ImportValidationError extends Error {
}
const cellToString = (cell) => {
    if (cell === undefined || cell === null) {
        return '';
    }
    return String(cell).trim();
};
const deriveShortName = (name) => {
    return name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
};
const getDateParts = (cell) => {
    if (cell instanceof Date) {
        return {
            year: cell.getUTCFullYear(),
            month: cell.getUTCMonth(),
            day: cell.getUTCDate()
        };
    }
    const [day, month, year] = cellToString(cell).split('/').map(Number);
    return { year, month: month - 1, day };
};
const getTimeParts = (cell) => {
    if (cell instanceof Date) {
        return { hours: cell.getUTCHours(), minutes: cell.getUTCMinutes() };
    }
    const [hours, minutes] = cellToString(cell).split(':').map(Number);
    return { hours: hours || 0, minutes: minutes || 0 };
};
const combineDateTime = (dateCell, timeCell) => {
    const { year, month, day } = getDateParts(dateCell);
    const { hours, minutes } = getTimeParts(timeCell);
    return new Date(Date.UTC(year, month, day, hours, minutes));
};
/**
 * Acepta tanto "DD/MM/YYYY" (mismo formato que las fechas del Excel) como "YYYY-MM-DD" (ISO).
 */
const parseFormDate = (value, field) => {
    const trimmed = (value || '').trim();
    const ddmmyyyy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
        const [, day, month, year] = ddmmyyyy;
        const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
        if (isNaN(date.getTime())) {
            throw new ImportValidationError(`El campo "${field}" tiene una fecha inválida: "${value}"`);
        }
        return date;
    }
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) {
        throw new ImportValidationError(`El campo "${field}" tiene una fecha inválida: "${value}" (usa DD/MM/YYYY o YYYY-MM-DD)`);
    }
    return date;
};
const mapResultLetter = (cell) => {
    switch (cellToString(cell).toUpperCase()) {
        case 'L': return 'HOME_WIN';
        case 'V': return 'AWAY_WIN';
        case 'E': return 'DRAW';
        default: throw new ImportValidationError(`Valor de resultado no reconocido: "${cell}" (se esperaba L, V o E)`);
    }
};
const createTicketsByExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const userId = req.uid;
    const { name, startDate, endDate } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({
                msg: 'El archivo es obligatorio'
            });
        }
        const existingTournament = yield tournament_1.default.where({ name }).findOne();
        if (existingTournament) {
            return res.status(400).json({
                msg: 'El torneo ya existe',
                name
            });
        }
        const parsedStartDate = parseFormDate(startDate, 'startDate');
        const parsedEndDate = parseFormDate(endDate, 'endDate');
        // ---- Parseo hoja "Equipos" (columna A, datos desde la fila 3) ----
        const equiposRows = yield (0, node_1.default)(req.file.buffer, { sheet: 'Equipos' });
        const teamNames = new Set();
        for (let i = 2; i < equiposRows.length; i++) {
            const teamName = cellToString((_a = equiposRows[i]) === null || _a === void 0 ? void 0 : _a[0]);
            if (!teamName)
                break;
            teamNames.add(teamName);
        }
        if (teamNames.size === 0) {
            throw new ImportValidationError('La hoja "Equipos" no contiene equipos');
        }
        const teamMap = new Map();
        for (const teamName of teamNames) {
            const existingTeam = yield team_1.default.where({ name: teamName }).findOne();
            teamMap.set(teamName, {
                id: existingTeam ? String(existingTeam._id) : null,
                isNew: !existingTeam
            });
        }
        // ---- Parseo hoja "Partidos" (B=Local, C=Visita, D=Fecha, E=Hora, datos desde la fila 3) ----
        const partidosRows = yield (0, node_1.default)(req.file.buffer, { sheet: 'Partidos' });
        const parsedMatches = [];
        for (let i = 2; i < partidosRows.length; i++) {
            const homeTeamName = cellToString((_b = partidosRows[i]) === null || _b === void 0 ? void 0 : _b[1]);
            if (!homeTeamName)
                break;
            const awayTeamName = cellToString((_c = partidosRows[i]) === null || _c === void 0 ? void 0 : _c[2]);
            if (!teamMap.has(homeTeamName)) {
                throw new ImportValidationError(`El equipo local "${homeTeamName}" (fila ${i + 1} de "Partidos") no está en la hoja "Equipos"`);
            }
            if (!teamMap.has(awayTeamName)) {
                throw new ImportValidationError(`El equipo visitante "${awayTeamName}" (fila ${i + 1} de "Partidos") no está en la hoja "Equipos"`);
            }
            parsedMatches.push({
                homeTeamName,
                awayTeamName,
                matchDate: combineDateTime((_d = partidosRows[i]) === null || _d === void 0 ? void 0 : _d[3], (_e = partidosRows[i]) === null || _e === void 0 ? void 0 : _e[4])
            });
        }
        if (parsedMatches.length === 0) {
            throw new ImportValidationError('La hoja "Partidos" no contiene partidos');
        }
        // ---- Parseo hoja "Boletos" (A=folio, B=Nombre, C.. = resultados por partido, datos desde la fila 15) ----
        const boletosRows = yield (0, node_1.default)(req.file.buffer, { sheet: 'Boletos' });
        const parsedTickets = [];
        for (let i = 14; i < boletosRows.length; i++) {
            const nickName = cellToString((_f = boletosRows[i]) === null || _f === void 0 ? void 0 : _f[1]);
            if (!nickName)
                break;
            const folio = cellToString((_g = boletosRows[i]) === null || _g === void 0 ? void 0 : _g[0]);
            const predictions = parsedMatches.map((_match, matchIndex) => {
                var _a, _b;
                try {
                    return { matchIndex, result: mapResultLetter((_a = boletosRows[i]) === null || _a === void 0 ? void 0 : _a[2 + matchIndex]) };
                }
                catch (_c) {
                    throw new ImportValidationError(`Resultado inválido en la hoja "Boletos", fila ${i + 1}, partido ${matchIndex + 1}: "${(_b = boletosRows[i]) === null || _b === void 0 ? void 0 : _b[2 + matchIndex]}"`);
                }
            });
            parsedTickets.push({ folio, nickName, predictions });
        }
        if (parsedTickets.length === 0) {
            throw new ImportValidationError('La hoja "Boletos" no contiene boletos');
        }
        // ---- Escritura en base de datos (solo si el parseo de las 3 hojas fue exitoso) ----
        const tournament = new tournament_1.default({ name, startDate: parsedStartDate, endDate: parsedEndDate });
        yield tournament.save();
        let teamsCreated = 0;
        for (const [teamName, teamInfo] of teamMap) {
            if (teamInfo.isNew) {
                const newTeam = new team_1.default({
                    name: teamName,
                    shortName: deriveShortName(teamName),
                    logo: 'NA',
                    league: 'NA',
                    stadium: 'NA'
                });
                yield newTeam.save();
                teamMap.set(teamName, { id: String(newTeam._id), isNew: true });
                teamsCreated++;
            }
        }
        const matchIds = [];
        for (const parsedMatch of parsedMatches) {
            const newMatch = new match_1.default({
                homeTeam: teamMap.get(parsedMatch.homeTeamName).id,
                awayTeam: teamMap.get(parsedMatch.awayTeamName).id,
                tournamentId: tournament._id,
                matchDate: parsedMatch.matchDate
            });
            yield newMatch.save();
            matchIds.push(String(newMatch._id));
        }
        const ticketDocs = parsedTickets.map(parsedTicket => ({
            userId,
            tournamentId: tournament._id,
            nickName: parsedTicket.nickName,
            folio: parsedTicket.folio,
            predictions: parsedTicket.predictions.map(prediction => ({
                matchId: matchIds[prediction.matchIndex],
                result: prediction.result
            }))
        }));
        yield ticket_1.default.insertMany(ticketDocs);
        return res.status(201).json({
            msg: 'Torneo importado correctamente',
            tournament,
            teamsCreated,
            teamsReused: teamMap.size - teamsCreated,
            matchesCreated: matchIds.length,
            ticketsCreated: ticketDocs.length
        });
    }
    catch (error) {
        if (error instanceof ImportValidationError) {
            return res.status(400).json({
                msg: error.message
            });
        }
        console.error(error);
        return res.status(500).json({
            msg: 'Error al importar el torneo desde Excel'
        });
    }
});
exports.createTicketsByExcel = createTicketsByExcel;
