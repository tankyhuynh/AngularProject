import { Component, OnDestroy, OnInit } from "@angular/core"
import { BehaviorSubject } from "rxjs";
import { Subscription } from "rxjs";
import { AutheService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private authListenerSub: Subscription;

  username: string;

  imgPath = "http://localhost:3000/images/img.jpg";

  constructor(private authService: AutheService){};

  ngOnInit(){
    this.isUserAuthenticated = this.authService.getIsAuthenticated();

    this.authListenerSub = this.authService
                  .getAuthStatusListener()
                  .subscribe(isAuth => {
                    this.username = this.authService.getUsername();
                    this.isUserAuthenticated = isAuth;
                  });
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListenerSub.unsubscribe();
  }

}
