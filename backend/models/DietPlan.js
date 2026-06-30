const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
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
  calories: {
    type: Number,
  },
  protein: {
    type: Number,
  },
  carbs: {
    type: Number,
  },
  fats: {
    type: Number,
  },
  waterIntake: {
    type: String,
  },
  meals: [{
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    },
    foodItems: String,
    calories: Number,
    notes: String,
  }],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
