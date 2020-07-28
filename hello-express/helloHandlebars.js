var express = require('express');
var app = express();
app.set('port', process.argv[2]);

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var session = require('express-session');
app.use(session({secret: 'supersecretpassword'}));

// sets up bodyParsing for xwww URL and JSON formatted POST submissions
var bodyParser = require('body-parser');  // initializes bodyParser handler
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// render homepage
app.get('/',function(req,res){
  res.render('home');
});

//renders other-page
app.get('/other-page',function(req,res){
  res.render('other-page');
});

// renders counts page which maintains a sessions tracker for count of page visits by single browser instance
app.get('/counts', function(req,res){
  var context = {}
  context.counts = req.session.count || 0;
  req.session.count = context.counts + 1;
  res.render('counts', context);
});

app.post('/counts', function(req,res){
  // if post body contains command = resetCounter;
    // set req.session.count = 0
  if (req.query.command == 'resetCounter'){
    req.session.count = 0
  }
  var context = {}
  context.counts = req.session.count || 0;
  req.session.count = context.counts + 1;
  res.render('counts', context);
})

// generates time as handlebars input object
function genContext(){
  var stuffToDisplay = {};
  stuffToDisplay.time = (new Date(Date.now())).toLocaleTimeString('en-US');
  return stuffToDisplay;
}
// renders time page
app.get('/time',function(req,res){
  res.render('time', genContext());
  console.log(genContext())
});

// generates random int as handlebars input object
function getRandomInt(max) {
  var stuffToDisplay = {};
  stuffToDisplay.num = Math.floor(Math.random() * Math.floor(max));
  return stuffToDisplay;
}
// renders random number page
app.get('/random-number', function(req,res){
  var num = getRandomInt(1000);
  res.render('random-number', num);
  console.log(num)
});

// handles 404 status code issues
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

// handles 500 status code issues
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

// sets which web port to listen to for http requests
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
