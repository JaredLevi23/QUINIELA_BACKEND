import express, { Application } from "express";

import auth  from "../routes/auth";
import categories  from "../routes/categories";
import users from "../routes/user";
import teams from "../routes/teams";
import matchs from "../routes/match";
import tournament from "../routes/tournament";
import tickets from "../routes/ticket";

import cors from "cors";
import db from "../db/connection";

class Server{

    private app: Application;
    private port: string;
    private apiPaths = {
        auth : '/api/auth',
        categories: '/api/categories',
        users: '/api/users',
        teams: '/api/teams',
        matchs: '/api/matchs',
        tournament: '/api/tournaments',
        tickets: '/api/tickets'
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '8000';

        this.connectionDB();

        // middlewares
        this.middlewares();

        // routes
        this.routes();
    }

    async connectionDB(){
        try {

            await db();
            
            
        } catch (error) {
            console.log( error );
            
        }
    }

    middlewares(){
        // Cors
        this.app.use( cors() );

        // Lectura del body
        this.app.use( express.json() );

        // Carpeta publica
        this.app.use( express.static('public') );
    }

    routes(){
        this.app.use( this.apiPaths.auth, auth );
        this.app.use( this.apiPaths.categories, categories );
        this.app.use( this.apiPaths.users, users );
        this.app.use( this.apiPaths.teams, teams );
        this.app.use( this.apiPaths.matchs, matchs );
        this.app.use( this.apiPaths.tournament, tournament );
        this.app.use( this.apiPaths.tickets, tickets );
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto: ' + this.port);
        });
    }

}

export default Server;