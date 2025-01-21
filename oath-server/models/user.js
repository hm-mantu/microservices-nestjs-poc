// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Define our user schema
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Execute before each user.save() call
UserSchema.pre('save', async function() {
  const user = this;
  // Break out if the password hasn't changed
  if (!user.isModified('password')) return false;
  // Password changed so we need to hash it
  const salt = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(user.password, salt, null);
  user.password = hash;
});

UserSchema.methods.verifyPassword = async function(password) {
  try {
    const isValid = bcrypt.compareSync(password, this.password);
    return isValid;
  } catch (error) {
    return false;
  }
  
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);