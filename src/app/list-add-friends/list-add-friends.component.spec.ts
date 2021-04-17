import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAddFriendsComponent } from './list-add-friends.component';

describe('ListAddFriendsComponent', () => {
  let component: ListAddFriendsComponent;
  let fixture: ComponentFixture<ListAddFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAddFriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAddFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
