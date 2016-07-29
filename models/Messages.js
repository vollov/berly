var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  ac:Boolean,
  furnance:Boolean,
  other:Boolean,
  processed: { type: Boolean, default: false },
  create_date: {
      type: Date,
      // Date.now() returns the current unix timestamp as a number
      default: Date.now
  },
  content: String
  
});

mongoose.model('Message', MessageSchema);