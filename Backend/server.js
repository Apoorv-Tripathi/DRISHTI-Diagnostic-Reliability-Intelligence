import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dns from 'dns';
import aircraftRoutes from './routes/aircraftRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import sparesRoutes from './routes/sparesRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import User from './models/User.js';
import { seedDatabaseIfConnected } from './data/store.js';

// Resolve DNS SRV queries via public DNS (Google/Cloudflare) to prevent querySrv EBADRESP on ISP/local routers
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if network environment restricts custom DNS servers
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env, root .env, or process env
if (fs.existsSync(path.join(__dirname, '.env'))) {
  dotenv.config({ path: path.join(__dirname, '.env') });
}
if (fs.existsSync(path.join(__dirname, '../.env'))) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Format MongoDB URI to guarantee database name presence
let rawMongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/drishti_maintenance';
if (rawMongoUri.includes('.mongodb.net/?')) {
  rawMongoUri = rawMongoUri.replace('.mongodb.net/?', '.mongodb.net/drishti_maintenance?');
} else if (rawMongoUri.endsWith('.mongodb.net') || rawMongoUri.endsWith('.mongodb.net/')) {
  rawMongoUri = rawMongoUri.replace(/\/?$/, '/drishti_maintenance');
}
const MONGODB_URI = rawMongoUri;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger for aerospace telemetry auditing
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount API routes (support both /api/* and root paths for cloud resilience)
app.use('/api/aircraft', aircraftRoutes);
app.use('/aircraft', aircraftRoutes);

app.use('/api/alerts', alertRoutes);
app.use('/alerts', alertRoutes);

app.use('/api/spares', sparesRoutes);
app.use('/spares', sparesRoutes);

app.use('/api/maintenance', maintenanceRoutes);
app.use('/maintenance', maintenanceRoutes);

app.use('/api/telemetry', telemetryRoutes);
app.use('/telemetry', telemetryRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/analytics', analyticsRoutes);

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Users & Demo accounts route (queries MongoDB)
const handleUsersRequest = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ role: 1 });
    if (users && users.length > 0) {
      return res.json({ success: true, count: users.length, data: users });
    }
  } catch (err) {
    // fallback if query fails
  }
  const { demoUsers } = await import('./data/initialData.js');
  res.json({ success: true, count: demoUsers.length, data: demoUsers });
};

app.get('/api/users', handleUsersRequest);
app.get('/users', handleUsersRequest);

// Serve built React frontend if present
const possibleDistPaths = [
  path.join(__dirname, '../Frontend/dist'),
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, '../client/dist'),
  path.join(__dirname, '../Client/dist')
];
const clientDistPath = possibleDistPaths.find(p => fs.existsSync(p));

if (clientDistPath) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// System health check
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'In-Memory Resilient Store Active';
  res.json({
    status: 'OPERATIONAL',
    system: 'Air Power - Predictive Maintenance & Fleet Availability DSS',
    problemStatement: 'SIH 2026 - PS 26249',
    organization: 'Ministry of Defence (MoD) / Defence Services Staff College',
    database: mongoStatus,
    timestamp: new Date().toISOString()
  });
});

// Initialize MongoDB connection if available
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully.');
    await seedDatabaseIfConnected();
  } catch (err) {
    console.warn(`Notice: MongoDB not detected locally (${err.message}).`);
    console.warn('Switching seamlessly to embedded in-memory persistence layer with full dataset.');
  }
};

// Start Server
app.listen(PORT, async () => {
  console.log('===============================================================');
  console.log(` PROJECT D.R.I.S.H.T.I. - PREDICTIVE MAINTENANCE PLATFORM`);
  console.log(` Diagnostic & Reliability Intelligence with Sensor Health Tracking & Inspection`);
  console.log(` SIH 2026 PS 26249 | Ministry of Defence (MoD) / DSSC`);
  console.log(` Backend Service running on http://localhost:${PORT}`);
  console.log('===============================================================');
  await connectDB();
});
