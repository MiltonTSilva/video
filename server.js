const express = require("express");
const https = require("https");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();

// Leia os arquivos de certificado e chave
const options = {
  key: fs.readFileSync(path.join(__dirname, "videokey.pem")), // Chave privada
  cert: fs.readFileSync(path.join(__dirname, "videocert.pem")), // Certificado
};

const server = https.createServer(options, app);
const io = socketIo(server);

// Rota para servir o arquivo HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("candidate", candidate);
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
