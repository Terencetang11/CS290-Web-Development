
var express = require('express');
var app = express();
app.set('port', process.argv[2]);

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var mysql = require('./dbcon.js');

// set up file path for file management and directory and path middleware for serving up static files
var path = require('path');
app.use(express.static('public'));

// homepage load needs:
  // check if query exists OR create table query
  // render homepage 

app.get('/',function(req,res,next){
  var context = {};
  // on arrive to homepage
  if (!req.query.type){
    mysql.pool.query("DROP TABLE IF EXISTS exercise", function(err){
      // SQL query for creating a new table
      var createString = "CREATE TABLE exercise(" +
      "id INT PRIMARY KEY AUTO_INCREMENT," +
      "name VARCHAR(255) NOT NULL," +
      "reps INT," +
      "weight INT," +
      "date DATE," +
      "unit VARCHAR(255))";
      mysql.pool.query(createString, function(err, results, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.results = JSON.stringify(results);
        context.fields = JSON.stringify(fields);
        context.rows = JSON.stringify(rows);
        context.test = "new table created"
        console.log("new table made")
        res.render('home',context);
      });
    });
  }
  // when inserting new exercise
  else if (req.query.type == "insert"){
    console.log("new insert occurred")
    context.test = "new row added"
    res.render('home',context);
    // mysql.pool.query("INSERT INTO exercise (`name`, 'reps', 'weight', 'date', 'unit' ) VALUES (?)"
    // , [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.unit ]
    // , function(err, result){
    //   if(err){
    //     next(err);
    //     return;
    //   }
    //   context.results = "Inserted id " + result.insertId;
    //   context.rows = JSON.stringify(rows);
    //   context.test = "new row added"
    //   res.send(context);
    // });
  } else {
    context.test = "error occured"
    console.log("error occurred")
    res.send(context);
  }
  // when deleting a record

  // when editing a record
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
