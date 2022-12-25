const socketEvents = (socket)=>{
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
}

export default socketEvents;