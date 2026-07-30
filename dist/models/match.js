"use strict";
/**
 * Coleccion de mongo
 * Match
 * ---
 * uuid
 * homeTeam
 * awayTeam
 * homeScore
 * awayScore
 * matchDate
 * tournamentUid
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
const MatchSchema = new mongoose_1.Schema({
    homeTeam: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'El equipo local es obligatorio']
    },
    awayTeam: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'El equipo visitante es obligatorio']
    },
    homeScore: {
        type: Number,
        default: 0
    },
    awayScore: {
        type: Number,
        default: 0
    },
    matchDate: {
        type: Date,
        required: [true, 'La fecha del partido es obligatoria']
    },
    tournamentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: [true, 'El torneo es obligatorio'],
        index: true
    }
}, {
    timestamps: true
});
MatchSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, match = __rest(_a, ["__v", "_id"]);
    match.matchId = _id;
    return match;
};
const Match = (0, mongoose_1.model)('Match', MatchSchema);
exports.default = Match;
//# sourceMappingURL=match.js.map