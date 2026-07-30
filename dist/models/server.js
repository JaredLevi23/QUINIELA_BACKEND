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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("../routes/auth"));
const categories_1 = __importDefault(require("../routes/categories"));
const user_1 = __importDefault(require("../routes/user"));
const teams_1 = __importDefault(require("../routes/teams"));
const match_1 = __importDefault(require("../routes/match"));
const tournament_1 = __importDefault(require("../routes/tournament"));
const ticket_1 = __importDefault(require("../routes/ticket"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("../db/connection"));
class Server {
    constructor() {
        this.apiPaths = {
            auth: '/api/auth',
            categories: '/api/categories',
            users: '/api/users',
            teams: '/api/teams',
            matchs: '/api/matchs',
            tournament: '/api/tournaments',
            tickets: '/api/tickets'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8000';
        this.connectionDB();
        // middlewares
        this.middlewares();
        // routes
        this.routes();
    }
    connectionDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, connection_1.default)();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    middlewares() {
        // Cors
        this.app.use((0, cors_1.default)());
        // Lectura del body
        this.app.use(express_1.default.json());
        // Carpeta publica
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.apiPaths.auth, auth_1.default);
        this.app.use(this.apiPaths.categories, categories_1.default);
        this.app.use(this.apiPaths.users, user_1.default);
        this.app.use(this.apiPaths.teams, teams_1.default);
        this.app.use(this.apiPaths.matchs, match_1.default);
        this.app.use(this.apiPaths.tournament, tournament_1.default);
        this.app.use(this.apiPaths.tickets, ticket_1.default);
        // Fallback SPA: cualquier ruta que no sea /api/* devuelve el index.html de Angular
        this.app.get('/*splat', (_req, res) => {
            res.sendFile(path_1.default.join(process.cwd(), 'public', 'index.html'));
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto: ' + this.port);
        });
    }
}
exports.default = Server;
