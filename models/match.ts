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

import { Schema, model } from "mongoose";

const MatchSchema: Schema = new Schema({
    homeTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'El equipo local es obligatorio']
    },
    awayTeam: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
        required: [true, 'El torneo es obligatorio'],
        index: true
    }
}, {
    timestamps: true
});

MatchSchema.methods.toJSON = function(){

    const { __v, _id, ...match } = this.toObject();
    match.matchId = _id;
    return match;
}

const Match = model( 'Match', MatchSchema );

export default Match;