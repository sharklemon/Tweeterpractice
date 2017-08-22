//get required libraries and key file
var keysfile = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var randfile = "./random.txt";
var fs = require('fs');

//take keys out of key file
var Tkeys = keysfile.twitterKeys;
var Skeys = keysfile.spotifyKeys;
var Okey = keysfile.OMDBKey.Okey;

//put T keys and S keys in vars for API calls later
var Tclient = new Twitter({
  consumer_key: Tkeys.consumer_key,
  consumer_secret: Tkeys.consumer_secret,
  access_token_key: Tkeys.access_token_key,
  access_token_secret: Tkeys.access_token_secret
});

var spotify = new Spotify({
  id: Skeys.Client_ID,
  secret: Skeys.Client_Secret
});


//get user input
var lenny = process.argv.length;
var switcher = process.argv[2];
var userinput = "";
//get the name of movie or song and put them in correct API adding form
if(lenny>3){
	console.log("capturing title that user input and making it API-able");
	for(var i = 3; i<lenny;i++){
		userinput = userinput + process.argv[i] + "+"
	};
	userinput = userinput.substring(0, userinput.length - 1); 
	console.log("post slice " + userinput);
}

// get calls from file
function readfile(){
	var fileinput =""
	var fileswitch=""
	fs.readFile(randfile, "utf8", function(error, data){
		if (error){
			return console.log("error in the file reader");
		}
		console.log("you are reading file");
		dataArr = data.split(",");
		console.log(dataArr);
		fileswitch = dataArr[0];
		console.log("holder is " + fileswitch);
		fileinput= dataArr[1];
		console.log("raw output is "+fileinput);
		userinput=fileinput.replace(/ /g, "+").replace(/"/g, "");
		console.log(userinput);
		console.log("switcher is " + switcher + "and you are in the first if fileswitch is " + fileswitch);
		switcher = fileswitch;
		console.log("post replacement switcher "+switcher);
		apiCalls();
	});
};


//define functions for the switcher
function my_tweets(){
//This will show your last 20 tweets and when they were created at in your terminal/bash window.
	console.log("you are in tweets function");
	Tclient.get('statuses/user_timeline', {screen_name: 'shark1emon'}, function(error, tweets, response) {
	  if(error) throw error;
	  //var theobject = JSON.parse(tweets);
	  for (var i = 0; i<20; i++)
	  console.log("Tweet number " +(i+1)+ " was created at " + tweets[i].created_at + ". The text is " + tweets[i].text);
	});
};

//functions for switcher
function spotify_this_song(){
	spotify.search({ type: 'track', query: userinput }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }

	console.log("album name " + data.tracks.items[0].album.name); 
	console.log("artists " + data.tracks.items[0].artists[0].name); 	
	console.log("song name " + data.tracks.items[0].name); 	
	console.log("link " + data.tracks.next); 	});
};

function movie_this(){
	if (userinput === ""){
		var url = 'http://www.omdbapi.com/?apikey=' + Okey + '&t=Mr.+Nobody';
		console.log(url);
		request(url, function (error, response, body) {
			if(error){
				console.log('error searching mr. nobody: ', error); // Print the error if one occurred
			}
			var parsedJ = JSON.parse(body);
			console.log('Movie Title: ', parsedJ.Title); 
			console.log('Release Date: ', parsedJ.Released); 
			console.log('IMDB Rating: ', parsedJ.Ratings[0].Value); 
			console.log('Country of production: ', parsedJ.Country);
			console.log('Language: ', parsedJ.Language); 
			console.log('Plot: ', parsedJ.Plot); 
			console.log('Actors: ', parsedJ.Actors); 
		});
	}
	else{
		var url = 'http://www.omdbapi.com/?apikey=' + Okey + '&t=' + userinput;
		console.log(url);
		request(url, function (error, response, body) {
			if(error){
				console.log('error searching ' + userinput + ': ', error); // Print the error if one occurred
			}
			var parsedJ = JSON.parse(body);
			console.log('Movie Title: ', parsedJ.Title); 
			console.log('Release Date: ', parsedJ.Released); 
			console.log('IMDB Rating: ', parsedJ.Ratings[0].Value); 
			console.log('Country of production: ', parsedJ.Country);
			console.log('Language: ', parsedJ.Language); 
			console.log('Plot: ', parsedJ.Plot); 
			console.log('Actors: ', parsedJ.Actors); 
		});
	}	
};


//check if we need to read the file to find the "real" switcher
if(switcher === "do-what-it-says"){
	readfile();
}
else{
	apiCalls();
}

//switch to handle what the actual API call needs to be based on user input OR the file that was read
function apiCalls(){
	switch (switcher) {
		case "my-tweets":
		console.log("you are in tweets switch");
		my_tweets();
		break;

		case "spotify-this-song":
		console.log("you're in spotify the input val is " + userinput);
		spotify_this_song();
		break;

		case "movie-this":
		console.log("you're in movie the input val is " + userinput);
		movie_this();
		break;
	}
}	
