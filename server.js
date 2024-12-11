const express = require("express");
const http = require("https");
const socketIo = require("socket.io");
const path = require("path");

const app = express();

// Leia os arquivos de certificado e chave
const options = {
  key: fs.readFileSync("path/to/localhost-key.pem"), // Chave privada
  cert: fs.readFileSync("path/to/localhost.pem"),   // Certificado
};

const server = http.createServer(options, app);
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
