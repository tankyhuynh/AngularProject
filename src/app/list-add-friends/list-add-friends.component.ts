import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-add-friends',
  templateUrl: './list-add-friends.component.html',
  styleUrls: ['./list-add-friends.component.css']
})
export class ListAddFriendsComponent implements OnInit {
  imgPath = "http://localhost:3000/images/img.jpg";

  constructor() { }

  ngOnInit(): void {
  }

}
