const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true
  },
  projectDomain: {
    type: String,
    required: true
  }
  // ownerId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  // collaborators: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
