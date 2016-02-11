var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');
var ObjectId = mongoose.Types.ObjectId;

var ResultSchema = new mongoose.Schema({ 
  'title': String,
  'score': Number,
  'topicId': String,
  'sent': { type: Boolean, default: false }
});

var TaskSchema = new mongoose.Schema({
  name: String,
  forum: { type: Schema.Types.ObjectId, ref: 'Forum' },
  needle: String,
  updated: { type: Date, default: Date.now },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  sent: { type: Boolean, default: false },
  results: [ResultSchema]
});

module.exports = mongoose.model('Task', TaskSchema);