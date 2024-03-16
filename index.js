const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const Messages = require("./models/Messages.js");
const { Sequelize } = require("sequelize");
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  socket.on("chat message", async (msg, cb) => {
    const message=await Messages.create({
      body: msg.body,
      from: msg.from,
      to: msg.to,
      sent_at: Sequelize.fn("now")
    })
    io.emit("chat message", message);
    cb?.(message)
  });
});

app.use(cors());
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("EMS");
});

app.use(express.json({limit : '50mb',extended : true}))
app.use(express.urlencoded({limit : '50mb',extended : true}))

app.use("/auth", require("./routes/auth.js"));
app.use("/ems", require("./routes/ems.js"));
app.use("/chat", require("./routes/chat.js"));

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});