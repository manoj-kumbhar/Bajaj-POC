import {inject, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable,tap} from "rxjs";

import {  AuthRequest} from "../models/auth-request";
import { AuthResponse } from "../models/auth-response";

@Injectable({
  providedIn: 'root'
})
export class SecurityApi {
  private _baseUrl:string="http://localhost:9090/api";
  private _httpClient = inject(HttpClient);

  public authenticateCredential(user:AuthRequest):Observable<AuthResponse>{
    // Backend auth route
    return this._httpClient.post<any>(`${this._baseUrl}/auth/login`,user,{
      headers:{
        'Content-Type':'application/json'
      }
    }).pipe(tap({
      next:response => {
        if(response?.token){
        localStorage.setItem("token",response.token);
        const r = response.user?.role || response.role;
        const e = response.user?.email || response.email;
        const n = response.user?.name;
        localStorage.setItem("role", r || 'customer');
        localStorage.setItem("email", e || '');
        if (n) localStorage.setItem('name', n);
        }
      }
    }))
  }

  getToken():string|null{
    return localStorage.getItem('token');
  }

    getRole():string|null{
    return localStorage.getItem('role');
  }

  logout():void{
    localStorage.clear();
  }

  // optional registration endpoint; backend /api/users may support it
  register(payload: any): Promise<any> {
    // Map to backend's expected auth/register schema
    const body:any = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      role: payload.role,
    };
    // Optional: map single address text into addresses[0].street if provided
    if (payload.address) {
      body.addresses = [
        { label: 'Home', street: payload.address, isDefault: true }
      ];
    }
    return this._httpClient.post(`${this._baseUrl}/auth/register`, body, {
      headers: { 'Content-Type': 'application/json' }
    }).toPromise();
  }

  me(){
    const token = localStorage.getItem('token') || '';
    return this._httpClient.get(`${this._baseUrl}/auth/me`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
  }
}
