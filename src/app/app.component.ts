import { Component, OnInit } from '@angular/core';
import { AutheService } from './auth/auth.service';
// import { Post } from './posts/post.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AutheService ){}

  ngOnInit(){
    this.authService.autoAuthUser();
  }

}
