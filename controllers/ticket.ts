import Ticket from "../models/ticket";
import Team from "../models/team";
import Tournament from "../models/tournament";
import { Request, Response } from "express";
import Match from "../models/match";
import readXlsxFile from 'read-excel-file/node';
import { CellValue, Row } from 'read-excel-file/node';

export const createTicket = async ( req:Request, res:Response )=> {

    const userId = (req as any).uid;
    const { tournamentId, nickName, folio, predictions } = req.body;

    try {

        // Validar el numero de predicciones y ids de partidos al crear el ticket
        if( !predictions || predictions.length === 0 ){
            return res.status( 400 ).json({
                msg: 'El ticket debe contener al menos una predicción'
            });
        }

        // Consultar los encuentros del torneo
        const matches = await Match.where( { tournamentId } ).find();

        // Validar que los ids de prediccion corresponden a partidos del torneo
        if( matches.length === 0 ){
            return res.status( 400 ).json({
                msg: 'El torneo no tiene partidos asociados o no existe'
            });
        }

        if( predictions.length !== matches.length ){
            return res.status( 400 ).json({
                msg: `El numero de predicciones (${ predictions.length }) no coincide con el numero de partidos del torneo (${ matches.length })`
            });
        }

        for( const prediction of predictions ){
            const matchExists = matches.some( match => String( match._id ) === prediction.matchId );
            if( !matchExists ){
                return res.status( 400 ).json({
                    msg: `El partido con ID ${ prediction.matchId } no pertenece al torneo o no existe`
                });
            }
        }

        const ticket = new Ticket({ userId, tournamentId, nickName, folio, predictions });
        await ticket.save();

        return res.status( 201 ).json({
            msg: 'Ticket creado correctamente',
            ticket
        });

    } catch (error) {
        console.error(error);
        return res.status( 500 ).json({
            msg: 'Error al crear el ticket'
        });
    }
}

export const getTicketsByTournament = async ( req:Request, res:Response )=> {

    const { id } = req.params;

    try {
        console.log( id );

        const tickets = await Ticket.where( { tournamentId: id } ).find();
        return res.status( 200 ).json({
            msg: 'Tickets obtenidos correctamente',
            tickets
        });

    } catch (error) {
        console.error(error);
        return res.status( 500 ).json({
            msg: 'Error al obtener los tickets'
        });
    }
}


/**
 * Excepción usada para distinguir errores de datos del Excel (400) de errores inesperados (500).
 */
class ImportValidationError extends Error {}

const cellToString = ( cell: CellValue | undefined ): string => {
    if( cell === undefined || cell === null ){
        return '';
    }
    return String( cell ).trim();
}

const deriveShortName = ( name: string ): string => {
    return name.replace( /\s+/g, '' ).toUpperCase().slice( 0, 4 );
}

const getDateParts = ( cell: CellValue | undefined ) => {
    if( cell instanceof Date ){
        return {
            year: cell.getUTCFullYear(),
            month: cell.getUTCMonth(),
            day: cell.getUTCDate()
        };
    }
    const [ day, month, year ] = cellToString( cell ).split('/').map( Number );
    return { year, month: month - 1, day };
}

const getTimeParts = ( cell: CellValue | undefined ) => {
    if( cell instanceof Date ){
        return { hours: cell.getUTCHours(), minutes: cell.getUTCMinutes() };
    }
    const [ hours, minutes ] = cellToString( cell ).split(':').map( Number );
    return { hours: hours || 0, minutes: minutes || 0 };
}

const combineDateTime = ( dateCell: CellValue | undefined, timeCell: CellValue | undefined ): Date => {
    const { year, month, day } = getDateParts( dateCell );
    const { hours, minutes } = getTimeParts( timeCell );
    return new Date( Date.UTC( year, month, day, hours, minutes ) );
}

/**
 * Acepta tanto "DD/MM/YYYY" (mismo formato que las fechas del Excel) como "YYYY-MM-DD" (ISO).
 */
