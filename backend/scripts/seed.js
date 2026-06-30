const mongoose = require('mongoose');
const dns = require('node:dns');

// Force Node.js to use public DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

const dotenv = require('dotenv');
const User = require('../models/User');
const Member = require('../models/Member');
const MembershipPlan = require('../models/MembershipPlan');
const GymSlot = require('../models/GymSlot');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kenzofitness');
    console.log('MongoDB connected for seeding...');

    // Clear old data
    await User.deleteMany();
    await Member.deleteMany();
    await MembershipPlan.deleteMany();
    console.log('Cleared existing data.');

    // 1. Seed Membership Plans
    const plans = [
      {
        name: 'Monthly Plan',
        price: 2500,
        durationInDays: 30,
        features: [
          'Access to gym floor & standard cardio machines',
          'Locker room & shower access',
          '1 Complimentary fitness assessment',
          'Free High-speed Wi-Fi',
        ],
        isActive: true,
      },
      {
        name: 'Quarterly Plan',
        price: 129,
        durationInDays: 90,
        features: [
          'Access to gym floor & standard cardio machines',
          'Locker room, shower & sauna access',
          '3 Complimentary fitness assessments',
          '2 Personal training coaching sessions',
          '10% Discount on gym supplements & wear',
        ],
        isActive: true,
      },
      {
        name: 'Yearly Plan',
        price: 399,
        durationInDays: 365,
        features: [
          '24/7 Access to gym floor & cardio machines',
          'Locker room, shower, sauna & steam room access',
          'Unlimited fitness assessments & body scans',
          '12 Personal training coaching sessions (1 per month)',
          'Custom diet & nutrition consultation plans',
          '20% Discount on gym supplements & wear',
          'Free guest pass (1 per month)',
        ],
        isActive: true,
      },
    ];

    const seededPlans = await MembershipPlan.insertMany(plans);
    console.log(`Seeded ${seededPlans.length} membership plans successfully.`);

    // 2. Seed Default Users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@kenzofitness.com',
        password: 'admin123',
        role: 'admin',
        phone: '1234567890',
      },
      {
        name: 'Test Member',
        email: 'member@kenzofitness.com',
        password: 'member123',
        role: 'member',
        phone: '0987654321',
      },
      {
        name: 'Test Reception',
        email: 'reception@kenzofitness.com',
        password: 'reception123',
        role: 'reception',
        phone: '1112223334',
      },
      {
        name: 'Test Trainer',
        email: 'trainer@kenzofitness.com',
        password: 'trainer123',
        role: 'trainer',
        phone: '4445556667',
      }
    ];

    const createdUsers = await Promise.all(users.map(u => User.create(u)));
    const adminUser = createdUsers[0];
    const demoMemberUser = createdUsers[1];
    const receptionUser = createdUsers[2];
    const trainerUser = createdUsers[3];

    console.log(`Seeded Default Admin User:\nEmail: ${adminUser.email}\nPassword: admin123\nRole: admin\n`);
    console.log(`Seeded Default Reception User:\nEmail: ${receptionUser.email}\nPassword: reception123\nRole: reception\n`);
    console.log(`Seeded Default Trainer User:\nEmail: ${trainerUser.email}\nPassword: trainer123\nRole: trainer\n`);

    // 3. Seed Sample Member Profile for Demo
    const startDate = new Date();
    const expiryDate = new Date();
    // Use the Monthly Plan (seededPlans[0]) for the demo member
    expiryDate.setDate(startDate.getDate() + seededPlans[0].durationInDays);

    const demoMember = await Member.create({
      fullName: 'Nikhil Member',
      email: 'member@kenzofitness.com',
      phone: '+1 (555) 018-9999',
      age: 25,
      gender: 'Male',
      address: '123 Fitness Ave, Iron City',
      emergencyContact: 'Jane Member (+1 555-018-9988)',
      membershipPlan: seededPlans[0]._id,
      startDate,
      expiryDate,
      paymentStatus: 'paid',
      status: 'active',
      user: demoMemberUser._id,
    });

    console.log(`Seeded Default Member User for Demo:`);
    console.log(`Email: ${demoMemberUser.email}`);
    console.log(`Password: member123`);
    console.log(`Status: Active (Paid)\n`);

    // 4. Seed Gym Slots
    await GymSlot.deleteMany();
    const slotTimes = [
      { name: 'Morning Early', start: '6:00 AM', end: '7:00 AM' },
      { name: 'Morning Cardio', start: '7:00 AM', end: '8:00 AM' },
      { name: 'Morning Weights', start: '8:00 AM', end: '9:00 AM' },
      { name: 'Morning Late', start: '9:00 AM', end: '10:00 AM' },
      { name: 'Midday', start: '10:00 AM', end: '11:00 AM' },
      { name: 'Evening Early', start: '5:00 PM', end: '6:00 PM' },
      { name: 'Evening Cardio', start: '6:00 PM', end: '7:00 PM' },
      { name: 'Evening Weights', start: '7:00 PM', end: '8:00 PM' },
      { name: 'Night Owl', start: '8:00 PM', end: '9:00 PM' },
    ];

    const slotDocs = slotTimes.map(st => ({
      slotName: st.name,
      startTime: st.start,
      endTime: st.end,
      capacity: 25,
      status: 'active'
    }));

    const seededSlots = await GymSlot.insertMany(slotDocs);
    console.log(`Seeded ${seededSlots.length} gym slots successfully.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
