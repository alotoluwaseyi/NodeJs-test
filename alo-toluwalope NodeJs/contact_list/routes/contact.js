// connecting to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/contact_db');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// console.log(db);

//define schema
let Schema = mongoose.Schema;

let contactListModelSchema = new Schema({
	name: String, 
	phonenumber: Number,
	email: String,
	officeurl: String
});

//create model
let contactListModel = mongoose.model('contactListModel', contactListModelSchema);

//creating schema field types
let contactList = new Schema({
	name:{ 
		type: String
	}, 
	phonenumber:{
		type: Number
	}, 
	email:{
		type: String
	},
	officeurl:{ 
		type: String
	}
});

var express = require('express');
var router = express.Router();


/* CREATE users listing. */
router.post('/', function(req, res, next) {
	let createContact = new contactListModel({
		name: req.body.name,
		phonenumber: req.body.phonenumber,
		email: req.body.email,
		officeurl: req.body.officeurl
	});
	createContact.save(function (err, result) {
		if (err) return handleError(err);
		res.status(200).send(result);
		console.log(result)
	})
  
});


router.get('/:id', function(req, res, next) {
	let id = req.params.id;
	contactListModel.findById(id,( function(err,result){
		if (err) throw err; 
		// console.log(result);
  		res.send(result);
	}));


});


router.put('/:id', function(req, res, next) {
	let updatecontact = req.params.id ;
	contactListModel.findOneAndUpdate({_id:updatecontact},req.body,{new:true}, function(err,result){
		if(err)
			res.send(err);
		res.send('Update Successful');
	});
});


router.delete('/:id', function(req, res, next) {
	let deletecontact = req.params.id;
	contactListModel.remove({_id:deletecontact}, function(err,result){
		if(err)
			res.send(err);
		res.send('Post deleted successfully!');
	});
});

router.get('/', function(req, res, next) {
	contactListModel.find(( function(err,result){
		if (err) throw err; 
  res.send(result);
}));
});

module.exports = router;