const mongoose = require('mongoose');

const taskBoardSchema = new mongoose.Schema({
    employee: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // isLoggedIn: {
    //     type: Boolean,
    //     required: true
    // },
    task: {
        type: String,
        required: true
    },
    currentProject: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('TaskBoard', taskBoardSchema);