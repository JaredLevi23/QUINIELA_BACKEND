"use strict";
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
const TeamSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del equipo es obligatorio'],
        unique: true,
        trim: true
    },
    shortName: {
        type: String,
        required: [true, 'El nombre corto es obligatorio'],
        uppercase: true,
        trim: true,
        maxlength: [4, 'El nombre corto debe tener máximo 4 caracteres'],
        minlength: [2, 'El nombre corto debe tener mínimo 2 caracteres']
    },
    logo: {
        type: String,
        required: [true, 'El logo del equipo es obligatorio'],
        default: 'https://via.placeholder.com/150'
    },
    league: {
        type: String,
        required: [true, 'La liga es obligatoria'],
        trim: true
    },
    stadium: {
        type: String,
        required: [true, 'El estadio es obligatorio'],
        trim: true
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Método para formatear respuesta
TeamSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, team = __rest(_a, ["__v", "_id"]);
    team.teamId = _id;
    return team;
};
// Índices para búsquedas optimizadas
TeamSchema.index({ name: 1 });
TeamSchema.index({ country: 1 });
TeamSchema.index({ enabled: 1 });
const Team = (0, mongoose_1.model)('Team', TeamSchema);
exports.default = Team;
//# sourceMappingURL=team.js.map