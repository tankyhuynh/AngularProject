import { HttpClient } from "@angular/common/http";
import { elementEventFullName } from "@angular/compiler/src/view_compiler/view_compiler";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Subject } from "rxjs";

import { environment } from '../../environments/environment';
import { AuthData } from "./auth.model";

const BACKEND_URL = environment.apiUrl + "/users/";

@Injectable({providedIn: 'root'})
export class AutheService {

  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;

  private username: string;

  getUsername(){
    return this.username;
  }

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

  createUser(email: string, password: string, fullName: string, address: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post(BACKEND_URL + "/signup", authData)
      .subscribe(() => {
        this.router.navigate(['/auth/login']);
      }, error => {
        this.authStatusListener.next(false);
        this.router.navigate(['/auth/signup']);
      });
  }

  login(email: string, password: string){

    const authData: AuthData = {email: email, password: password};
    this.http
          .post<{token: string, expiresIn: number, userId: string, email: string}>(BACKEND_URL + "/login", authData)
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
            }, err => {
              this.router.navigate(['/auth/login']);
            });
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearLocalStorage();
    // this.email = null;
    this.router.navigate(['/auth/login']);
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
    localStorage.removeItem('email');
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout( () => {
      this.logout();
    }, duration * 1000);
    console.log("Setting timer: " + duration);
  }

  autoAuthUser(){
    const authInformation = this.getLocalStorageData();

    console.log("Auto Auth");
    console.log(authInformation);

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
    const email = localStorage.getItem('email');
    if ( !token || !expirationDate ) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      email: email
    }
  }



}
