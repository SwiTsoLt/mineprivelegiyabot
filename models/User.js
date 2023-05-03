const { Schema, model } = require('mongoose');

const User = new Schema({
    id: { type: String, require: true },
    username: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    money: {type: Number},
    gold: {type: Number},
    total_replenished: {type: Number},
    total_withdrawn: {type: Number},
    is_bot: { type: Boolean },
    language_code: { type: String }
})

const UserModel = model('User', User)

module.exports = UserModel