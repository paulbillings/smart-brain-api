const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const database = {
	users: [
		{
			id:"123",
			name: "John",
			email: "john@gmail.com",
			entries: 0,
			joined: new Date()
		},
		{
			id:"124",
			name: "Sally",
			email: "sally@gmail.com",
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: "987",
			hash: "",
			email: "john@gmail.com"
		}
	]
}

app.get("/", (req, res) => {
	res.send(database.users);
})

app.post("/signin", (req, res) => {
		// Load hash from your password DB.
	bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
    	// res == true
	});
	bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
   		// res == false
	});
	if (req.body.email === database.user[0].email &&
		req.body.password === database.user[0].password) {
		res.json("success");
	} else {
		res.status(400).json("error logging in");
	}
	
})

app.post("/register", (req, res) => {
	const { email, name, password } = req.body;
	bcrypt.hash(password, saltRounds, function(err, hash) {
  		// Store hash in your password DB.
  		console.log(hash);
	});
	database.users.push({
		id:"125",
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
		})
	res.json(database.users[database.users.length - 1])
})

app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		} 
	})
	if (!found) {
		res.status(400).json("User not found");
	}
})

app.put("/image", (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		} 
	})
	if (!found) {
		res.status(400).json("User not found");
	}
})


app.listen(3000, () => {
	console.log("app is running on port 3000");
})