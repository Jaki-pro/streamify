const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  profilePicture: {
    type: String,
    default: "uploads/profile/default.jpg",
  },
  subscribers: {
    type: Number,
    default: 0,
  },
  subscribedChannels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  watchHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
  likedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
  savedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }, 
}, { timestamps: true });

// Pre-save hook to ensure email is unique
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('email')) return next();
//     this.email = this.email.toLowerCase();
    
//     const existingUser = await mongoose.model('User').findOne({ email: this.email });
//     if (existingUser) {
//       return next(new Error('Email already exists'));
//     }
//     next();
//   });

// // Post-save hook to log user creation
// userSchema.post('save', function (doc, next) {
//   console.log(`New user created: ${doc.username}`);
//   next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
