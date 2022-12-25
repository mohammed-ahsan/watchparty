console.log ("Hi")

var socket = io();

const video = document.getElementById ("video");

const btn = document.getElementById ("seek");
const pause = document.getElementById("pause");
const play = document.getElementById("play");

btn.addEventListener ("click", (event)=>{
    onSeeked (event, socket, video, true)
});

pause.addEventListener ("click", (e)=>onPause(video, socket));

var send = true;

const onSeeked = (e, socket, video, send=false) =>{
    console.log (video);
    socket.emit ("seek", {
        time: video.currentTime,
        send: send
    });
    onPause (video, socket);
}

const onMove = (time, video) =>{
    send = false;
    video.currentTime = time;
    video.pause ();
  //  onPause (video, socket);
}

const onPause = (video, socket)=>{
    video.pause ();
    socket.emit ("pause");
}

const onPlay =(video)=>{
    video.play ();
}


socket.on("move", (time)=>onMove(time, video))
socket.on ("paused", ()=>video.pause());

