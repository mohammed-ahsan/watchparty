const { config: env } = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const { Server } = require("socket.io");
const http = require('http');
const { timeStamp, time } = require("console");

env();


const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//set Static folder.
app.use(express.static('./public'))

app.use('/tracks', express.static('./tracks'))
//Set an ejs view engine. 
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    res.render("index.ejs")
})


app.get("/video", async (req, res) => {
    const range = req.headers.range;
    
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = `./movies/${process.env.MOVIE_NAME}`;
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    io.on('connection', (socket) => {
        console.log('a user connected');
    });
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end })



    // const socket = await io.on("connection");
    // console.log('a user connected');



    videoStream.pipe(res);
});

io.on('connection', (socket) => {

    console.log('a user connected');
    socket.on("seek", payload=>{
        if (payload.send) {
            socket.broadcast.emit("move", payload.time);
        }
    })

    socket.on ("pause", ()=>socket.broadcast.emit("paused"))

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});



const PORT = 5000 || process.env.PORT;


server.listen(PORT, () => {
    console.log(`Server listening to PORT: ${PORT}`);
})