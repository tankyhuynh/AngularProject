import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutheService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AutheService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
          .subscribe(authStatus => {

          });
  }

  onSignup(form: NgForm){
    if(form.invalid){
      console.log("Invalid form !!!!");
      return;
    }
    this.authService
          .createUser(form.value.email, form.value.password, form.value.fullName, form.value.address);

  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
