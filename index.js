const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

var time;
var startlines;
var interchange;
var line;
var path;
var numOfInterchanges;
var numOfStations;
var color = [];
var interchangeStations = [];
var timeInt;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res) {
    
    const query1 = req.body.startingName;
    const query2 = req.body.endingName;
    const url = "https://delhimetroapi.herokuapp.com/metroapi/from=" + query1 + "&to=" + query2;

    https.get(url, function(response) {

        response.on("data", function(data) {
            const pathData = JSON.parse(data);
            time = pathData.time;
            timeInt = parseInt(time);
            startlines = pathData.line1;
            startline = startlines[0];
            interchange = pathData.interchange;
            line = pathData.line2;
            line.unshift(startline);
            path = pathData.path;
            numOfInterchanges = interchange.length;
            numOfStations = path.length;

            var k = 0;
            var l = 1;
            for(var i = 0; i < numOfStations; i++) {
                var flag = 0;
                for(var j = 0; j < numOfInterchanges; j++) {
                    if(path[i] == interchange[j]) {
                        interchangeStations.push()
                        flag = 1;
                        break;
                    }
                }
                if(flag == 1) {
                    color.push(line[k++]);
                    interchangeStations.push(line[l++]);
                }
                else {
                    color.push(line[k]);
                    interchangeStations.push('');
                }
            }

            console.log(line);

            var final = [];

            for(var i = 0; i < numOfStations; i++) {
                var subarray = [];
                subarray.push(path[i].toUpperCase());
                subarray.push(color[i]);
                subarray.push(interchangeStations[i]);
                final.push(subarray);
            }

            console.log(final);

            res.render("list", {time: timeInt, numOfInterchanges: numOfInterchanges, numOfStations: numOfStations, newListItems: final});
        })
    })
});

app.post("/travel", function(req, res) {
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server is running on port 3000")
});