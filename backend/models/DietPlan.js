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
  fat: {
    type: Number,
  },
  water: {
    type: String,
  },
  meals: [{
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    },
    foodItems: String,
    calories: Number,
    notes: String,
  }],
  supplements: {
    type: String,
  },
  notes: {
    type: String,
  },
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
