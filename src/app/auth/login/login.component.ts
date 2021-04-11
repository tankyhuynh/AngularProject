import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AutheService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;

  constructor(public authSevice: AutheService) { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm){
    if (form.invalid) {
      return;
    }
    this.authSevice.login(form.value.email, form.value.password);
  }

}
