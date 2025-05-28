const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

// Course will be converted to lowercase and plural (courses) by mongoose
const Course = mongoose.model('Course', courseSchema)

module.exports = Course;