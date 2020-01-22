const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");

const { createWorker } = require("tesseract.js");

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// cors settings
var cors = require("cors");
app.use(cors());

// define port number
const port = 5000;

// socket.io connection
io.on('connection', function(socket){
    console.log('user connected');



    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});

/* Anasayfa */
app.get("/", (req,res) => {
    res.render("index.ejs");
});

http.listen(port, () => console.log(`Server started on port ${port}`));
