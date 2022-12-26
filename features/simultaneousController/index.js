const socketEvents = (io, socket)=>{
    console.log('a user connected');
    socket.on("seek", payload=>{
        if (payload.send) {
            socket.broadcast.emit("move", payload.time);
        }
    })

    socket.on ("pause", ()=>socket.broadcast.emit("paused"));
    socket.on ("seek_forward", forward=>{
        if (forward) {
            io.sockets.emit ("seeking_forward", 5)
        } else {
            io.sockets.emit ("seeking_forward", -5);
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
}

export default socketEvents;