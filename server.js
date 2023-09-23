const express = require("express");
const mysql = require("mysql");
const BodyParser = require("body-parser");

const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(BodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "views");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "school_db",
});

db.connect((err) => {
  if (err) throw err;

  app.get("/", (req, res) => {
    const query = "SELECT * FROM students";
    db.query(query, (err, result) => {
      const student = JSON.parse(JSON.stringify(result));
      res.render("index", {
        student: student,
        title: "Learn web with Dea",
        heading: "Daftar Murid",
      });
    });
  });

  app.get("/chat", (req, res) => {
    res.render("chat", {
      title: "Forum Diskusi Bersama",
    });
  });

  app.post("/add", (req, res) => {
    const insertSql = `INSERT INTO students (name, classroom) values ('${req.body.name}', '${req.body.classroom}');`;
    db.query(insertSql, (err, result) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
});

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    const { id, message } = data;
    socket.broadcast.emit("message", id, message);
  });
});

server.listen(5000, () => console.log("Server Ready"));
