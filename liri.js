//require FS for reading and writing
var fs = require("fs");
//get user input
var input = process.argv;
var command = input[2];
if (!!input[3]){  //if a fourth argument is passed, store it
    var argumentString = input[3];
} else {
    var argumentString = ""; //if a fourth element is not passed, fill the argument variable with a blank string 
};
for (var i = 4; i < input.length; i++){  //make one string of all extra arguments in case the song or movie is more than one word
    argumentString = argumentString + " " + input[i];
};

function writeToLog(input){
    var log = "\n" + input;
    fs.appendFile("log.txt", log, function(error){
        if (error){
            console.log("an error occured while writing to log.txt");
        };
    });
}

//display last 20 tweets
function myTweets(){
    //twitter
    var keys = require("./keys.js");
    var twitter = require("twitter");
    var client = new twitter(keys.twitterKeys);
    //log all the tweets
    client.get('statuses/user_timeline', {count: "20"}, function(error, tweets, response) {
        //check for error
        if(error) {
            console.log("An error occurred finding your tweets.");
            console.log("error: " + error);
            return;
        };
        //display the tweets 
        for (var i = 0; i < tweets.length; i++){
            console.log("tweet #" + (i + 1));
            writeToLog("tweet #" + (i + 1));
            console.log(tweets[i].text);
            writeToLog(tweets[i].text);
            console.log("");
            writeToLog("");
        };
    });
};

//get song information from spotify
function spotifySong(songName){
    //require spotify npm
    var spotify = require("spotify");
    //fill in default song if none was provided
    if (songName === ""){
        songName = "the sign ace of base";
    };
    //display the song information
    spotify.search({ type: 'track', query: songName }, function(error, response) {
        //check for error
        if (error) {
            console.log("An error occurred finding your song.");
            console.log("error: " + error);
            return;
        }
        //display Artist(s)
        console.log("Artist: " + response.tracks.items[0].artists[0].name);
        writeToLog("Artist: " + response.tracks.items[0].artists[0].name);
        //display the song's name
        console.log("Song Name: " + response.tracks.items[0].name);
        writeToLog("Song Name: " + response.tracks.items[0].name);
        //display a preview link of the song from Spotify
        console.log("Preview URL: " + response.tracks.items[0].preview_url);
        writeToLog("Preview URL: " + response.tracks.items[0].preview_url);
        //display the album that the song is from
        console.log("Album: " + response.tracks.items[0].album.name);
        writeToLog("Album: " + response.tracks.items[0].album.name);
    });
};

//get song information from OMDB
function movieThis(movieName){
    //OMDB + request 
    var request = require("request");
    //check to see if a movieName was entered
    if (movieName === ""){
        movieName = "Mr. Nobody";
    };
    //create the request URL
    var queryURL = "http://omdbapi.com/?t=" + movieName + "&tomatoes=true" + "&r=json";

    //make the request
    request(queryURL, function(error, response, body){  
        //check for error
        if (error) {
            console.log("An error occured finding your movie.");
            console.log("error: " + error);
            return
        };
        //check for bad response code 
        if (response.statusCode !== 200) {
            console.log("Something went wrong. StatusCode: " + response.statusCode);
        };
        //display the results 
        var result = JSON.parse(body);
        //Title of the movie.
        console.log("Title: " + result.Title);
        writeToLog("Title: " + result.Title);
        //Year the movie came out.
        console.log("Year: " + result.Year);
        writeToLog("Year: " + result.Year);
        //IMDB Rating of the movie.
        console.log("IMDB Rating: " + result.imdbRating);
        writeToLog("IMDB Rating: " + result.imdbRating);
        //Country where the movie was produced.
        console.log("Country of Production: " + result.Country);
        writeToLog("Country of Production: " + result.Country);
        //Language of the movie.
        console.log("Language: " + result.Language);
        writeToLog("Language: " + result.Language);
        //Plot of the movie.
        console.log("Plot Summary: " + result.Plot);
        writeToLog("Plot Summary: " + result.Plot);
        //Actors in the movie.
        console.log("Actors: " + result.Actors);
        writeToLog("Actors: " + result.Actors);
        //Rotten Tomatoes Rating.
        console.log("Rotten Tomatoes Rating: " + result.tomatoRating);
        writeToLog("Rotten Tomatoes Rating: " + result.tomatoRating);
        //Rotten Tomatoes URL.
        console.log("Rotten Tomatoes URL: " + result.tomatoURL);
        writeToLog("Rotten Tomatoes URL: " + result.tomatoURL);
    });
};

//run the text file
function doWhatItSays(){
    //get the input from the text file
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error){
            console.log("an error occured when trying to read random.txt");
        } else {
            //store the contents of the file
            var inputArray = data.split(",");
            //get the contents ready for the liri app
            var command = inputArray[0];
            var argumentString = inputArray[1];
            //run the liri application
            runLiri(command, argumentString);
        };
    });
};

//a function to run the decision making and output of Liri
function runLiri(operation, otherArguments){
    console.log("");
    writeToLog("");
    writeToLog("input: " + operation + " " + otherArguments);
    //process input 
    if (operation === "my-tweets"){
        myTweets();
    } else if (operation === "spotify-this-song"){
        spotifySong(otherArguments);
    } else if (operation === "movie-this"){
        movieThis(otherArguments);
    } else if (operation === "do-what-it-says"){
        doWhatItSays();
    };
}

//run the application
runLiri(command, argumentString);
