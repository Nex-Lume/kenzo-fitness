const mongoose = require('mongoose');
const dns = require('node:dns');

// Force Node.js to use public DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

const dotenv = require('dotenv');
const Trainer = require('../models/Trainer');
const Member = require('../models/Member');
const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');
const DietPlan = require('../models/DietPlan');
const BodyProgress = require('../models/BodyProgress');
const Goal = require('../models/Goal');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedPhase4 = async () => {
  try {
    console.log('Seeding Phase 4 sample data...');

    // Delete existing phase 4 models data to avoid duplicates if run multiple times
    await WorkoutPlan.deleteMany();
    await DietPlan.deleteMany();
    await BodyProgress.deleteMany();
    await Goal.deleteMany();

    // Find the default trainer and member
    const trainerUser = await User.findOne({ email: 'trainer@kenzofitness.com' });
    const memberUser = await User.findOne({ email: 'member@kenzofitness.com' });

    if (!trainerUser || !memberUser) {
      console.log('Default Trainer or Member not found. Please run regular seed script first (node scripts/seed.js).');
      process.exit(1);
    }

    let trainer = await Trainer.findOne({ user: trainerUser._id });
    // If no Trainer model record exists yet, create one (seed.js only creates the User)
    if (!trainer) {
      trainer = await Trainer.create({
        user: trainerUser._id,
        fullName: trainerUser.name || 'Test Trainer',
        email: trainerUser.email,
        phone: trainerUser.phone || '4445556667',
        gender: 'Male',
        specialization: 'Strength & Conditioning',
        experience: 5,
        bio: 'Certified personal trainer specializing in strength training.',
        salary: 50000,
        status: 'active',
        availability: 'Full Day',
      });
      console.log('Created Trainer model record for trainer user.');
    }

    let member = await Member.findOne({ user: memberUser._id });

    if (!member) {
      console.log('Member model record missing. Please run regular seed script first.');
      process.exit(1);
    }

    // Assign member to trainer
    if (!trainer.assignedMembers.includes(member._id)) {
      trainer.assignedMembers.push(member._id);
      await trainer.save();
    }

    // Update trainer with new phase 4 fields
    trainer.dob = new Date('1990-01-01');
    trainer.qualifications = ['ACE Certified', 'CrossFit L1'];
    trainer.joiningDate = new Date('2023-01-15');
    await trainer.save();

    // Update member with phase 4 fitness profile
    member.fitnessProfile = {
      fitnessLevel: 'Intermediate',
      medicalConditions: 'None',
      allergies: 'Peanuts',
      bloodGroup: 'O+',
      emergencyContact: 'John Doe - 555-1234',
      lifestyle: {
        smoking: 'No',
        alcohol: 'Occasionally',
        sleepHours: 7,
        dailyWaterIntake: '3L',
      },
      workoutExperience: '2 years inconsistent lifting',
      currentInjuries: 'Mild lower back pain',
    };
    await member.save();

    // Create Sample Workout Plan
    const workoutPlan = await WorkoutPlan.create({
      memberId: member._id,
      trainerId: trainer._id,
      planName: 'Hypertrophy Phase 1',
      goal: 'Muscle Gain',
      level: 'intermediate',
      duration: '8 weeks',
      startDate: new Date(),
      endDate: new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000), // 8 weeks later
      status: 'active',
      exercises: [
        {
          exerciseName: 'Barbell Squats',
          bodyPart: 'Legs',
          equipment: 'Barbell',
          sets: 4,
          reps: 10,
          weight: '135 lbs',
          rest: '90s',
          notes: 'Keep chest up',
        },
        {
          exerciseName: 'Bench Press',
          bodyPart: 'Chest',
          equipment: 'Barbell',
          sets: 3,
          reps: 12,
          weight: '185 lbs',
          rest: '60s',
          notes: 'Pause at bottom',
        }
      ]
    });

    // Create Sample Diet Plan
    const dietPlan = await DietPlan.create({
      memberId: member._id,
      trainerId: trainer._id,
      planName: 'Lean Bulk Macros',
      goal: 'Muscle Gain',
      calories: 2800,
      protein: 180,
      carbs: 300,
      fat: 80,
      water: '4 Liters',
      startDate: new Date(),
      endDate: new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000), // 8 weeks later
      status: 'active',
      supplements: 'Whey Protein, Creatine Monohydrate',
      notes: 'Stick to the plan. Cheat meal once a week.',
      meals: [
        {
          mealType: 'Breakfast',
          foodItems: '4 Eggs, 1 cup Oats, 1 Banana',
          calories: 600,
          notes: 'Have this 1 hour before workout',
        },
        {
          mealType: 'Lunch',
          foodItems: 'Chicken Breast, 1.5 cups Rice, Broccoli',
          calories: 700,
          notes: 'High protein',
        },
        {
          mealType: 'Dinner',
          foodItems: 'Salmon, Sweet Potato, Asparagus',
          calories: 550,
          notes: 'Healthy fats',
        },
        {
          mealType: 'Snack',
          foodItems: 'Greek Yogurt, Almonds',
          calories: 300,
          notes: 'Before bed',
        }
      ]
    });

    // Create Sample Body Progress
    const bodyProgress = await BodyProgress.create({
      memberId: member._id,
      trainerId: trainer._id,
      date: new Date(),
      weight: 85, // kg
      height: 180, // cm
      bmi: 26.2,
      bodyFat: 18, // %
      chest: 40, // inches
      waist: 34,
      hip: 38,
      shoulders: 46,
      biceps: 15,
      forearms: 12,
      thighs: 24,
      calves: 16,
      neck: 16,
      notes: 'Initial check-in for the hypertrophy phase.',
    });

    // Create Sample Goal
    const goal = await Goal.create({
      memberId: member._id,
      type: 'Muscle Gain',
      targetWeight: 90,
      deadline: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks
      completionPercentage: 10,
      progressPercentage: 10,
      status: 'In Progress',
    });

    console.log('Phase 4 Data seeded successfully.');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedPhase4();
