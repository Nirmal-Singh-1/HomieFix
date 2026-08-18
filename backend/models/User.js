const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Invalid email address'],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: { type: String }, // optional for Google users
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    // 'customer' = service needer, 'provider' = service provider, 'admin' = platform admin
    enum: ['customer', 'provider', 'admin'],
    required: true,
  },
  phoneVerified: { type: Boolean, default: false },
  profileImage: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    pincode: { type: String },
    landmark: { type: String },
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  },
  // Provider Availability
  availability: {
    workingDays: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    breaks: [{
      start: { type: String },
      end: { type: String }
    }],
    unavailableDates: [{ type: String }] // e.g., '2026-08-20'
  },
  // Provider Settings for Custom Requests
  openToCustomRequests: { type: Boolean, default: false },
  serviceRadius: { type: Number, default: 10 }, // in km
  createdAt: { type: Date, default: Date.now },
});

// Create a 2dsphere index for geospatial queries
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
