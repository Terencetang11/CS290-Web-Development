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
  var qParams = [];
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p]})
  }
  var context = {};
  context.dataList = qParams;
  res.render('get-show-data', context);
});


// renders POST request for /show-data page
app.post('/show-data',function(req,res){
  // parse out url parameters
  var urlParams = [];
  for (var p in req.query){
    urlParams.push({'name':p,'value':req.query[p]})
  }
  
  // parse out post Body parameters
  var bodyParams = [];
  for (var p in req.body){
    bodyParams.push({'name':p,'value':req.body[p]})
  }
  console.log(bodyParams);
  console.log(req.body);

  // adds both url and body parameters to context as nested input objects
  var context = {};
  context.urlList = urlParams;
  context.bodyList = bodyParams;
  
  res.render('post-show-data', context);  // calls handlebars to render page by passing context
});


app.get('/get-loopback-improved',function(req,res){
  var qParams = [];
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p]})
  }
  var context = {};
  context.dataList = qParams;
  res.render('get-loopback-improved', context);
});

app.post('/post-loopback', function(req,res){
  var qParams = [];
  for (var p in req.body){
    qParams.push({'name':p,'value':req.body[p]})
  }
  console.log(qParams);
  console.log(req.body);
  var context = {};
  context.dataList = qParams;
  res.render('post-loopback', context);
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
