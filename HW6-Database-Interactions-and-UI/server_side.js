
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
  // on arrive to homepage, checks if a table exists; resets table otherwise
  if (!req.query.type){
    mysql.pool.query('SELECT * FROM exercise', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.rows = JSON.stringify(rows);
      res.render('home', context);
    })
    
    // mysql.pool.query("DROP TABLE IF EXISTS exercise", function(err){
    //   // SQL query for creating a new table
    //   var createString = "CREATE TABLE exercise(" +
    //   "id INT PRIMARY KEY AUTO_INCREMENT," +
    //   "name VARCHAR(255) NOT NULL," +
    //   "reps INT," +
    //   "weight INT," +
    //   "date DATE," +
    //   "lbs BOOLEAN)";
    //   mysql.pool.query(createString, function(err, results, rows, fields){
    //     if(err){
    //       next(err);
    //       return;
    //     }
    //     res.render('home',context);
    //   });
    // });
  }
  // when inserting new exercise
  else if (req.query.type == "insert"){
    mysql.pool.query("INSERT INTO exercise SET ?" //(`name`, 'reps', 'weight', 'date', 'unit') VALUES (?)"
    , {name: req.query.name, reps:req.query.reps, weight:req.query.weight, date:req.query.date, lbs:req.query.lbs}
    , function(err, results){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT * FROM exercise', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.rows = JSON.stringify(rows);
        res.type('application/json');
        res.send(context);
      })
    });
  }
  // when deleting an exercise
  else if (req.query.type == "delete"){
    mysql.pool.query("DELETE FROM exercise WHERE id=?", [req.query.id], function(err, result){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT * FROM exercise', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.rows = JSON.stringify(rows);
        console.log(context)
        res.type('application/json')
        res.send(context);
      })
    });
  }
  // when updating an existing exercise
  else if (req.query.type == "update"){
    mysql.pool.query("SELECT * FROM exercise WHERE id=?", [req.query.id], function(err, result){
      if(err){
        next(err);
        return;
      }
      if(result.length == 1){
        var curVals = result[0];
        mysql.pool.query("UPDATE exercise SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
          [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
          function(err, result){
          if(err){
            next(err);
            return;
          }
          mysql.pool.query('SELECT * FROM exercise', function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.rows = JSON.stringify(rows);
            res.type('application/json')
            res.send(context);
          })
        });
      }
    });
  } else {
    context.test = "error occured"
    console.log("error occurred")
    res.send(context);
  }
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
    var createString = "CREATE TABLE exercise(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT," +
    "weight INT," +
    "date DATE," +
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
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
