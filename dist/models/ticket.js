"use strict";
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
 * matchUid
 * result
 * registerDate
 * updateDate
 * }
 * ]
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
const TicketSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio'],
        index: true
    },
    tournamentId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
TicketSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, ticket = __rest(_a, ["__v", "_id"]);
    ticket.ticketId = _id;
    return ticket;
};
const Ticket = (0, mongoose_1.model)('Ticket', TicketSchema);
exports.default = Ticket;
//# sourceMappingURL=ticket.js.map