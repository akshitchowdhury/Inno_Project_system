const mongoose = require('mongoose');

const adminEmailSchema = new mongoose.Schema({
    sender_email: {
        type: String,
        required: true  
    },
    receiver_username: {
        type: String,
        required: true
    },
    messages: [ 
        { type: String } // This allows an array of strings for messages
    ]
}, { timestamps: true }); // Optional: Add timestamps if you want createdAt/updatedAt fields

module.exports = mongoose.model('AdminEmail', adminEmailSchema);
