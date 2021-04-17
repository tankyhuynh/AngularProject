const express = require('express');

const PostController = require('../controllers/post');

const checkAuth = require('../middleware/checkAuth');
const extractFile = require('../middleware/file')

const route = express.Router();


route.post("", checkAuth , extractFile, PostController.createPost );

route.get("" , PostController.getPosts);

route.get("/:id", checkAuth , PostController.getPost);

route.put('/:id', checkAuth , extractFile, PostController.updatePost);

route.delete("/:id", checkAuth , PostController.deletePost);


module.exports = route;
