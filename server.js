const express = require('express');
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

const server = express();

server.use(express.json());
server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

server.use(logger); //Add middleware

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const method = req.method;
  const endpoint = req.originalUrl;
  const dates = [new Date().toISOString()];
  
  console.log(`Date: ${dates} Req.method, ${method} to ${endpoint} , Req.originalUrl `);

  next();
};


module.exports = server;