const parseFormDate = ( value: string, field: string ): Date => {
    const trimmed = ( value || '' ).trim();

    const ddmmyyyy = trimmed.match( /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/ );
    if( ddmmyyyy ){
        const [ , day, month, year ] = ddmmyyyy;
        const date = new Date( Date.UTC( Number( year ), Number( month ) - 1, Number( day ) ) );
        if( isNaN( date.getTime() ) ){
            throw new ImportValidationError( `El campo "${ field }" tiene una fecha inválida: "${ value }"` );
        }
        return date;
    }

    const date = new Date( trimmed );
    if( isNaN( date.getTime() ) ){
        throw new ImportValidationError( `El campo "${ field }" tiene una fecha inválida: "${ value }" (usa DD/MM/YYYY o YYYY-MM-DD)` );
    }
    return date;
}

const mapResultLetter = ( cell: CellValue | undefined ): 'HOME_WIN' | 'AWAY_WIN' | 'DRAW' => {
    switch( cellToString( cell ).toUpperCase() ){
        case 'L': return 'HOME_WIN';
        case 'V': return 'AWAY_WIN';
        case 'E': return 'DRAW';
        default: throw new ImportValidationError( `Valor de resultado no reconocido: "${ cell }" (se esperaba L, V o E)` );
    }
}

interface ParsedMatch {
    homeTeamName: string;
    awayTeamName: string;
    matchDate: Date;
}

interface ParsedTicket {
    folio: string;
    nickName: string;
    predictions: { matchIndex: number; result: 'HOME_WIN' | 'AWAY_WIN' | 'DRAW' }[];
}

