var express = require('express');  // returns express function

var app = express();               // initializes express app
var handlebars = require('express-handlebars').create({defaultLayout:'main'});  // initializes handlebars handler
var bodyParser = require('body-parser');  // initializes bodyParser handler

// sets up bodyParsing for xwww URL and JSON formatted POST submissions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);  // tells app to use the handlebars engine
app.set('view engine', 'handlebars');         // sets view to process through handlebars files
app.set('port', process.argv[2]);             // sets up which port to listen for on server


// renders GET request for home page
app.get('/',function(req,res){
  res.render('home');
});

// renders GET request for /show-data page
app.get('/show-data',function(req,res){
  // parses out each parameter in the URL query string
  var qParams = [];
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p]})   // formats each list object as a dictionary with name and value keys
  }

  // adds query parameters list to context formatted as a dictionary e.g. Handlebar input object
  var context = {};
  context.dataList = qParams;
  res.render('get-show-data', context);
});

// renders POST request for /show-data page
app.post('/show-data',function(req,res){
  // parses out each parameter in the URL query string
  var urlParams = [];
  for (var p in req.query){
    urlParams.push({'name':p,'value':req.query[p]})   // formats each list object as a dictionary with name and value keys
  }
  
  // parses out each parameter in the POST body string
  var bodyParams = [];
  for (var p in req.body){
    bodyParams.push({'name':p,'value':req.body[p]})   // formats each list object as a dictionary with name and value keys
  }

  // adds both url and body parameters to context as nested input objects
  var context = {};
  context.urlList = urlParams;
  context.bodyList = bodyParams;
  
  res.render('post-show-data', context);  // calls handlebars to render page by passing context
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
