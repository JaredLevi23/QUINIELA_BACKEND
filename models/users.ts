
import { Schema, model } from "mongoose";
import { UserRole } from "../helpers/enums";

const UserSchema: Schema = new Schema({

    name: {
        type: String,
        required: [ true, 'El nombre es obligatorio']
    },

    lastname: {
        type: String,
        required: [ true, 'El apellido es obligatorio' ]
    },

    email: {
        type: String,
        required: [ true, 'El correo electronico es obligatorio']
    },

    role: {
        type: String,
        enum: Object.values( UserRole ),
        default: UserRole.USER
    },

    enabled: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    },

    password: {
        type: String,
        required: [ true, 'La contraseña es obligatoria' ]
    }
});


UserSchema.methods.toJSON = function(){

    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

const User = model( 'User', UserSchema );

export default User;








