
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    hint: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;