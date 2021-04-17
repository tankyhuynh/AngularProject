import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  imgPath = "http://localhost:3000/images/img.jpg";

  constructor() { }

  ngOnInit(): void {
  }

}
