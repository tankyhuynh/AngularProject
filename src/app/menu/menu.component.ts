import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  imgPath = "http://localhost:3000/images/img.jpg";

  items = 4;

  constructor() { }

  ngOnInit(): void {
  }

}
