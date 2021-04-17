const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
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
          const token = jwt.sign({
                            email: fetchedUser.email,userId: fetchedUser._id},
                            process.env.JWT_KEY,
                            {expiresIn: "30m"});
          res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            email: fetchedUser.email
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!"
          });
        });
}

exports.getUser = (req, res, next) => {

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
      .catch(err => {
        res.status(500).json({
          message: "Failed to fetch users"
        });
      });
}
