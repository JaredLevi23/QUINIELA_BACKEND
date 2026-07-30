"use strict";
/**
 * Coleccion de mongo
 * Tournament
 * ---
 * uuid
 * name
 * startDate
 * endDate
 * registerDate
 * updateDate
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TournamentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del torneo es obligatorio'],
        unique: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria']
    },
    endDate: {
        type: Date,
        required: [true, 'La fecha de fin es obligatoria']
    }
}, {
    timestamps: true
});
TournamentSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, tournament = __rest(_a, ["__v", "_id"]);
    tournament.tournamentId = _id;
    return tournament;
};
const Tournament = (0, mongoose_1.model)('Tournament', TournamentSchema);
exports.default = Tournament;
