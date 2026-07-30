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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTournament = exports.putTournament = exports.postTournament = exports.getTournamentById = exports.getTournaments = void 0;
const tournament_1 = __importDefault(require("../models/tournament"));
const getTournaments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tournaments = yield tournament_1.default.find();
    return res.status(200).json({
        msg: 'GetTournaments',
        tournaments
    });
});
exports.getTournaments = getTournaments;
const getTournamentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const tournament = yield tournament_1.default.where({ _id: id }).findOne();
    return res.status(200).json({
        msg: 'GetTournamentById',
        tournament
    });
});
exports.getTournamentById = getTournamentById;
const postTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, startDate, endDate } = req.body;
    const tournament = yield tournament_1.default.where({ name }).findOne();
    if (tournament) {
        return res.status(400).json({
            msg: 'El torneo ya existe',
            name
        });
    }
    const newTournament = new tournament_1.default({
        name,
        startDate,
        endDate
    });
    yield newTournament.save();
    return res.status(201).json({
        msg: 'Torneo creado',
        tournament: newTournament
    });
});
exports.postTournament = postTournament;
const putTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { name, startDate, endDate } = _a, data = __rest(_a, ["name", "startDate", "endDate"]);
    const tournament = yield tournament_1.default.where({ _id: id }).findOne();
    if (!tournament) {
        return res.status(404).json({
            msg: 'El torneo no existe',
            id
        });
    }
    data.name = name;
    data.startDate = startDate;
    data.endDate = endDate;
    data.updateDate = new Date();
    const updatedTournament = yield tournament_1.default.findByIdAndUpdate(id, data, { new: true });
    return res.status(200).json({
        msg: 'Torneo actualizado',
        tournament: updatedTournament
    });
});
exports.putTournament = putTournament;
const deleteTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const tournament = yield tournament_1.default.where({ _id: id }).findOne();
    if (!tournament) {
        return res.status(404).json({
            msg: 'El torneo no existe',
            id
        });
    }
    yield tournament_1.default.findByIdAndDelete(id);
    return res.status(200).json({
        msg: 'Torneo eliminado',
        tournament
    });
});
exports.deleteTournament = deleteTournament;
//# sourceMappingURL=tournament.js.map