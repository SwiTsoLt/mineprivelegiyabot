const { Schema, model, Types } = require('mongoose');

const Review = new Schema({
    ownerId: Types.ObjectId,
    text: String
})

const ReviewModel = model('Review', Review)

module.exports = ReviewModel