export const createTicketsByExcel = async ( req:Request, res:Response )=> {

    const userId = (req as any).uid;
    const { name, startDate, endDate } = req.body;

    try {

        if( !req.file ){
            return res.status( 400 ).json({
                msg: 'El archivo es obligatorio'
            });
        }

        const existingTournament = await Tournament.where( { name } ).findOne();
        if( existingTournament ){
            return res.status( 400 ).json({
                msg: 'El torneo ya existe',
                name
            });
        }

        const parsedStartDate = parseFormDate( startDate, 'startDate' );
        const parsedEndDate = parseFormDate( endDate, 'endDate' );

        // ---- Parseo hoja "Equipos" (columna A, datos desde la fila 3) ----
        const equiposRows = await readXlsxFile( req.file.buffer, { sheet: 'Equipos' } ) as Row[];
        const teamNames = new Set<string>();
        for( let i = 2; i < equiposRows.length; i++ ){
            const teamName = cellToString( equiposRows[i]?.[0] );
            if( !teamName ) break;
            teamNames.add( teamName );
        }

        if( teamNames.size === 0 ){
            throw new ImportValidationError( 'La hoja "Equipos" no contiene equipos' );
        }

        const teamMap = new Map<string, { id: string | null; isNew: boolean }>();
        for( const teamName of teamNames ){
            const existingTeam = await Team.where( { name: teamName } ).findOne();
            teamMap.set( teamName, {
                id: existingTeam ? String( existingTeam._id ) : null,
                isNew: !existingTeam
            });
        }

        // ---- Parseo hoja "Partidos" (B=Local, C=Visita, D=Fecha, E=Hora, datos desde la fila 3) ----
        const partidosRows = await readXlsxFile( req.file.buffer, { sheet: 'Partidos' } ) as Row[];
        const parsedMatches: ParsedMatch[] = [];
        for( let i = 2; i < partidosRows.length; i++ ){
            const homeTeamName = cellToString( partidosRows[i]?.[1] );
            if( !homeTeamName ) break;
            const awayTeamName = cellToString( partidosRows[i]?.[2] );

            if( !teamMap.has( homeTeamName ) ){
                throw new ImportValidationError( `El equipo local "${ homeTeamName }" (fila ${ i + 1 } de "Partidos") no está en la hoja "Equipos"` );
            }
            if( !teamMap.has( awayTeamName ) ){
                throw new ImportValidationError( `El equipo visitante "${ awayTeamName }" (fila ${ i + 1 } de "Partidos") no está en la hoja "Equipos"` );
            }

            parsedMatches.push({
                homeTeamName,
                awayTeamName,
                matchDate: combineDateTime( partidosRows[i]?.[3], partidosRows[i]?.[4] )
            });
        }

        if( parsedMatches.length === 0 ){
            throw new ImportValidationError( 'La hoja "Partidos" no contiene partidos' );
        }

        // ---- Parseo hoja "Boletos" (A=folio, B=Nombre, C.. = resultados por partido, datos desde la fila 15) ----
        const boletosRows = await readXlsxFile( req.file.buffer, { sheet: 'Boletos' } ) as Row[];
        const parsedTickets: ParsedTicket[] = [];
        for( let i = 14; i < boletosRows.length; i++ ){
            const nickName = cellToString( boletosRows[i]?.[1] );
            if( !nickName ) break;
            const folio = cellToString( boletosRows[i]?.[0] );

            const predictions = parsedMatches.map( ( _match, matchIndex ) => {
                try {
                    return { matchIndex, result: mapResultLetter( boletosRows[i]?.[2 + matchIndex] ) };
                } catch {
                    throw new ImportValidationError( `Resultado inválido en la hoja "Boletos", fila ${ i + 1 }, partido ${ matchIndex + 1 }: "${ boletosRows[i]?.[2 + matchIndex] }"` );
                }
            });

            parsedTickets.push({ folio, nickName, predictions });
        }

        if( parsedTickets.length === 0 ){
            throw new ImportValidationError( 'La hoja "Boletos" no contiene boletos' );
        }

        // ---- Escritura en base de datos (solo si el parseo de las 3 hojas fue exitoso) ----
        const tournament = new Tournament({ name, startDate: parsedStartDate, endDate: parsedEndDate });
        await tournament.save();

        let teamsCreated = 0;
        for( const [ teamName, teamInfo ] of teamMap ){
            if( teamInfo.isNew ){
                const newTeam = new Team({
                    name: teamName,
                    shortName: deriveShortName( teamName ),
                    logo: 'NA',
                    league: 'NA',
                    stadium: 'NA'
                });
                await newTeam.save();
                teamMap.set( teamName, { id: String( newTeam._id ), isNew: true } );
                teamsCreated++;
            }
        }

        const matchIds: string[] = [];
        for( const parsedMatch of parsedMatches ){
            const newMatch = new Match({
                homeTeam: teamMap.get( parsedMatch.homeTeamName )!.id,
                awayTeam: teamMap.get( parsedMatch.awayTeamName )!.id,
                tournamentId: tournament._id,
                matchDate: parsedMatch.matchDate
            });
            await newMatch.save();
            matchIds.push( String( newMatch._id ) );
        }

        const ticketDocs = parsedTickets.map( parsedTicket => ({
            userId,
            tournamentId: tournament._id,
            nickName: parsedTicket.nickName,
            folio: parsedTicket.folio,
            predictions: parsedTicket.predictions.map( prediction => ({
                matchId: matchIds[ prediction.matchIndex ],
                result: prediction.result
            }) )
        }) );

        await Ticket.insertMany( ticketDocs );

        return res.status( 201 ).json({
            msg: 'Torneo importado correctamente',
            tournament,
            teamsCreated,
            teamsReused: teamMap.size - teamsCreated,
            matchesCreated: matchIds.length,
            ticketsCreated: ticketDocs.length
        });

    } catch ( error ) {
        if( error instanceof ImportValidationError ){
            return res.status( 400 ).json({
                msg: error.message
            });
        }
        console.error( error );
        return res.status( 500 ).json({
            msg: 'Error al importar el torneo desde Excel'
        });
    }
}
