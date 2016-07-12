var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  title: String,
  content: String
});

mongoose.model('Message', MessageSchema);