const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");

const { createWorker } = require("tesseract.js");

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const db = require("./helper/db")();
var mongoose = require('mongoose')

/* Send Mail Settings */
var sendMail = require("./helper/sendMail");

/* Upload Image Settings */
var creatorImageName = require("./helper/creatorImageName");
var myImageHelper = require("./helper/myImageHelper");
const multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploadImages');
    },
    filename: (req, file, cb) => {
        console.log(file);
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + creatorImageName.generateImage() + '.' + filetype);
    }
});
var upload = multer({ storage: storage });


/* DB MODEL FILES */
var Contact = require("./models/Contact");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// cors settings
var cors = require("cors");
app.use(cors());

// define port number
const port = 5000;

// socket.io connection
io.on('connection', function (socket) {
    console.log('user connected');



    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});



/* Anasayfa */
app.get("/", (req, res) => {
    res.render("index.ejs");
});

/* Nedir */
app.get("/nedir", (req, res) => {
    res.render("nedir.ejs");
});

/* Kullanım */
app.get("/kullanim", (req, res) => {
    res.render("kullanim.ejs");
});

/* Nedir */
app.get("/sss", (req, res) => {
    res.render("sss.ejs");
});

/* Api */
app.get("/apikullanim", (req, res) => {
    res.render("apikullanim.ejs");
});

/* Iletisim */
app.get("/iletisim", (req, res) => {
    res.render("iletisim.ejs", {msg: ""});
});
app.post("/iletisim", (req, res) => {
    var currentdate = new Date(); 
    var datetime =  currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

    new Contact({
        namesurname: req.body.namesurname,
        mail: req.body.mail,
        title: req.body.title,
        content: req.body.content,
        date: datetime,
        isRead: "false",
    }).save().then((data)=>{
        console.log("Contact Save Succesful");
        res.render("iletisim.ejs", {msg: "Mesaj Başarıyla Gönderildi."});
    }).catch((err)=>{
        console.log("Contact Save Error");
        res.json("Error");
    });

});

/* Kayit Ol */
app.get("/kayitol", (req, res) => {
    res.render("kayitol.ejs");
});


/* API OCR Endpoint */
app.get("/api",(req,res)=>{
    res.json("Lutfen Bu Adrese POST Istegi Atiniz.");
});
app.post("/api", upload.single('file'), (req, res) => {

    if (req.file) {
        var myFileName = "";
        myFileName = 'http://localhost:5000/uploadImages/' + req.file.filename;


        const worker = createWorker({
            logger: m => console.log(m)
        });

        var resultText = "";

        (async () => {
            await worker.load();
            await worker.loadLanguage('tur');
            await worker.initialize('tur');
            const { data: { text } } = await worker.recognize(myFileName);
            resultText = text;
            await worker.terminate();
        })().then(() => {
            myImageHelper.deleteImage(myFileName).then((dataa) => {
                return res.json(resultText);
            });
        });
    } else {
        return res.json("File is null.");
    }

});



http.listen(port, () => console.log(`Server started on port ${port}`));
