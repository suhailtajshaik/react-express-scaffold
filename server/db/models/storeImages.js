const mongoose = require("mongoose");
const { mongoCollection } = require("../../config");

const storeImagesSchema = new mongoose.Schema({
  id: String,
  itemId: String,
  itemUPC: String,
  storeId: String,
  thumbnail: String,
  isActive: Boolean || true,
  createdTime: { type: Date, default: Date.now },
  lastUpdatedTime: { type: Date, default: Date.now },
});

storeImagesSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  obj.id = obj._id;
  delete obj._id;
  return obj;
};

module.exports = mongoose.model(mongoCollection, storeImagesSchema);
