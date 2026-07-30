import { Schema, model, Document } from "mongoose";

export interface ITeam extends Document {
    name: string;
    shortName: string;
    logo: string;
    league: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TeamSchema: Schema = new Schema({
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
TeamSchema.methods.toJSON = function() {
    const { __v, _id, ...team } = this.toObject();
    team.teamId = _id;
    return team;
}

// Índices para búsquedas optimizadas
TeamSchema.index({ country: 1 });
TeamSchema.index({ enabled: 1 });

const Team = model<ITeam>('Team', TeamSchema);

export default Team;