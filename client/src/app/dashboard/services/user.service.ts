import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environments } from '../../../../environments/environments';
import { User } from '../../auth/interfaces/user.interface';
import { UserListResponse } from '../interfaces/user.list.response.interface';
import { UserResponse } from '../interfaces/user.response.interface';

export interface CreateUserPayload {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserPayload {
  name: string;
  lastname: string;
  email: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl: string = environments.baseUrl;

  userList = signal<User[]>([]);
  total = signal<number>(0);

  constructor(private http: HttpClient) { }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    };
  }

  getUsers(page: number = 1, limit: number = 10): Observable<User[]> {
    return this.http.get<UserListResponse>(`${this.baseUrl}/api/users?page=${page}&limit=${limit}`, {
      headers: this.headers
    }).pipe(
      map(response => {
        this.userList.set(response.users);
        this.total.set(response.total);
        return response.users;
      })
    );
  }

  getUser(uid: string): Observable<User> {
    return this.http.get<UserResponse>(`${this.baseUrl}/api/users/${uid}`, {
      headers: this.headers
    }).pipe(
      map(response => response.user)
    );
  }

  createUser(user: CreateUserPayload): Observable<User> {
    return this.http.post<UserResponse>(`${this.baseUrl}/api/users`, user, {
      headers: this.headers
    }).pipe(
      map(response => {
        this.userList.update(list => [...list, response.user]);
        return response.user;
      })
    );
  }

  updateUser(uid: string, user: UpdateUserPayload): Observable<User> {
    return this.http.put<UserResponse>(`${this.baseUrl}/api/users/${uid}`, user, {
      headers: this.headers
    }).pipe(
      map(response => {
        this.replaceInList(response.user);
        return response.user;
      })
    );
  }

  changeRole(uid: string, role: string): Observable<User> {
    return this.http.patch<UserResponse>(`${this.baseUrl}/api/users/${uid}/role`, { role }, {
      headers: this.headers
    }).pipe(
      map(response => {
        this.replaceInList(response.user);
        return response.user;
      })
    );
  }

  enableUser(uid: string): Observable<User> {
    return this.http.patch<UserResponse>(`${this.baseUrl}/api/users/${uid}/enable`, {}, {
      headers: this.headers
    }).pipe(
      map(response => {
        this.replaceInList(response.user);
        return response.user;
      })
    );
  }

  disableUser(uid: string): Observable<User> {
    return this.http.delete<UserResponse>(`${this.baseUrl}/api/users/${uid}`, {
      headers: this.headers
    }).pipe(
      map(response => {
        this.replaceInList(response.user);
        return response.user;
      })
    );
  }

  private replaceInList(user: User) {
    this.userList.update(list => list.map(u => u.uid === user.uid ? user : u));
  }

}
