var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');
var ObjectId = mongoose.Types.ObjectId;

var ProviderSchema = new mongoose.Schema({
  name: String,
  prettyName: String,
  url: String,
  topicUrl: String,
  selector: String,
  forums: [{ type: Schema.Types.ObjectId, ref: 'Forum' }]
});

module.exports = mongoose.model('Provider', ProviderSchema);
