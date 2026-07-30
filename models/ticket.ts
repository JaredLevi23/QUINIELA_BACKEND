/**
 * Coleccion de mongo
 * Ticket
 * ---
 * uuid
 * uid
 * userUid
 * tournamentUid
 * nickName - optional
 * folio - optional
 * predictions: Prediction[
 * {
 * matchId
 * result
 * registerDate
 * updateDate
 * }
 * ]
 */

import { Schema, model } from "mongoose";

const TicketSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio'],
        index: true
    },
    tournamentId: {
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
        required: [true, 'El torneo es obligatorio'],
        index: true
    },
    nickName: {
        type: String,
        trim: true,
        default: ''
    },
    folio: {
        type: String,
        trim: true,
        default: ''
    },
    predictions: [
        {
            matchId: {
                type: Schema.Types.ObjectId,
                ref: 'Match',
                required: [true, 'El partido es obligatorio']
            },
            result: {
                type: String,
                required: [true, 'El resultado es obligatorio'],
                enum: ['HOME_WIN', 'AWAY_WIN', 'DRAW']
            },
            registerDate: {
                type: Date,
                default: Date.now
            },
            updateDate: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

TicketSchema.methods.toJSON = function(){

    const { __v, _id, ...ticket } = this.toObject();
    ticket.ticketId = _id;
    return ticket;
}

const Ticket = model( 'Ticket', TicketSchema );

export default Ticket;