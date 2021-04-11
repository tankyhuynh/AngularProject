const express = require('express');
const multer = require('multer');

const Post = require('../model/post');
const checkAuth = require('../middleware/checkAuth');

const route = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extention = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + extention);
  }
});

route.post("", checkAuth , multer({storage: storage}).single("image") , (req, res, next) => {
  const URL = req.protocol + "://" + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: URL + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  // console.log(req.userData);
  // return res.status(200).json({});

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
        });

});


route.get("" ,(req, res, next) => {

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
      .catch(()=>{
        console.log("Error when add ");
      });
});


route.get("/:id", checkAuth , (req, res, next) => {
Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    }
    else {
      res.status(404).json({message: "Post not found!!!"});
    }
});
});


route.put('/:id', checkAuth , multer({storage: storage}).single("image") , (req, res, next) => {

  let imagePath = req.body.imagePath;
  if ( req.file ) {
    const url = req.protocol + "://" + req.get('host');
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userId
  });
  console.log(post);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
        .then( (result) => {
          if ( result.nModified > 0 ) {
            res.status(200).json({
              message: "Updated"
            });
          }
          else {
            res.status(401).json({
              message: "Not Authorization"
            });
          }
        });
})


route.delete("/:id", checkAuth ,(req, res, next) => {
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
      });

});


module.exports = route;
