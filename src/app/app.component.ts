import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutheService } from './auth/auth.service';
// import { Post } from './posts/post.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isUserAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AutheService){};

  ngOnInit(){
    this.authService.autoAuthUser();

    this.isUserAuthenticated = this.authService.getIsAuthenticated();

    this.authListenerSub = this.authService
                  .getAuthStatusListener()
                  .subscribe(isAuth => {
                    this.isUserAuthenticated = isAuth;
                  });
  }

}
