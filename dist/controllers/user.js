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
exports.deleteUsuario = exports.putUsuario = exports.postUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = __importDefault(require("../models/users"));
const getUsuarios = (req, res) => {
    res.status(200).json({
        msg: 'getUsuarios'
    });
};
exports.getUsuarios = getUsuarios;
const getUsuario = (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        msg: 'getUsuario',
        id
    });
};
exports.getUsuario = getUsuario;
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lastname, email, password } = req.body;
    const userExist = yield users_1.default.where({
        email
    });
    if (userExist.length !== 0) {
        return res.status(400).json({
            msg: 'Email already exists',
            email
        });
    }
    const user = new users_1.default({
        name, lastname, email
    });
    const salt = bcryptjs_1.default.genSaltSync();
    user.password = bcryptjs_1.default.hashSync(password, salt);
    yield user.save();
    // Enviar verificacion 
    res.status(200).json({
        msg: 'User created',
        user
    });
});
exports.postUsuario = postUsuario;
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { google } = _a, data = __rest(_a, ["google"]);
    const user = yield users_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
        return res.status(406).json({
            msg: 'El usuario no existe'
        });
    }
    res.status(200).json({
        msg: 'Usuario actualizado',
        user
    });
});
exports.putUsuario = putUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield users_1.default.findByIdAndUpdate(id, { enabled: false }, { new: true });
    if (!user) {
        return res.status(406).json({
            msg: 'El usuario no existe'
        });
    }
    res.status(200).json({
        msg: 'Usuario Desactivado',
        user
    });
});
exports.deleteUsuario = deleteUsuario;
//# sourceMappingURL=user.js.map