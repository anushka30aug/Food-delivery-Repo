const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    require: true
  }, 

  email: {
    type: String,
    reuire: true,
    unique: true
  },

  // password: {
  //   type: String,
  //   require: true
  // },

  date: {
    type: Date,
    default: Date.now
  },

  address: {
    type: String,
    // required: true
  },

  city: {
    type: String,
    // require: true
  },

  state: {
    type: String,
    // require: true
  },

  country: {
    type: String,
    // require: true
  },

  pincode: {
    type: Number,
    // require: true
  },

  contact: {
    type: Number,
    // require: true
  },
  
  profilePicture:{
    type:String,
    default:''
  }

});
module.exports = mongoose.model('User', userSchema);