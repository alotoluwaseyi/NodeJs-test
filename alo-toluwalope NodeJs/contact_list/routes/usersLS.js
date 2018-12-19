var express = require('express');
var router = express.Router();

// connecting to mongodb
const saltRounds = 10;
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/contact_db');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// console.log(db);

//define schema
let Schema = mongoose.Schema;

let userModelSchema = new Schema({
	email: String, 
	name: String,
	password: String, 
	cpassword: String
});

//create model
let userModel = mongoose.model('userModel', userModelSchema);

//creating schema field types
let users = new Schema({
	name:{ 
		type: String
	}, 
	email:{
		type: String
	}, 
	password:{
		type: String
	},
	cpassword:{
		type: String
	},
	updated:{ 
		type: Date, default: Date.now
	}
});


router.post('/', function(req, res, next) {
	password: req.body.password;
	var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);
	let createUsers = new userModel({
		name: req.body.name,
		email: req.body.email,
		cpassword: hash,
		password: hash
	});
	createUsers.save(function (err, result) {
		if (err) return handleError(err);
	})
  res.send('Signup Successful!');
});


router.post('/:id', function(req, res, next) {
	let email =  req.body.email;
	userModel.find({email:email},( function(err,result){
  	 let password =req.body.password;
		if(result == false){
			res.send('User not Valid!!!');	
		}else{
			password = bcrypt.compareSync(req.body.password, result.password);
			//console.log(password);
			if(password){
				res.send(result);
			}else{
					res.send('Invalid Password!');
			}

			
		}
	}));
});

router.delete('/:email', function(req, res, next) {
	let deleteuserLogin = req.params.email;
	contactListModel.remove({email:deleteuserLogin}, function(err,result){
		if(err)
			res.send(err);
		res.send('Post deleted successfully!');
	});
});

router.get('/', function(req, res) {
	if(!req.session.user) {
		return res.status(401).send();
	}
	return res.status(200).send("Welcome to my contact API")
})

module.exports = router;