const mongoose = require('mongoose');
const schema = mongoose.Schema;
const UserSchema = new schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
  },
  Phone: {
    type: Number,
    required: true
  },
  Adress: {
    type: String,
    required: true
  },
  role: {
    type: String,
    Enumerator: ['admin', 'client'],
    default: "client",
  }
}
  , {
    timestamps: true,
    versionKey: false
  })
module.exports = mongoose.model('User', UserSchema)