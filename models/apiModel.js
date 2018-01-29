'use strict';
var mongoose = require("mongoose"),
      Schema = mongoose.Schema;

// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array

var TwitSchema = new Schema({
  created_at: Date,
  id: String,
  id_str: String,
  text: String,
  source: String,
  truncated: Boolean,
  in_reply_to_status_id: Number,
  in_reply_to_status_id_str: String,
  in_reply_to_user_id: Number,
  in_reply_to_user_id_str: String,
  in_reply_to_screen_name: String,
  user: Object,
  geo: String,
  coordinates: String,
  place: String,
  contributors: String,
  retweeted_status: Object,
  is_quote_status: Boolean,
  quote_count: Number,
  reply_count: Number,
  retweet_count: Number,
  favorite_count: Number,
  entities: Object,
  favorited: Boolean,
  retweeted: Boolean,
  filter_level: String,
  lang: String,
  timestamp_ms: Number
});


module.exports = mongoose.model('Twits', TwitSchema);
