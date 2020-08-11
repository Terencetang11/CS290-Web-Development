document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
    document.getElementById('exercise_submit').addEventListener('click', function(event){
        var req = new XMLHttpRequest();
        var payload = 'http://flip3.engr.oregonstate.edu:11179/?type=insert';
        payload += "&name=" + document.getElementById('name_input').value;
        payload += "&reps=" + document.getElementById('reps_input').value;
        payload += "&weight=" + document.getElementById('weight_input').value;
        payload += "&date=" + document.getElementById('date_input').value;
        payload += "&unit=" + document.getElementById('unit_input').value;

        req.open("GET", payload, true);
        console.log(payload);
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                console.log("response received:")
                console.log(req.responseText)
                var response = JSON.parse(req.responseText);
                // // do something with the response
                document.getElementById("resultsP").textContent = response.results
                document.getElementById("rowsP").textContent = response.rows
                document.getElementById("testP").textContent = response.test
                

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