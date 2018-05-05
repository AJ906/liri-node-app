require("dotenv").config();

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var request = require('request');

var keys = require("./keys.js");

var fs = require("fs");


var spotify = new Spotify(keys.spotify);
// 10. Make it so liri.js can take in one of the following commands:

//My-tweets

var getTweets = function() {
  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: "aj_gtcbc"
  };
  client.get("statuses/user_timeline", params, function(error, tweets, callback) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log("");
        console.log(tweets[i].text);
      }
    }
  });
};


//spotify-this-song code

var getArtists = function(artist) {
  return artist.name;
};

// Function for running a Spotify search
var getSongs = function(songName) {
  if (songName === undefined) {
    songName = "The Sign, Ace of Base";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < 5; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtists) +
        "\nsong name: " + songs[i].name + "\n" +
        "\npreview song: " + songs[i].preview_url +
        "\nalbum: " + songs[i].album.name);
        console.log("----------");
      }
    }
  );
};


//movie-this code

var getFilms = function(filmTitle) {
  if (filmTitle === undefined) {
    filmTitle = "Mr Nobody";
  }

  var apiInput = "http://www.omdbapi.com/?t=" + filmTitle + "&y=&plot=full&tomatoes=true&apikey=72656411";

  request(apiInput, function(error, callback, body) {
    if (!error && callback.statusCode === 200) {
      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title + "\n" +
      "\nYear Released: " + jsonData.Year + "\n" +
      "\nIMDB Rating: " + jsonData.imdbRating + "\n" +
      "\nRotten Tomatoes Rating: " + jsonData.Ratings[1].Value + "\n" +
      "\nCountry: " + jsonData.Country + "\n" +
      "\nLanguage: " + jsonData.Language + "\n" +
      "\nPlot: " + "\n" + jsonData.Plot + "\n" +
      "\nActors: " + jsonData.Actors);
    }
  });
};


//"do-what-it-says"

var readRandom = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      userCommand(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      userCommand(dataArr[0]);
    }
  });
};


var userCommand = function(caseData, functionData) {
  switch (caseData) {
  case "my-tweets":
    getTweets();
    break;
  case "spotify-this-song":
    getSongs(functionData);
    break;
  case "movie-this":
    getFilms(functionData);
    break;
  case "do-what-it-says":
    readRandom();
    break;
  default:
    console.log("Whatchu talkin' 'bout, Willis?!");
  }
};

// Function which takes in command line arguments and executes correct function accordingly
var runUserCommand = function(arg1, arg2) {
  userCommand(arg1, arg2);
};

// MAIN PROCESS
// =====================================
runUserCommand(process.argv[2], process.argv[3]);
