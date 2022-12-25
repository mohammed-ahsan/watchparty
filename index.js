import {config as env} from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import {Server} from "socket.io";


import VideoController from "./features/video/index.js";
import socketEvents from "./features/simultaneousController/index.js";


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



io.on('connection', socketEvents);


// Controllers 
app.use ("/video", VideoController);


const PORT = 5000 || process.env.PORT;


server.listen(PORT, () => {
    console.log(`Server listening to PORT: ${PORT}`);
})