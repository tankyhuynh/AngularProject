import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'

import { environment } from "../../environments/environment";
import { Post } from './post.model'

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts : Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  getPosts(pageSize: number, currentPage: number){
    const queryParams = `?pageSize=${pageSize}&page=${currentPage}`;
    this.http.get<{message:string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
            .pipe(map( (postData) => {
              return { posts: postData.posts.map( post => {
                          return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator: post.creator
                          }
                        } ),
                      maxPosts: postData.maxPosts};
            }))
            .subscribe( transformedPostData => {
              console.log(transformedPostData);
                this.posts = transformedPostData.posts;
                this.postUpdated.next({
                  posts: [...this.posts],
                  postCount: transformedPostData.maxPosts});
            });
  }

  getPost(postId: string){
    return this.http.get<{_id:string, title:string, content:string, creator: string, imagePath: string}>("http://localhost:3000/api/posts/" + postId);
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);


    this.http.post<{message:string, post: Post}>(BACKEND_URL, postData)
              .subscribe(responseData =>{
                // const post: Post = {
                //   id: responseData.post.id,
                //   title: title,
                //   content: content,
                //   imagePath: responseData.post.imagePath
                // };
                // this.posts.push(post);
                // this.postUpdated.next({
                //   posts: [...this.posts],
                //   postCount: responseData.});
                this.router.navigate(['/']);
              });
  }

  updatePost(postId:string, title:string, content:string, image: File | string){

    let postData: Post | FormData;

    if(typeof(image) === "object"){
      console.log("in typeof(image) = object")
      postData = new FormData();
      postData.append("id", postId);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);

    }
    else {
      console.log("in ELSE typeof(image) = object")
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }

    this.http
              .put(BACKEND_URL + postId, postData)
              .subscribe(result => {
                // const updatedPost = [...this.posts];
                // const oldPostIndex = updatedPost.findIndex(p => p.id === postId);
                // const post: Post = {
                //   id: postId,
                //   title: title,
                //   content: content,
                //   imagePath: ""
                // }
                // updatedPost[oldPostIndex] = post;
                // this.posts = updatedPost;
                // this.postUpdated.next([...this.posts]);
                this.router.navigate(['/']);
              }, err => {
                this.router.navigate(['/']);
              });

  }


  deletePost(postId: string){
    return this.http
              .delete(BACKEND_URL + postId);
  }




}
