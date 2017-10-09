//*****1. require express********
// Load the express module that we install using npm
var express = require("express");
var app = express();
//require mongoose
var mongoose = require('mongoose');
//format date
var moment = require('moment');
moment().format();

//***PARSE DATA*****
// require body-parser
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
// our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/rabbit'); //basic_mongoose is the name of my db

//create schema
var RabbitSchema = new mongoose.Schema({
 name: { type: String, required: true, minlength: 2},
 age: { type: Number, required: true},
 color: { type: String, required: true},
 cuteness_level: { type: Number, required: true},
 added_by: { type: String, required: true},
},{timestamps: true });

//If I would another user to have more atributes I need to create another Schema
mongoose.model('Rabbit', RabbitSchema); // We are setting this Schema in our Models as 'User'
var Rabbit = mongoose.model('Rabbit') // We are retrieving this Schema from our Models, named 'User'

//**** 2. create routes ********
app.get('/', function(request, response) {
  Rabbit.find({}, function (err, rabbits) {
    if(err){
      console.log(err);
    }else {
      response.render('index', {rabbits_info: rabbits, moment: moment})
    }
  })
});

//****POST ROUTE*****
app.post('/rabbit/new', function (req, res){
  res.redirect('/rabbits')
});

//render new rabbit form
app.get('/rabbits', function(request, response) {
  response.render('create_rabbit')
});

// route to process new Rabbit form data:
app.post('/rabbits', function (req, res){
  console.log("POST DATA ", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var rabbit = new Rabbit({name: req.body.name, age : req.body.age, color: req.body.color, cuteness_level : req.body.level, added_by: req.body.added_by});
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  rabbit.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong', err);
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      //redirect the user back to the root route.
      res.redirect('/')
    }
  })
});

//render show one specific rabbit form
app.get('/rabbit/:id', function(req, response) {
  Rabbit.find({_id: req.params.id}, function (err, rabbit) {
    if(err){
      console.log(err);
    }else {
      response.render('show_rabbit', {rabbit_info: rabbit, moment: moment})
    }
  })
});

//Delete
app.get('/rabbit/delete/:id', function(req, res) {
  Rabbit.remove({_id: req.params.id}, function (err, rabbit) {
    if(err){
      console.log(err);
    }else {
      res.redirect('/')
    }
  })
});

//Edit Rabbit!!!
app.get('/rabbit/edit/:id', function(req, response) {
  Rabbit.find({_id: req.params.id}, function (err, rabbit) {
    if(err){
      console.log(err);
    }else {
      response.render('edit_rabbit', {rabbit_info: rabbit, moment: moment})
    }
  })
});

// UPDATE and post rabbit info!!!
app.post('/rabbit/:id', function (req, res){
  Rabbit.findByIdAndUpdate(req.params.id, { $set: {name: req.body.name, age : req.body.age, color: req.body.color, cuteness_level : req.body.level, added_by: req.body.added_by}}, { new: true }, function (err, rabbit) {
   if (err) return handleError(err);
   res.redirect('/')
 });

});

//******3 Call the listen function
// Tell the express app to listen on port 8000
app.listen(8000, function() {
  console.log("listening on port 8000");
})
