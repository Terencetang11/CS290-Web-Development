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
                console.log(response.rows)
                // // do something with the response
                document.getElementById("resultsP").textContent = response.results
                document.getElementById("rowsP").textContent = response.rows
                document.getElementById("testP").textContent = response.test

                document.getElementById('name_input').value = null;
                document.getElementById('reps_input').value = null;
                document.getElementById('weight_input').value = null;
                document.getElementById('date_input').value = null;
                document.getElementById('unit_input').value = null;
                
                testRows = [{"id":1,"name":"test1","reps":0,"weight":0,"date":"0000-00-00","unit":""},{"id":2,"name":"test 2","reps":0,"weight":0,"date":"0000-00-00","unit":""},{"id":3,"name":"test 3","reps":0,"weight":0,"date":"0000-00-00","unit":""}]

                buildTable(testRows)
                
            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.send(null);
        event.preventDefault();
    })
}  

function buildTable(rows){
    // Create new Table Node on each query pull
    element = document.getElementById("results_table");
    element.parentNode.removeChild(element);
    var table = document.createElement("table");
    table.id = "results_table"
    document.getElementById("results_output").appendChild(table);

    // Create Caption Node
    var captionNode = document.createElement("caption");
    captionNode.textContent = "Tracked Exercises";
    table.appendChild(captionNode);

    // Create thead node
    var headerNode = document.createElement("thead");
    table.appendChild(headerNode);
        // Create TR
        var rowNode = document.createElement("tr");
        headerNode.appendChild(rowNode);
            // Create Header Cells
            var newCell = document.createElement("th");
            newCell.textContent = "Name";
            headerNode.appendChild(newCell);

            var newCell = document.createElement("th");
            newCell.textContent = "Reps";
            headerNode.appendChild(newCell);

            var newCell = document.createElement("th");
            newCell.textContent = "Weight";
            headerNode.appendChild(newCell);

            var newCell = document.createElement("th");
            newCell.textContent = "Date";
            headerNode.appendChild(newCell);

            var newCell = document.createElement("th");
            newCell.textContent = "Units";
            headerNode.appendChild(newCell);

    // Create tbody node
    var bodyNode = document.createElement("tbody");
    table.appendChild(bodyNode);
        // Creates each rows
        for (var row = 0; row < rows.length; row++){
            // Create TR node
            var rowNode = document.createElement("tr");
            rowNode.id = rows[row].id;
            bodyNode.appendChild(rowNode);
                // Create Table Cells
                var newCell = document.createElement("td");
                newCell.textContent = rows[row].name;
                rowNode.appendChild(newCell);

                var newCell = document.createElement("td");
                newCell.textContent = rows[row].reps;
                rowNode.appendChild(newCell);

                var newCell = document.createElement("td");
                newCell.textContent = rows[row].weight;
                rowNode.appendChild(newCell);

                var newCell = document.createElement("td");
                newCell.textContent = rows[row].date;
                rowNode.appendChild(newCell);

                var newCell = document.createElement("td");
                newCell.textContent = rows[row].unit;
                rowNode.appendChild(newCell);
                
              
        }
        
    generateBorder("table")
    generateBorder("tr")
}

// Style table
function generateBorder(tagName){
    var elements = document.getElementsByTagName(tagName)
    for(var i = elements.length - 1; i >= 0; i--){
        elements[i].style.borderStyle = "solid";
    }
}
