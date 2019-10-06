const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });

const app = express();

app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

app.get("/", (req, res) => { res.json(database.users) })

app.post("/signin", (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) })

app.get("/profile/:id", (req, res) => { profile.handleProfile(req, res, db) })

app.put("/image", (req, res) => { image.handleImage(req, res, db) })

app.post("/imageurl", (req, res) => { image.handleApiCall(req, res) })


app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})