const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);


app.use(cors());
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("EMS");
});

app.use(express.json({limit : '50mb',extended : true}))
app.use(express.urlencoded({limit : '50mb',extended : true}))

app.use("/auth", require("./routes/auth.js"));
app.use("/ems", require("./routes/ems.js"));

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});