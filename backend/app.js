const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

const Post = require('./model/post');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://tanky:"
                  + process.env.MONGO_ATLAT_PASSWORD
                  +"@tankydbs.3zvgh.mongodb.net/myFirstDatabase?retryWrites=true")
        .then( () => {
          console.log("Connected to MongoDB server");
        })
        .catch( (err) => {
          console.log("Fail to connect " + err);
        });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "images")));

app.use( (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATH, PUT , DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
