const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 
const User = require('../../models/User');
const { generateToken, verifyToken } = require('../../utils/authUtils'); 
require('dotenv').config();

const sendOtpEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 1 hour.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending OTP email:', error);
    } else {
      console.log('OTP email sent:', info.response);
    }
  });
};

const authResolver = {
  Query: {
    async verifyToken(_, { token }) {
      const result = await verifyToken(token);
      if (!result.success) {
        return { success: false, message: result.message };
      }

      const user = await User.findById(result.decoded.id);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      return { success: true, message: 'Token is valid' };
    },
  },

  Mutation: {
    async LoginSignup(_, { email }) {
      try {
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            email,
            userType: 'client',
            otp: null,
            otpCreation: null,
            status: 'active',
          });
          await user.save();
        } else if (user.status === 'inactive') {
          return { success: false, message: 'User is blocked' };
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpCreation = new Date();
        await user.save();
        sendOtpEmail(email, otp);

        return { success: true, message: 'OTP sent successfully' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async VerifyOtp(_, { email, otp }) {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return { success: false, message: 'User not found' };
        }

        const now = Date.now();
        const otpCreatedAt = user.otpCreation instanceof Date
          ? user.otpCreation.getTime()
          : new Date(user.otpCreation).getTime();

        if (!user.otp || user.otp !== otp) {
          return { success: false, message: 'Invalid OTP' };
        }

        if (now - otpCreatedAt > 60 * 60 * 1000) {
          return { success: false, message: 'OTP expired. Please request a new one.' };
        }

        const token = generateToken(user);

        user.otp = null;
        user.otpCreation = null;
        await user.save();

        return {
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.userType,
            status: user.status,
            createdAt: user.createdAt,
            bookmarkedTools: user.bookmarkedTools,
            toolSettingsDefaults: user.toolSettingsDefaults,
          },
        };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
  },
};

module.exports = authResolver;
