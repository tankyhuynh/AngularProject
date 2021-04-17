const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user');
const UserController = require('../controllers/user');

const route = express.Router();

route.post("/signup", UserController.createUser);

route.post("/login", UserController.userLogin);

route.get("" , UserController.getUser);


module.exports  = route;
