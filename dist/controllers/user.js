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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuario = exports.enableUsuario = exports.patchUserRole = exports.putUsuario = exports.postUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = __importDefault(require("../models/users"));
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const [users, total] = yield Promise.all([
        users_1.default.find()
            .skip((page - 1) * limit)
            .limit(limit),
        users_1.default.countDocuments()
    ]);
    res.status(200).json({
        msg: 'getUsuarios',
        total,
        page,
        limit,
        users
    });
});
exports.getUsuarios = getUsuarios;
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield users_1.default.findById(id);
    if (!user) {
        return res.status(404).json({
            msg: 'El usuario no existe'
        });
    }
    res.status(200).json({
        msg: 'getUsuario',
        user
    });
});
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
    const { name, lastname, email, enabled } = req.body;
    const user = yield users_1.default.findByIdAndUpdate(id, { name, lastname, email, enabled }, { new: true });
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
const patchUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    const user = yield users_1.default.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
        return res.status(406).json({
            msg: 'El usuario no existe'
        });
    }
    res.status(200).json({
        msg: 'Rol actualizado',
        user
    });
});
exports.patchUserRole = patchUserRole;
const enableUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield users_1.default.findByIdAndUpdate(id, { enabled: true }, { new: true });
    if (!user) {
        return res.status(406).json({
            msg: 'El usuario no existe'
        });
    }
    res.status(200).json({
        msg: 'Usuario reactivado',
        user
    });
});
exports.enableUsuario = enableUsuario;
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
