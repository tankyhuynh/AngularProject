import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { PageEvent } from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs';
import { AutheService } from 'src/app/auth/auth.service';
import { Post } from '../post.model'
import { PostService } from '../posts.service'

@Component({
  templateUrl: './post-list.component.html',
  selector: 'app-post-list',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub: Subscription;

  totalPosts = 100;
  postPerPage = 5;
  pageSizeOptions = [1,2,5,10];
  currentPage = 1;

  isLoading = false;

  isUserAuthenticated = false;
  userId: string;
  private authListenerSub: Subscription;

  constructor(public postService: PostService, private authService: AutheService){
    this.postSub = new Subscription();
  }

   ngOnInit(){
     this.postService.getPosts(this.postPerPage, this.currentPage);
     this.isLoading = true;
     this.postSub = this.postService.getPostUpdateListener()
          .subscribe( (postData: {posts: Post[], postCount: number}) => {
            this.isLoading = false;
            this.posts = postData.posts;
            this.totalPosts = postData.postCount;
          });

      this.isUserAuthenticated = this.authService.getIsAuthenticated();
      this.userId = this.authService.getUserId();
      this.authListenerSub = this.authService
          .getAuthStatusListener()
          .subscribe(isAuth => {
            this.isUserAuthenticated = isAuth;
          });

      }

    onChangedPage(pageData: PageEvent){
      this.isLoading = true;
      this.currentPage = pageData.pageIndex + 1;
      this.postPerPage = pageData.pageSize;
      this.postService.getPosts(this.postPerPage, this.currentPage);
    }


    onDeletePost(postId: string){
      this.isLoading = true;
      this.postService.deletePost(postId).subscribe( () => {
        this.postService.getPosts(this.postPerPage, this.currentPage);
      }, err => {
        this.isLoading = false;
      });
    }


    ngOnDestroy(){
      this.postSub.unsubscribe();
      this.authListenerSub.unsubscribe();
    }





}
