const express = require("express");
var http = require("http");
var cors = require("cors");
const app = express();
const port = process.env.port || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server, 
    {cors: {
        origin : "*"
    }}
)
app.use(express.json());
app.use(cors());
var clients = {};
io.on("connection", (socket) => {
    console.log("connected");
    console.log(socket.id, "has joined");
    socket.on("signin", (id) => {
        console.log(id);
        clients[id] = socket;
        console.log(clients);
    });
    socket.on("message", (msg) => {
        console.log(msg);
        let targetId = msg.targetId;
        if(clients[targetId]) {
            clients[targetId].emit("message", msg["message"]);
        }
    });
});

app.route("/check").get((req, res) => {
    return res.json("your app is workign fine");
});

server.listen(port, "0.0.0.0", () => {
    console.log("server started");
});