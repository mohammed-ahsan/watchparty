// State Decalarations
var socket = io();

const video = document.getElementById("video");

const btn = document.getElementById("seek");
const pause = document.getElementById("pause");
const pause_btn = document.getElementById ("pause_btn");
const play_btn = document.getElementById("play_btn");



// driver method
const main = (e)=>{
    switchPausePlay ()
}




window.addEventListener ("load", main);


// Event Listeners
btn.addEventListener("click", (event) => {
    onSeeked(event, socket, video, true)
});

pause.addEventListener("click", (e) => {
    if (!video.paused) {
    onPause(video, socket)

    } else {
        onPlay (video);
    }
});

play.addEventListener("click", e => onPlay(video));


// Socket Listeners
socket.on("move", (time) => onMove(time, video))
socket.on("paused", () => video.pause());



// methods

const onSeeked = (e, socket, video, send = false) => {
    console.log(video);
    socket.emit("seek", {
        time: video.currentTime,
        send: send
    });
    onPause(video, socket);
}

const onMove = (time, video) => {
    send = false;
    video.currentTime = time;
    video.pause();
    //  onPause (video, socket);
}

const onPause = (video, socket) => {
    video.pause();
    switchPausePlay (false);
    socket.emit("pause");
}

const onPlay = (video) => {
    video.play();
    switchPausePlay ();
}

const switchPausePlay = (flag=true)=>{
    if (flag) {
        pause_btn.style.display = "inline-block";
        play_btn.style.display = "none";
    } else {
        pause_btn.style.display = "none";
        play_btn.style.display = "inline-block";
    }
}