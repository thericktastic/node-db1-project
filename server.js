const express = require("express");

const AccountRouter = require("./helpers/accountRouter");

const server = express();

server.use(express.json());

server.use("/api/accounts", AccountRouter);

server.get("/", (request, response) => {
  response.send("Let's go");
});

module.exports = server;
