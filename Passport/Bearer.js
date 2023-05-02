const jwt = require('jsonwebtoken');
const user = require('../Models/UserModel')
const passport = require('passport');
const LocalStrategy = require('passport-http-bearer').Strategy

passport.use(new LocalStrategy(
  async function (token, done) {
    const decoded = jwt.verify(token, process.env.JWTSECRET)
    const response = await user.findById(decoded.userId)

    if (!response) { return done(null, false); }
    return done(null, response);
  }
));