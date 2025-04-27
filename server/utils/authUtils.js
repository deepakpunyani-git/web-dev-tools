const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.JWT_SECRET;
const jwtExpiry = process.env.JWT_EXPIRY || '1d';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, userType: user.userType },
    secretKey,
    { expiresIn: jwtExpiry }
  );
};

const verifyToken = async (token) => {
  try {
    const cleanToken = token?.replace('Bearer ', '');

    const decoded = jwt.verify(cleanToken, secretKey);
    return { success: true, decoded };
  } catch (error) {
    return { success: false, message: "Invalid or expired token" };
  }
};

const getVerifiedUser = async (token) => {
  const cleanToken = token?.replace('Bearer ', '');
  const { success, decoded, message } = await verifyToken(cleanToken);
  if (!success) throw new Error(message || 'Unauthorized');

  const user = await User.findById(decoded.id);
  if (!user) throw new Error('User not found');

  return user;
};

const verifyAdmin = async (token) => {
  const cleanToken = token?.replace('Bearer ', '');
  const tokenResponse = await verifyToken(cleanToken);

  if (!tokenResponse.success) {
    return tokenResponse;  
  }

  const userId = tokenResponse.decoded.id;
  const user = await User.findById(userId);

  if (!user || user.userType !== "admin") {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  return { success: true, user };
};

module.exports = {
  generateToken,
  verifyToken,
  getVerifiedUser,
  verifyAdmin
};
