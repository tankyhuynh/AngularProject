const Post = require('../model/post');

exports.createPost = (req, res, next) => {
  const URL = req.protocol + "://" + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: URL + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  post.save()
        .then( createdPost => {
          console.log(createdPost);
          res.status(201).json({
            message: "Add successfully",
            post: {
              ...createdPost,
              id: createdPost._id
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Created post failed!"
          });
        });;

}

exports.getPosts = (req, res, next) => {

  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if ( pageSize && currentPage ) {
    postQuery
        .skip( pageSize * (currentPage -1) )
        .limit(pageSize);
  }

  postQuery
      .then(documents => {
        fetchedPosts = documents;
        return Post.count();
      })
      .then( count => {
        res.status(200).json({
          message: "Fetch posts successful",
          posts: fetchedPosts,
          maxPosts: count
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Fetch posts failed!"
        });
      });
}


exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      }
      else {
        res.status(404).json({message: "Post not found!!!"});
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Fetch post failed!"
      });
    });;
  }


  exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    console.log("Post: ");
    console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then(result => {
        console.log("Result: ");
        console.log(result);
        if (result.n > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Couldn't udpate post!"
        });
      });
  };


exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
        .then( (result) => {
          if ( result.n > 0 ) {
            res.status(200).json({
              message: "Message deleted"
            });
          }
          else {
            res.status(401).json({
              message: "Not Authorization"
            });
          }
        })
        .catch(err => {
          res.status(500).json({
            message: "Delete post failed"
          });
        });

  }
