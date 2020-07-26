var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.get('/',function(req,res){
  res.render('home');
});

app.get('/other-page',function(req,res){
  res.render('other-page');
});


function genContext(){
  var stuffToDisplay = {};
  stuffToDisplay.time = (new Date(Date.now())).toLocaleTimeString('en-US');
  return stuffToDisplay;
}

app.get('/time',function(req,res){
  
  res.render('time', genContext());
  console.log(genContext())
});

function getRandomInt(max) {
  var stuffToDisplay = {};
  stuffToDisplay.num = Math.floor(Math.random() * Math.floor(max));
  return stuffToDisplay;
}

app.get('/random-number', function(req,res){
  var num = getRandomInt(1000);
  res.render('random-number', num);
  console.log(num)
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
