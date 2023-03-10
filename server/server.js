"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config");
const connectDB = require("./db");

const app = express();
app.use(cors());
// connnect to db
connectDB();

app.use(express.static(path.join(__dirname, '../../', 'dist')));
require("./routes")(app);

const server = app.listen(config.port, function () {
  var port = server.address().port;
  console.log(
    "\nExpress server listening on port " +
      port +
      ", in " +
      config.env +
      " mode"
  );
  console.log("open http://localhost:" + port);
});

server.on("error", function (e) {
  if (e.code === "EADDRINUSE") {
    console.log("ADDRESS IN USE");
    console.log(
      "\nExpress server listening on port " +
        e.port +
        ", in " +
        config.env +
        " mode"
    );
  } else {
    process.exit(1);
  }
});
