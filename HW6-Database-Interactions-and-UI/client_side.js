app.get('/insert',function(req,res,next){
    var context = {};
    mysql.pool.query("INSERT INTO todo (`name`) VALUES (?)", [req.query.c], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Inserted id " + result.insertId;
        res.render('home',context);
    });
});


document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
    document.getElementById('exercise_submit').addEventListener('click', function(event){
        var req = new XMLHttpRequest();
        var payload = 'sql="INSERT INTO todo (`name`) VALUES (?)"'
        payload += "&name=" + document.getElementById('name_input')
        payload += "&reps=" + document.getElementById('reps_input')
        payload += "&weight=" + document.getElementById('weight_input')
        payload += "&date=" + document.getElementById('date_input')
        payload += "&unit=" + document.getElementById('unit_input')

        req.open("GET", payload, true);
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                // do something with the response
                
                // document.getElementById('city').textContent = response.name;
                // document.getElementById('country').textContent = response.sys.country;
                // document.getElementById('currentWeather').textContent = response.main.temp;
                // document.getElementById('currentTemp').textContent = response.main.temp;
                // document.getElementById('feelsLike').textContent = response.main.feels_like;
                // document.getElementById('humidity').textContent = response.main.humidity;
            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.send(null);
        event.preventDefault();
    })
}  