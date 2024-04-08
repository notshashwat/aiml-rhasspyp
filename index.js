const express = require("express")
const ejs = require("ejs");
const path = require('path');
const axios = require('axios').default;
var player = require('play-sound')(opts = {})

const tasks = {};
let taskCount = 1;
const songs = {
    "Thankyounext" : {
        "name" : "Thank You, Next",
        "artist" : "Ariana Grande",
        "album" : "7 rings"
    },
    "style" : {
        "name" : "Style",
        "artist" : "Taylor Swift",
        "album" : "1989"
    },
    "welcometonewyork" : {
        "name" : "Welcome to Newyork",
        "artist" : "Taylor Swift",
        "album" : "1989(Deluxe)"
    }
    ,
    "red" : {
        "name" : "red",
        "artist" : "Taylor Swift",
        "album" : "2012"
    }
    ,
    "summertimesadness" : {
        "name" : "Summer time sadness",
        "artist" : "Lana Del Ray",
        "album" : "Born To Die"
    },
    "Hello" : {
        "name" : "Hello",
        "artist" : "Adele",
        "album" : "13 reasons why"
    }


}


// const bodyParser= require("body-parser")

const app = express()
app.set('view engine', 'ejs');

app.get("/", function(req, res){
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile("index.html", options)
})

// app.post("/test", function(req, res){
//     console.log(req)
//     res.send("hello")
// })


app.post("/intent", (req, res) => {
    axios.post("http://localhost:12101/api/listen-for-command")
      .then(function (response) {
        result = {"message" : "error occured"}
        console.log(response.data);
        intent = response.data.intent.name;
        if(intent === "GetSongs"){
            //handle showing songs from songs.json
            console.log("here are all the songs")
            result = {"intent" : intent, "message" : songs}

        }
        else if(intent === "GetSong"){
            songName = response.data.slots.songName;
            console.log(songName)
            //handle showing song detail from songs.json
            console.log("here is the details of particular song", songName)
            songDetails = songs[songName]
            result = {"intent" : intent, "message" : songDetails}

        }
        else if(intent === "PlaySong"){
            songName = response.data.slots.songName;
            console.log(songName)
            console.log("I play the particular song", songName)
            //fetch song file path from songs.json

            result = {"intent" : intent, "message" : songName}


            //handle playing file path fetched above
            // playAudioFile('audio.mp3');

        }
        else if(intent === "SetVolume"){
            volume = response.data.slots.volume;
            console.log(volume)
            //handle setting volume
            result = {"intent" : intent, "message" : volume}




        }
        else if(intent === "PauseSong" || intent === "StopSong"){
            
            //handle pausing song
            result = {"intent" : intent, "message" : "Okay song will be paused"}


        }
        else {
            if (intent === "AddTask"){
                task = response.data.slots.task
                taskCount+=1
                tasks[taskCount] = task
                result = {"intent" : intent, "message" : "Task succesfully added"}

            }
            else if (intent === "ShowAll"){
                result = {"intent" : intent, "message" : tasks}

            }
            else if (intent === "UpdateTask"){
                taskId = response.data.slots.taskId 
                task = response.data.slots.task

                tasks[taskId] = task
                result = {"intent" : intent, "message" : "Task succesfully updated"}

            }
            else if (intent === "DeleteTask"){
                taskId = response.data.slots.taskId 
                delete tasks[taskId]
                result = {"intent" : intent, "message" : "Task succesfully deleted"}

            }
            
            
            
        }
        console.log(result)
        res.send(result);
        
        
      })
      .catch(function (error) {
        console.log(error);
      });
    // res.redirect(302, "http://localhost:12101/app/listen-for-command")
})


app.listen(process.env.PORT||4000, function(){
    console.log("Server is up on port 4000.")
})



// [GetSongs]
// list [all] [songs]
// which songs can i hear

// [GetSong]
// get ($songName){songName}

// [PlaySong]
// play ($songName){songName}
// listen [to] ($songName){songName}

// [PauseSong]
// pause [song]

// [StopSong]
// stop [song]

// [SetVolume]
// (set|increase|decrease) volume [to] (0..100){volume}
