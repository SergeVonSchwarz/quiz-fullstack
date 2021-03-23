const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categorySchema = new Schema({
    answers: {
        type: Array,
        required: true,
    },
    user: {
        ref: "users",
        type: Schema.Types.ObjectId,
    },
})

module.exports = mongoose.model("answers", categorySchema)
