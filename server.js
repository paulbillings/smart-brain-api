const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});

db.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

const database = {
	users: [
		{
			id:"123",
			name: "John",
			email: "john@gmail.com",
			password: "cookies",
			entries: 0,
			joined: new Date()
		},
		{
			id:"124",
			name: "Sally",
			email: "sally@gmail.com",
			password: "bananas",
			entries: 0,
			joined: new Date()
		}
	]
}

app.get("/", (req, res) => {
	res.json(database.users);
})

app.post("/signin", (req, res) => {
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json("error logging in");
	}
	
})

app.post("/register", (req, res) => {
	const { email, name, password } = req.body;
	db("users")
	.returning("*")
	.insert({
		email: email,
		name: name,
		joined: new Date()
	})
	.then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).json("unable to register"))
})

app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	db.select("*").from("users").where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json("Not found")
			}	
		})
		.catch(err => res.status(400).json("Error getting user"))
})

app.put("/image", (req, res) => {
	const { id } = req.body;
  	db("users").where('id', '=', id)
  	.increment("entries", 1)
  	.returning("entries")
  	.then(entries => {
  		res.json(entries[0]);
  	})
  	.catch(err => res.status(400).json("unable to get entries"))
})


app.listen(3001, () => {
	console.log("app is running on port 3001");
})