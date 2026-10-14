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

// Resolve DNS SRV via public DNS
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

const args = process.argv.slice(2);
const isPurgeOnly = args.includes('--purge') || args.includes('-p') || args.includes('--wipe');
const isStatusOnly = args.includes('--status') || args.includes('-s');
const isReset = args.includes('--reset') || (!isPurgeOnly && !isStatusOnly);

const runDbCleaner = async () => {
  console.log('==============================================================');
  console.log(' PROJECT D.R.I.S.H.T.I. — DATABASE CLEANER & RESET UTILITY');
  console.log(' Ministry of Defence / DSSC | Predictive Fleet Analytics');
  console.log('==============================================================');
  console.log(`Database Target: ${rawMongoUri.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`Execution Mode : ${isStatusOnly ? 'STATUS INSPECTION' : isPurgeOnly ? 'COMPLETE PURGE (WIPE)' : 'PURGE & RE-SEED (CLEAN RESET)'}`);
  console.log('Connecting to MongoDB...');

  try {
    await mongoose.connect(rawMongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✓ Connected to Database: [${mongoose.connection.name}]\n`);

    // Fetch current document counts
    const currentCounts = {
      users: await User.countDocuments(),
      aircraft: await Aircraft.countDocuments(),
      alerts: await Alert.countDocuments(),
      spares: await Spare.countDocuments(),
      workOrders: await WorkOrder.countDocuments()
    };

    console.log('--------------------------------------------------------------');
    console.log('CURRENT DATABASE COLLECTION TOTALS:');
    console.log(`  • Users       : ${currentCounts.users} records`);
    console.log(`  • Aircraft    : ${currentCounts.aircraft} records`);
    console.log(`  • Alerts      : ${currentCounts.alerts} records`);
    console.log(`  • Spares      : ${currentCounts.spares} records`);
    console.log(`  • Work Orders : ${currentCounts.workOrders} records`);
    console.log('--------------------------------------------------------------');

    if (isStatusOnly) {
      console.log('\nStatus check complete. Zero modifications performed.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Step 1: Purge all collections
    console.log('\n[PURGE] Wiping existing collections from database...');
    const purgedUsers = await User.deleteMany({});
    const purgedAircraft = await Aircraft.deleteMany({});
    const purgedAlerts = await Alert.deleteMany({});
    const purgedSpares = await Spare.deleteMany({});
    const purgedOrders = await WorkOrder.deleteMany({});

    console.log(`  ✓ Purged ${purgedUsers.deletedCount} User documents`);
    console.log(`  ✓ Purged ${purgedAircraft.deletedCount} Aircraft documents`);
    console.log(`  ✓ Purged ${purgedAlerts.deletedCount} Alert documents`);
    console.log(`  ✓ Purged ${purgedSpares.deletedCount} Spare documents`);
    console.log(`  ✓ Purged ${purgedOrders.deletedCount} WorkOrder documents`);

    if (isPurgeOnly) {
      console.log('\n==============================================================');
      console.log(' PURGE COMPLETE: ALL COLLECTIONS EMPTIED TO 0 RECORDS.');
      console.log(' To restore default fleet data, run: npm run db:reset');
      console.log('==============================================================');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Step 2: Re-seed fresh baseline datasets
    console.log('\n[RE-SEED] Initializing fresh baseline datasets...');
    
    // Hash default password
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
    const insertedAircraft = await Aircraft.insertMany(initialAircraft);
    const insertedAlerts = await Alert.insertMany(initialAlerts);
    const insertedSpares = await Spare.insertMany(initialSpares);
    const insertedOrders = await WorkOrder.insertMany(initialWorkOrders);

    console.log(`  ✓ Created ${insertedUsers.length} authenticated users`);
    console.log(`  ✓ Created ${insertedAircraft.length} tactical airframes (AF-01 through AF-06)`);
    console.log(`  ✓ Created ${insertedAlerts.length} anomaly telemetry alerts`);
    console.log(`  ✓ Created ${insertedSpares.length} depot LRU spare parts`);
    console.log(`  ✓ Created ${insertedOrders.length} active maintenance work orders`);

    console.log('\n==============================================================');
    console.log(' DATABASE CLEAN & RESET SUCCESSFULLY COMPLETED!');
    console.log('==============================================================');
    console.log('Demo Credentials Ready:');
    console.log('  • Fleet Admin  : arjun.mehta    | Password: password123');
    console.log('  • Technician 1 : rahul.sharma   | Password: password123 (AF-04 Engine)');
    console.log('  • Technician 2 : vikram.singh   | Password: password123 (AF-02 Hydraulics)');
    console.log('  • Technician 3 : aditya.verma   | Password: password123 (AF-05 Avionics)');
    console.log('  • Technician 4 : karan.gupta    | Password: password123 (AF-03 Fuel)');
    console.log('==============================================================\n');

    await mongoose.disconnect();
    console.log('Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('\nDatabase clean operation failed:', error.message);
    process.exit(1);
  }
};

runDbCleaner();
