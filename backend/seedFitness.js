require('dotenv').config();
const mongoose = require('mongoose');
const Trainer = require('./models/Trainer');
const Member = require('./models/Member');
const WorkoutPlan = require('./models/WorkoutPlan');
const DietPlan = require('./models/DietPlan');
const BodyProgress = require('./models/BodyProgress');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const seedFitnessData = async () => {
  try {
    const trainer = await Trainer.findOne({ role: 'trainer' }).populate('assignedMembers');
    if (!trainer || !trainer.assignedMembers || trainer.assignedMembers.length === 0) {
      console.log('No trainer with assigned members found.');
      process.exit(1);
    }

    const member = trainer.assignedMembers[0];

    // Seed Workout
    await WorkoutPlan.create({
      memberId: member._id,
      trainerId: trainer._id,
      planName: 'Hypertrophy Phase 1',
      goal: 'Build Muscle',
      level: 'intermediate',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30*24*60*60*1000),
      exercises: [
        { exerciseName: 'Barbell Bench Press', muscleGroup: 'Chest', sets: 4, reps: 8, weight: 80, restTime: '90s', notes: 'Focus on eccentric' },
        { exerciseName: 'Incline Dumbbell Press', muscleGroup: 'Chest', sets: 3, reps: 10, weight: 30, restTime: '60s' },
        { exerciseName: 'Triceps Pushdown', muscleGroup: 'Triceps', sets: 3, reps: 15, weight: 25, restTime: '45s' }
      ]
    });

    // Seed Diet
    await DietPlan.create({
      memberId: member._id,
      trainerId: trainer._id,
      planName: 'Lean Bulk Macros',
      goal: 'Caloric Surplus',
      status: 'active',
      calories: 2800,
      protein: 180,
      carbs: 350,
      fats: 75,
      waterIntake: '3.5L',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30*24*60*60*1000),
      meals: [
        { mealType: 'breakfast', foodItems: 'Oats, Protein Powder, Peanut Butter, Banana', calories: 600 },
        { mealType: 'lunch', foodItems: 'Chicken Breast, Rice, Broccoli', calories: 700 },
        { mealType: 'snack', foodItems: 'Greek Yogurt, Almonds', calories: 300 },
        { mealType: 'dinner', foodItems: 'Salmon, Sweet Potato, Asparagus', calories: 800 }
      ]
    });

    // Seed Progress
    await BodyProgress.create({
      memberId: member._id,
      trainerId: trainer._id,
      weight: 78.5,
      height: 180,
      bmi: 24.2,
      bodyFat: 14.5,
      chest: 102,
      waist: 82,
      arms: 38,
      thighs: 60,
      notes: 'Initial check-in for the new program.',
      date: new Date()
    });

    console.log('Successfully seeded fitness data for member:', member.fullName);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedFitnessData();
