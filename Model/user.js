const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
    required: true,
    unique: true,
    },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  projectIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
