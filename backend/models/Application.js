const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'company is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'role is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'location is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn'],
      default: 'applied',
    },
    appliedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    resumeScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Application', applicationSchema);
