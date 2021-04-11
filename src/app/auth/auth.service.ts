import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Subject } from "rxjs";
import { AuthData } from "./auth.model";

@Injectable({providedIn: 'root'})
export class AutheService {

  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;

  getUserId(){
    return this.userId;
  }

  getToken(){
    return this.token;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated(){
    return this.isAuthenticated;
  }

  constructor(private http: HttpClient, private router: Router){}

  createUser(email: string, password: string, fullName: string, address: string){
    const authData: AuthData = {email: email, password: password};
    this.http
          .post("http://localhost:3000/api/users/signup", authData)
            .subscribe(response => {
              console.log(response);
              this.router.navigate(['/']);
            });
  }

  login(email: string, password: string){

    const authData: AuthData = {email: email, password: password};
    this.http
          .post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/users/login", authData)
            .subscribe(response => {
              const token = response.token;
              this.token = token;
              if ( token ) {
                const expiresInDuration =  response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
                this.saveDataToLocalStorage(token, expirationDate, response.userId, email);
                console.log(expirationDate);
                this.router.navigate(['/']);
              }
            });
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearLocalStorage();
    this.router.navigate(['/']);
  }

  private saveDataToLocalStorage(token: string, expiration: Date, userId: string, email: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
  }

  private clearLocalStorage(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout( () => {
      this.logout();
    }, duration * 1000);
    console.log("Setting timer: " + duration);
  }

  autoAuthUser(){
    const authInformation = this.getLocalStorageData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiredIn = authInformation.expirationDate.getTime() - now.getTime();
    if ( expiredIn > 0 ) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer( expiredIn/1000 );
      this.authStatusListener.next(true);

    }
  }

  private getLocalStorageData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if ( !token || !expirationDate ) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }



}
