import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AutheService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;

  constructor(public authService: AutheService) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    this.authService.createUser(form.value.email, form.value.password, form.value.fullName, form.value.address);

  }

}
