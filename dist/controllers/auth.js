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
exports.checkAuthStatus = exports.restorePassword = exports.userAuthentication = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = __importDefault(require("../models/users"));
const generate_jwt_1 = __importDefault(require("../helpers/generate_jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuthentication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const query = users_1.default.where({ email: email });
        const userLogin = yield query.findOne();
        if (!userLogin) {
            return res.status(400).json({
                msg: 'Verifica tus credenciales'
            });
        }
        if (!userLogin.enabled) {
            return res.status(400).json({
                msg: 'El usuario esta desactivado'
            });
        }
        const validatePassword = bcryptjs_1.default.compareSync(password, userLogin.password);
        if (!validatePassword) {
            return res.status(400).json({
                msg: 'Verifica tus credenciales'
            });
        }
        const token = yield (0, generate_jwt_1.default)(userLogin.id);
        res.status(200).json({
            user: userLogin,
            token
        });
    }
    catch (error) {
        res.status(400).json({
            msg: error
        });
    }
});
exports.userAuthentication = userAuthentication;
const restorePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield users_1.default.where({ email }).findOne();
    if (!user) {
        return res.status(400).json({
            msg: 'El correo electronico no existe'
        });
    }
    // Enviar correo
    return res.status(200).json({
        msg: 'Se ha enviado el correo electronico para restablecer su contraseña',
        email
    });
});
exports.restorePassword = restorePassword;
const checkAuthStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('Verificando el token');
        const token = req.header('x-token') || '';
        console.log('Token recibido: ' + token);
        const { uid } = jsonwebtoken_1.default.verify(token, (_a = process.env.SECRETORPRIVATEKEY) !== null && _a !== void 0 ? _a : '');
        console.log('Verificando el token ' + token + ":" + uid);
        const userAuth = yield users_1.default.findOne({ '_id': uid });
        if (!userAuth) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe'
            });
        }
        //Verificar si el usuario esta activo
        if (!userAuth.enabled) {
            return res.status(401).json({
                msg: 'Usuario desactivado'
            });
        }
        return res.status(200).json({
            token: token,
        });
    }
    catch (error) {
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }
});
exports.checkAuthStatus = checkAuthStatus;
//# sourceMappingURL=auth.js.map