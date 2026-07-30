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

import { Schema, model } from "mongoose";

const TournamentSchema: Schema = new Schema({
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


TournamentSchema.methods.toJSON = function(){

    const { __v, _id, ...tournament } = this.toObject();
    tournament.tournamentId = _id;
    return tournament;
}

const Tournament = model( 'Tournament', TournamentSchema );

export default Tournament;