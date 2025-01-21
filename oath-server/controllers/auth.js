// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy
const LocalStrategy = require('passport-local').Strategy
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
const { jwtService } = require('../services/jwt');

passport.use(new LocalStrategy(
  async (username, password, callback) => {
    const result = await validateUser(username, password);
    if (!result) return callback(null, false);
    return callback(null, result);
   }
))

passport.use(new BasicStrategy(
  async function(username, password, callback) {
    try {
        const user = await User.findOne({ username: username });
        if (!user) { return callback(null, false); }
        const isVerified = user.verifyPassword(password);
         // Password did not match
         if (!isVerified) { return callback(null, false); }
         // Success
         return callback(null, user);
    } catch (error) {
        return callback(err);
    }
  }
));

passport.use('client-basic', new BasicStrategy(
  async function(username, password, callback) {
    try {
        const client = await Client.findOne({ id: username })
        if (!client || client.secret !== password) { return callback(null, false); }
        return callback(null, client);
    } catch (error) {
        return callback(err);
    }
  }
));

passport.use(new BearerStrategy(
  async function(accessToken, callback) {
    const payload = jwtService.verify(accessToken);
    if (!Object.keys(payload).length) { return callback(null, false);}
    const token = await Token.findOne({value: accessToken })
    if (!token) { return callback(null, false); }
    const user = await User.findOne({ _id: token.userId })
    if (!user) { return callback(null, false); }
    callback(null, user, { scope: '*' });
  }
));


const validateUser = async (username, password) => {
  try {
      const user = await User.findOne({ username: username });
      if (!user) { return null }
      const isVerified = user.verifyPassword(password);
      // Password did not match
      if (!isVerified) { return null; }
      // Success
      return user;
  } catch (error) {
      return null;
  }
} 

exports.loginWithLocal = passport.authenticate('local', { failureRedirect: '/' })
exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });