import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: Role[];
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  department: string;
  status?: string;
  primaryRole?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserUpdateRequest {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  department?: string;
  roles?: string[];
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface UserStats {
  total: number;
  active: number;
  pending: number;
  blocked: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  getUsers(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'asc',
    search?: string,
    role?: string,
    status?: string
  ): Observable<PagedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (search) {
      params = params.set('search', search);
    }
    if (role) {
      params = params.set('role', role);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PagedResponse<User>>(this.apiUrl, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  toggleUserStatus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, {});
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats`);
  }

  sendVerificationEmail(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/send-verification`, {});
  }
}