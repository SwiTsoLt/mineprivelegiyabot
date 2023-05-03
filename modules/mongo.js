require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Review = require("../models/Review");

const mongoUri = process.env.MongoUri;

function connectToMongoDB() {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(mongoUri)
    .then(() => console.log("Connect to mongodb"))
    .catch((e) => {
      console.error(e);
      console.log("Failed to connect to mongodb");
    });
}

function findUserById(id) {
  return User.findOne({ id });
}

async function login(userInfo) {
  const candidate = await findUserById(userInfo.id);
  if (!candidate) {
    const user = new User({
      ...userInfo,
      money: 0,
      gold: 0,
      total_replenished: 0,
      total_withdrawn: 0,
    });
    return await user.save();
  }
  return null
}

async function createReview(userInfo, text) {
    const candidate = await findUserById(userInfo.id);
    if (!candidate) {
        await login(userInfo)
        return createReview(userInfo, text)
    }

    const review = new Review({ ownerId: candidate._id, text })
    return await review.save()
}

module.exports = { connectToMongoDB, findUserById, login, createReview };
