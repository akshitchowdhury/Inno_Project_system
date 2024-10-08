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
  empId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  message: {
    type: String
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
    default: false,
    timestamps: true
  },
  loggedInAt: {
    type: Date
  },
  loggedOutAt: {
    type: Date
  },
  isPresent:{
    type: String,
    enum: ['Off Duty','WFO', 'WFH', 'Leave'],
    default: 'Off Duty',
    
    
  },
  projectIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
