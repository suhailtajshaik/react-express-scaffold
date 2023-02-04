"use strict";
require("dotenv").config();

const config = () => {
  return {
    port: process.env.NODE_PORT || "3000",
    env: process.env.NODE_ENV || "develop",
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/7boss",
    mongoCollection: process.env.MONGO_COLLECTION || "store-images",
    imageApiKey : process.env.IMAGE_API_KEY || "?722852f45616a6ecdd7319061179bdc32fccd4dfa3cec451ccbfe3cbac7ece",
  };
};

module.exports = config();
