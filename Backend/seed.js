import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dns from 'dns';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Aircraft from './models/Aircraft.js';
import Alert from './models/Alert.js';
import Spare from './models/Spare.js';
import WorkOrder from './models/WorkOrder.js';

import {
  initialAircraft,
  initialAlerts,
  initialSpares,
  initialWorkOrders,
  demoUsers
} from './data/initialData.js';

// Resolve DNS SRV via Google/Cloudflare public DNS
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if restricted
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
if (fs.existsSync(path.join(__dirname, '.env'))) {
  dotenv.config({ path: path.join(__dirname, '.env') });
} else if (fs.existsSync(path.join(__dirname, '../.env'))) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}
dotenv.config();

let rawMongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/drishti_maintenance';
if (rawMongoUri.includes('.mongodb.net/?')) {
  rawMongoUri = rawMongoUri.replace('.mongodb.net/?', '.mongodb.net/drishti_maintenance?');
} else if (rawMongoUri.endsWith('.mongodb.net') || rawMongoUri.endsWith('.mongodb.net/')) {
  rawMongoUri = rawMongoUri.replace(/\/?$/, '/drishti_maintenance');
}

const runSeeder = async () => {
  console.log('==============================================================');
  console.log(' PROJECT D.R.I.S.H.T.I. — DATABASE SEEDING ENGINE');
  console.log(' SIH 2026 PS 26249 | Ministry of Defence (MoD) / DSSC');
  console.log('==============================================================');
  console.log(`Target MongoDB URI: ${rawMongoUri.replace(/:[^:@]+@/, ':****@')}`);
  console.log('Connecting to MongoDB...');

  try {
    await mongoose.connect(rawMongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`Connected to database: ${mongoose.connection.name}`);

    console.log('\n[1/5] Purging existing collections...');
    await User.deleteMany({});
    await Aircraft.deleteMany({});
    await Alert.deleteMany({});
    await Spare.deleteMany({});
    await WorkOrder.deleteMany({});
    console.log('Clean slate ready.');

    console.log('\n[2/5] Hashing passwords and seeding Users collection...');
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const usersToInsert = demoUsers.map(u => ({
      username: u.username.toLowerCase().trim(),
      password: hashedPassword,
      name: u.name,
      role: u.role,
      title: u.title,
      department: u.department,
      specialization: u.specialization || 'General',
      squadron: u.squadron || 'Maintenance Unit',
      base: u.base || 'Air Command',
      avatar: u.avatar || 'IN'
    }));

    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`Successfully created ${insertedUsers.length} authenticated users in MongoDB.`);

    console.log('\n[3/5] Seeding Aircraft tactical fleet...');
    const insertedAircraft = await Aircraft.insertMany(initialAircraft);
    console.log(`Successfully created ${insertedAircraft.length} tactical airframes.`);

    console.log('\n[4/5] Seeding Predictive Anomaly Alerts & Depot Spares...');
    const insertedAlerts = await Alert.insertMany(initialAlerts);
    const insertedSpares = await Spare.insertMany(initialSpares);
    console.log(`Seeded ${insertedAlerts.length} anomaly alerts and ${insertedSpares.length} depot spares.`);

    console.log('\n[5/5] Seeding Active Work Orders & Technician Assignments...');
    const insertedOrders = await WorkOrder.insertMany(initialWorkOrders);
    console.log(`Seeded ${insertedOrders.length} active maintenance work orders.`);

    console.log('\n==============================================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==============================================================');
    console.log('You can now log in using the following authenticated accounts:');
    console.log('--------------------------------------------------------------');
    console.log('FLEET ADMINISTRATOR:');
    console.log('  Username: arjun.mehta');
    console.log('  Password: password123');
    console.log('  Role:     Fleet Maintenance Administrator');
    console.log('\nCERTIFIED TECHNICIANS:');
    console.log('  1. Username: rahul.sharma   | Password: password123  (AF-04 Engine)');
    console.log('  2. Username: vikram.singh   | Password: password123  (AF-02 Hydraulics)');
    console.log('  3. Username: aditya.verma   | Password: password123  (AF-05 Avionics)');
    console.log('  4. Username: karan.gupta    | Password: password123  (AF-03 Fuel)');
    console.log('--------------------------------------------------------------');

    await mongoose.disconnect();
    console.log('Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
};

runSeeder();
