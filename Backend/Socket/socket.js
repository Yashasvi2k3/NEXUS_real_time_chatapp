import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:[
            'http://localhost:5173',
            'http://localhost:3000',
            process.env.FRONTEND_ORIGIN
        ].filter(Boolean),
        methods:["GET","POST"],
        credentials: true
    }
});

export const getReciverSocketId = (receverId)=>{
    return userSocketmap[receverId];
};

const userSocketmap={}; //{userId,socketId}
io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;

    // Ensure we only register valid userIds; fix typo "undefine" and check truthiness
    if (userId && userId !== 'undefined' && userId !== 'null') {
        userSocketmap[userId] = socket.id;
    }
    io.emit("getOnlineUsers",Object.keys(userSocketmap))

    socket.on('disconnect',()=>{
        delete userSocketmap[userId],
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    });
});

export {app , io , server}
