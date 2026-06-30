const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  exercises: [{
    exerciseName: String,
    muscleGroup: String,
    sets: Number,
    reps: Number,
    weight: String,
    restTime: String,
    notes: String,
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
