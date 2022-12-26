// State Decalarations
var socket = io();

const video = document.getElementById("video");

const btn = document.getElementById("seek");
const pause = document.getElementById("pause");
const pause_btn = document.getElementById("pause_btn");
const play_btn = document.getElementById("play_btn");




// Event Listeners
btn.addEventListener("click", (event) => {
    onSeeked(event, socket, video, true)
});

pause.addEventListener("click", (e) => {
    pause_play_controll (video, socket)
});

video.addEventListener("click", ()=>{
    pause_play_controll (video, socket)
})

document.addEventListener("keydown", (e) => {
    e = e || window.event;
    if (e.key === "ArrowLeft") {
        horizontal_arrow_press(false, socket);
    }
    else if (e.key === "ArrowRight") {
        horizontal_arrow_press(true, socket); 
    } 
    else if (e.key === " ") {
        pause_play_controll (video, socket)
    }


})

// Socket Listeners
socket.on("move", (time) => onMove(time, video))
socket.on("paused", () => pause_play (video));
socket.on("seeking_forward", time=>seeking_forward(time, video))



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


const switchPausePlay = (flag = true) => {
    if (flag) {
        pause_btn.style.display = "inline-block";
        play_btn.style.display = "none";
    } else {
        pause_btn.style.display = "none";
        play_btn.style.display = "inline-block";
    }
}

const horizontal_arrow_press = (forward = true, socket) => {
    if (forward) {
        socket.emit("seek_forward", forward)
    } else {
        socket.emit("seek_forward", forward)
    }

}


const pause_play_controll = (video, socket)=>{
    pause_play (video);
    socket.emit("pause");
}


const pause_play = (video)=>{
    if (!video.paused) {
        video.pause ()
        switchPausePlay(false);

    } else {
        video.play ();
        switchPausePlay();
    }
}

const seeking_forward = (time, video)=>{
    timestamp = video.currentTime + time; 

    if (timestamp<0) {
        video.currentTime = 0;
    } else {
        video.currentTime = timestamp;
    }
}

// driver method
const main = (e) => {
    switchPausePlay()
}


window.addEventListener("load", main);