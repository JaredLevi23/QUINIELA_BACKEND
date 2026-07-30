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
exports.deleteTeam = exports.putTeam = exports.postTeam = exports.getTeamById = exports.getTeams = void 0;
const team_1 = __importDefault(require("../models/team"));
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teams = yield team_1.default.find();
    return res.status(200).json({
        msg: 'GetTeams',
        teams
    });
});
exports.getTeams = getTeams;
const getTeamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const team = yield team_1.default.where({ _id: id }).findOne();
    return res.status(200).json({
        msg: 'GetTeamById',
        team
    });
});
exports.getTeamById = getTeamById;
const postTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, shortName, logo, league, stadium, enabled } = req.body;
    const team = yield team_1.default.where({ name }).findOne();
    if (team) {
        return res.status(400).json({
            msg: 'El equipo ya existe',
            name
        });
    }
    const newTeam = new team_1.default({
        name,
        shortName,
        logo,
        league,
        stadium,
        enabled
    });
    yield newTeam.save();
    return res.status(201).json({
        msg: 'Equipo creado',
        team: newTeam
    });
});
exports.postTeam = postTeam;
const putTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { name, shortName, logo, league, stadium, enabled } = _a, data = __rest(_a, ["name", "shortName", "logo", "league", "stadium", "enabled"]);
    const team = yield team_1.default.where({ _id: id }).findOne();
    if (!team) {
        return res.status(404).json({
            msg: 'El equipo no existe',
            id
        });
    }
    if (team.name !== name) {
        const teamName = yield team_1.default.where({ name }).findOne();
        if (teamName) {
            return res.status(400).json({
                msg: 'El nombre del equipo ya existe',
                name
            });
        }
    }
    data.name = name;
    data.shortName = shortName;
    data.logo = logo;
    data.league = league;
    data.stadium = stadium;
    data.enabled = enabled;
    const updatedTeam = yield team_1.default.findByIdAndUpdate(id, data, { new: true });
    return res.status(200).json({
        msg: 'Equipo actualizado',
        team: updatedTeam
    });
});
exports.putTeam = putTeam;
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const team = yield team_1.default.where({ _id: id }).findOne();
    if (!team) {
        return res.status(404).json({
            msg: 'El equipo no existe',
            id
        });
    }
    yield team_1.default.findByIdAndDelete(id);
    return res.status(200).json({
        msg: 'Equipo eliminado'
    });
});
exports.deleteTeam = deleteTeam;
