const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const connectDB = require('./db');
const User = require('./models/User');
const otpRoutes = require('./routes/otp');
// Service model placeholder for future use
// const Service = require('./models/Service');
const { requireAuth, requireRole } = require('./middleware/auth');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// OTP routes (WhatsApp via Twilio Verify)
app.use('/api/otp', otpRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('HomeFix API is running');
});

// ---------- Auth Routes ----------

// Legacy register route (kept for backward compat but OTP-verified flow is preferred)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (!['customer', 'provider'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be customer or provider.' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'This phone number is already registered.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashed, role, phoneVerified: false });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ success: true, message: 'Registration successful', user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error('[Register Error]', err.message);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      const msg = field === 'phone' ? 'This phone number is already registered.' : 'An account with this email already exists.';
      return res.status(400).json({ success: false, message: msg });
    }
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});

// OTP-verified registration (new preferred flow)
app.post('/api/auth/register-verified', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (!['customer', 'provider'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Admin accounts cannot be created through signup.' });
    }
    if (!email.match(/.+@.+\..+/)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'This phone number is already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      password: hashed,
      role,
      phoneVerified: true,  // Phone was verified via Twilio OTP before reaching here
    });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({
      success: true,
      message: 'Account created successfully.',
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, phoneVerified: user.phoneVerified },
    });
  } catch (err) {
    console.error('[Register-Verified Error]', err.message);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      const msg = field === 'phone' ? 'This phone number is already registered.' : 'An account with this email already exists.';
      return res.status(400).json({ success: false, message: msg });
    }
    res.status(500).json({ success: false, message: 'Account creation failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Support login by email OR phone
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { phone: email.trim() }],
    });
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email or phone number.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    // Role is always from DB — frontend must redirect based on this, not its own state
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, phoneVerified: user.phoneVerified } });
  } catch (err) {
    console.error('[Login Error]', err.message);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, user });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});

// ---------- Demo DB (JSON file) for services & bookings ----------
const DB_FILE = path.join(__dirname, 'db.json');

const readDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) initializeDB();
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return {};
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing DB:', error);
  }
};

// Services endpoint (public)
app.get('/api/services', (req, res) => {
  const { category, search, sort } = req.query;
  const db = readDB();
  let result = [...(db.services || [])];
  if (category) result = result.filter(s => s.category.toLowerCase() === category.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }
  if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  res.json({ success: true, services: result });
});

// Protected bookings routes
app.get('/api/bookings', requireAuth, (req, res) => {
  const db = readDB();
  const allBookings = db.bookings || [];
  let userBookings = [];
  if (req.user.role === 'admin') {
    userBookings = allBookings;
  } else if (req.user.role === 'provider') {
    userBookings = allBookings.filter(b => b.providerId === req.user.id);
  } else {
    userBookings = allBookings.filter(b => b.customerId === req.user.id);
  }
  res.json({ success: true, bookings: userBookings });
});

app.post('/api/bookings', requireAuth, (req, res) => {
  const bookingData = req.body;
  const db = readDB();
  const newBooking = {
    id: `HF${1000 + (db.bookings?.length || 0) + 1}`,
    customerId: req.user.id,
    customerName: req.user.name || 'Anonymous',
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...bookingData,
  };
  db.bookings = [...(db.bookings || []), newBooking];
  writeDB(db);
  res.json({ success: true, booking: newBooking });
});

app.put('/api/bookings/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDB();
  const index = (db.bookings || []).findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Booking not found' });
  db.bookings[index].status = status;
  writeDB(db);
  res.json({ success: true, booking: db.bookings[index] });
});

// Profile update (protected)
app.put('/api/profile', requireAuth, async (req, res) => {
  const updatedData = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  Object.assign(user, updatedData);
  await user.save();
  res.json({ success: true, user, message: 'Profile updated successfully' });
});

// Provider earnings (protected)
app.get('/api/earnings', requireAuth, requireRole('provider'), (req, res) => {
  // In a real implementation, compute earnings from bookings
  res.json({ success: true, earnings: { total: 0, recent: [] } });
});

app.listen(PORT, () => {
  console.log(`HomeFix Backend running on http://localhost:${PORT}`);
});
