const express = require("express");
const http = require("https");
const socketIo = require("socket.io");
//const fs = require("fs");
const path = require("path");

const app = express();

// Leia os arquivos de certificado e chave
/* const options = {
  key: fs.readFileSync(path.join(__dirname, "videokey.pem")), // Chave privada
  cert: fs.readFileSync(path.join(__dirname, "videocert.pem")), // Certificado
}; */

// const server = https.createServer(options, app);
const server = http.createServer(app);
const io = socketIo(server);

// Rota para servir o arquivo HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("offer", (offer) => {
    console.log("Received offer:", offer);
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    console.log("Received answer:", answer);
    socket.broadcast.emit("answer", answer);
  });

  socket.on("candidate", (candidate) => {
    console.log("Received ICE candidate:", candidate);
    socket.broadcast.emit("candidate", candidate);
  });

  // Evento para troca de mensagens de texto
  socket.on("message", (message) => {
    console.log("Received message:", message);
    socket.broadcast.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
