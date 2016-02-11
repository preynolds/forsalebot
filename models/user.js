var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');
var ObjectId = mongoose.Types.ObjectId;

var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: { type: String, select: false },
  firstName: String,
  lastName: String,
  active: Boolean,
  updated: { type: Date, default: Date.now },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

module.exports = mongoose.model('User', UserSchema);