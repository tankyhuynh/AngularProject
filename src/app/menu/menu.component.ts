import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutheService } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  imgPath = "http://localhost:3000/images/img.jpg";

  items = 4;

  isUserAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AutheService){};


  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuthenticated();

    this.authListenerSub = this.authService
                  .getAuthStatusListener()
                  .subscribe(isAuth => {
                    this.isUserAuthenticated = isAuth;
                  });
  }


}
