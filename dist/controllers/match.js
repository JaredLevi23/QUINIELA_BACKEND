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
exports.deleteMatch = exports.putMatch = exports.postMatch = exports.getMatchesByTournament = exports.getMatchById = exports.getMatchs = void 0;
const match_1 = __importDefault(require("../models/match"));
const getMatchs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const matchs = yield match_1.default.find()
        .populate('homeTeam', 'name')
        .populate('awayTeam', 'name')
        .populate('tournamentId', 'name');
    return res.status(200).json({
        msg: 'GetMatchs',
        matchs
    });
});
exports.getMatchs = getMatchs;
const getMatchById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const match = yield match_1.default.findById(id)
        .populate('homeTeam', 'name')
        .populate('awayTeam', 'name')
        .populate('tournamentId', 'name');
    return res.status(200).json({
        msg: 'GetMatchById',
        match
    });
});
exports.getMatchById = getMatchById;
const getMatchesByTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tournamentId } = req.params;
    const matches = yield match_1.default.find({ tournamentId })
        .populate('homeTeam', 'name logo')
        .populate('awayTeam', 'name logo')
        .populate('tournamentId', 'name');
    return res.status(200).json({
        msg: 'GetMatchesByTournament',
        matches
    });
});
exports.getMatchesByTournament = getMatchesByTournament;
const postMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   homeTeam: string;
    //   awayTeam: string;
    //   homeTeamLogo?: string;
    //   awayTeamLogo?: string;
    //   league: string;
    //   season: string;
    //   matchday?: number;
    //   venue?: string;
    //   date: Date;
    //   status: MatchStatus;
    //   result: IMatchResult;
    //   externalId?: string; // ID de API externa (ej: API-Football)
    //   createdAt: Date;
    //   updatedAt: Date;
    const { homeTeam, awayTeam, tournamentId, matchDate } = req.body;
    const match = yield match_1.default.where({ homeTeam, awayTeam, tournamentId, matchDate }).findOne();
    if (match) {
        return res.status(400).json({
            msg: 'El partido ya existe',
            homeTeam,
            awayTeam,
            tournamentId
        });
    }
    const newMatch = new match_1.default({
        homeTeam,
        awayTeam,
        tournamentId,
        matchDate
    });
    yield newMatch.save();
    return res.status(201).json({
        msg: 'Partido creado',
        match: newMatch
    });
});
exports.postMatch = postMatch;
const putMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { homeTeam, awayTeam, tournamentId, homeScore, awayScore } = _a, data = __rest(_a, ["homeTeam", "awayTeam", "tournamentId", "homeScore", "awayScore"]);
    const match = yield match_1.default.where({ _id: id }).findOne();
    if (!match) {
        return res.status(404).json({
            msg: 'El partido no existe',
            id
        });
    }
    data.homeTeam = homeTeam;
    data.awayTeam = awayTeam;
    data.homeScore = homeScore || match.homeScore;
    data.awayScore = awayScore || match.awayScore;
    data.tournamentId = tournamentId;
    data.updateDate = new Date();
    const updatedMatch = yield match_1.default.findByIdAndUpdate(id, data, { new: true });
    return res.status(200).json({
        msg: 'Partido actualizado',
        match: updatedMatch
    });
});
exports.putMatch = putMatch;
const deleteMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const match = yield match_1.default.where({ _id: id }).findOne();
    if (!match) {
        return res.status(404).json({
            msg: 'El partido no existe',
            id
        });
    }
    yield match_1.default.findByIdAndDelete(id);
    return res.status(200).json({
        msg: 'Partido eliminado'
    });
});
exports.deleteMatch = deleteMatch;
//# sourceMappingURL=match.js.map