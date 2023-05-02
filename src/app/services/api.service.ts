import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private URL: string = 'http://localhost:3000/registered_users';

  constructor(private http: HttpClient) { }

  registerUser(registerObj: User) {
    return this.http.post<User>(`${this.URL}`, registerObj);
  }

  getRegisteredUsers() {
    return this.http.get<User[]>(`${this.URL}`);
  }

  updateRegisteredUsers(registerObj: User, id: number) {
    return this.http.put<User>(`${this.URL}/${id}`, registerObj);

  }

  deleteRegisteredUsers(id: number) {
    return this.http.delete<User>(`${this.URL}`);
  }

  getRegistereduserId(id: number) {
    return this.http.get<User>(`${this.URL}/${id}`);
  }
}
