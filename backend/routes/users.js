const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user');
const user = require('../model/user');

const route = express.Router();

route.post("/signup", (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
          .then(hashPass => {
            const user = new  User({
              email: req.body.email,
              password: hashPass,
              fullName: req.body.fullName,
              address: req.body.address
            });
            user.save()
                  .then(result => {
                    res.status(201).json({
                      message: "User created!!!!!",
                      user: result
                    });
                  });
          })
          .catch(err => {
            res.status(500).json({
              err: err
            });
          });


});


route.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
        .then(user => {
          if(!user){
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          fetchedUser = user;
          return bcrypt.compare(req.body.password, user.password);
        })
        .then(response => {
          if (!response) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, "my_secret_key", {expiresIn: "30m"});
          res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
          });
        })
        .catch( err => {
          return res.status(401).json({
            message: "Auth failed"
          });
        });
});

route.get("" ,(req, res, next) => {

  const postQuery = User.find();
  let fetchedUsers;

  postQuery
      .then(documents => {
        fetchedUsers = documents;
        return User.count();
      })
      .then( count => {
        res.status(200).json({
          message: "Fetch users successful",
          users: fetchedUsers
        });
      })
      .catch(()=>{
        console.log("Error when add ");
      });
});



module.exports  = route;
