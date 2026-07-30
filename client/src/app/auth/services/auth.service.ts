import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthStatus, Login, User } from '../interfaces';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environments } from '../../../../environments/environments';


@Injectable({providedIn: 'root'})
export class AuthService {


    // Al mundo exterior
    public currentUser = computed( () => this._currentUser());
    public authStatus  = computed( () => this._authStatus());

    private readonly baseUrl: string = environments.baseUrl;
    private http = inject( HttpClient );

    private _currentUser = signal<User|null>(this.readStoredUser());
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);

    constructor() {}

    private readStoredUser(): User | null {
        const raw = localStorage.getItem('user');
        if (!raw) return null;
        try {
            return JSON.parse(raw) as User;
        } catch {
            return null;
        }
    }

    register( name: string, lastname: string, email: string, password: string ): Observable<boolean> {
        const url = `${this.baseUrl}/api/users`;
        const body = { name, lastname, email, password };

        return this.http.post(url, body)
        .pipe(
            map( () => true ),
            catchError( err => {
                console.log('Register failed: ' + err );
                return throwError( ()=> err.error.msg );
            })
        );
    }


    login( email: string, password: string ): Observable<boolean> {
        const url = `${this.baseUrl}/api/auth`;
        const body = { email, password };

        return this.http.post<Login>(url, body )
        .pipe(
            tap( ({ user, token }) => {
                console.log( token );
                this._currentUser.set( structuredClone(user) );
                this._authStatus.set( AuthStatus.authenticated );
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }),
            map( () => true ),
            catchError( err => {
                console.log('Login failed: ' + err );
                return throwError( ()=> err.error.msg ); 
            })
        );
    }


    checkAuthStatus(): Observable<boolean> {
        const url = `${this.baseUrl}/api/auth/check-auth-status`;

        console.log("Consultando token");
        
        const token = localStorage.getItem('token');

        console.log("Refrescando token");
        
        if( !token ){
            return of(false);
        }

        const headers = new HttpHeaders()
            .set('x-token', `${token}`);

        return this.http.get<Login>(url, { headers }).pipe(
            tap( ({ token, user }) => {
                console.log( 'Refrescando token: ' + token );

                localStorage.setItem('token', token);
                this._authStatus.set( AuthStatus.authenticated );
                if ( user ) {
                    this._currentUser.set( structuredClone(user) );
                }
            }),
            map( () => true ),
            catchError( err => {
                console.log('Check auth status failed: ' + err );
                return of(false);
            })
        );
    }
    

}