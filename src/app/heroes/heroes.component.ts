import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  hero = {
    name: 'Winstorm',
    age: 22,
    address: 'VietNam'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
