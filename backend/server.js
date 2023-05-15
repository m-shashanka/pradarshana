require("dotenv").config({ path: `./.env.dev` });
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const serveIndex = require("serve-index")
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const users = require("./routes/api/users");
const tests = require("./routes/api/tests");
const details = require("./routes/api/details");
const admin = require("./routes/api/admin");
const compile = require("./routes/api/compile");
const { connectDB } = require("./config/db");
const keys = require("./config/keys");
const {addUser, removeUser, getQueries, getResolution, addQuery, addResolution} = require("./socketUtils/roomActions");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: ['http://172.1.14.168:*']
});

app.use(cors());
// Bodyparser middleware


// Connect to MongoDB
if(process.env.APP_ENV !== "test") 
  connectDB();

// Passport middleware

app.all("*", function (req, res, next) {
  const origin = req.get("origin");
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(cookieParser("foo"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(
  expressSession({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize({ userProperty: "user" }));
app.use(passport.session());

io.on('connection', socket => {

  socket.on('join', ({user, testId}) => {
    // testId = '63fec4c40e0b4e1e19007c64';
    const isValidTestId = addUser(user, testId, socket.id);
    if(isValidTestId){
      if(user && user.isProfessor){
        const queries = getQueries(testId);
        const resolutions = getResolution(testId);
        socket.emit('initQueries&Resolution', {queries, resolutions});
      }
      else if(user && !user.isProfessor){
        const resolutions = getResolution(testId);
        socket.emit('initResolution', {resolutions});
      }
    }
  });

  socket.on('askQuery', ({query, usn}) => {
    const teacherSocket = addQuery(query, usn, socket.id);
    if(teacherSocket)
      io.to(teacherSocket).emit('newQuery', {query, usn});
  });

  socket.on('giveResolution', ({resolution}) => {
    const isTeacher = addResolution(resolution, socket.id);
    if(isTeacher)
      io.emit('newResolution', {resolution});
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});

// app.use('/uploads', express.static('uploads'), serveIndex('uploads', {'icons': true}))
app.get(`${keys.imageUploadPath}/:testId/screenshots`, (req, res, next) => {
  const testId = req.params.testId;
  const usn = req.query.usn;
  app.use(`${keys.imageUploadPath}/${testId}/screenshots/${usn}`, express.static(`${keys.imageUploadPath}/${testId}/screenshots/${usn}`), serveIndex(`${keys.imageUploadPath}/${testId}/screenshots/${usn}`, {'icons': true}))
  res.redirect(`${keys.imageUploadPath}/${testId}/screenshots/${usn}`);
});

app.use('/uploads', express.static(keys.imageUploadPath));


// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/test", tests);
app.use("/api", details);
app.use("/api/admin", admin);
app.use("/api/compile", compile);

const PORT = process.env.PORT || 5500;
// process.env.port is Heroku's port if you choose to deploy the app there

server.listen(PORT, () => console.log(`Server up and running on port ${PORT} !`));

module.exports = { app, server };
