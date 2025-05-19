const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Sanitize email: lowercase and trim
    const sanitizedEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await User.findOne({ email: sanitizedEmail });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create user (password will be hashed in User model's pre-save hook)
    user = new User({
      email: sanitizedEmail,
      password // Raw password, hashed automatically by the User model
    });

    await user.save();

    // Generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });

  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Sanitize email: lowercase and trim
    const sanitizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
};
