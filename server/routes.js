"use strict";

let path = require("path");

let config = require("./config.js");
let routing = (app) => {
  console.log("in routing...");
  app.use("/api", require("./apis/store-images/index"));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });

  // All other routes should redirect to the index.html
  app.route("/*").get(function (req, res) {
    res.redirect("/");
  });
};

module.exports = routing;
