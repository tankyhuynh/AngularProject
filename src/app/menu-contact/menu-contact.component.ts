import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutheService } from '../auth/auth.service';

@Component({
  selector: 'app-menu-contact',
  templateUrl: './menu-contact.component.html',
  styleUrls: ['./menu-contact.component.css']
})
export class MenuContactComponent implements OnInit {
  isUserAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AutheService) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuthenticated();

    this.authListenerSub = this.authService
                  .getAuthStatusListener()
                  .subscribe(isAuth => {
                    this.isUserAuthenticated = isAuth;
                  });
  }

}
