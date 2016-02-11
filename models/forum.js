var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');
var ObjectId = mongoose.Types.ObjectId;

var ForumSchema = new mongoose.Schema({
  name: String,
  title: String,
  url: String,
  provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

module.exports = mongoose.model('Forum', ForumSchema);