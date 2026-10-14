import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Technician'],
    required: true
  },
  title: {
    type: String,
    default: 'Aeronautical Specialist'
  },
  department: {
    type: String,
    default: 'Directorate of Aerospace Maintenance (MoD / DSSC)'
  },
  specialization: {
    type: String,
    default: 'General Airframe'
  },
  squadron: {
    type: String,
    default: 'Maintenance Wing'
  },
  base: {
    type: String,
    default: 'Ambala AFS'
  },
  avatar: {
    type: String,
    default: 'IN'
  }
}, {
  timestamps: true
});

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
