'use strict';
var TwitLib = require('twit'),
    mongoose = require('mongoose'),
    Twits = mongoose.model('Twits');


/*
* retrieves twits and save in collection twits in a db (process.env.DB_NAME)
*/
exports.getTwits = (res) => {
  const config = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }

  var T = new TwitLib(config),
      stream = T.stream('statuses/filter', { track: 'javascript' });

  stream.on('tweet', (tweet) => {

    const Twit = new Twits({
      created_at: tweet.created_at,
      id: tweet.id,
      id_str: tweet.id_str,
      text: tweet.text,
      source: tweet.source,
      truncated: tweet.truncated,
      in_reply_to_status_id: tweet.in_reply_to_status_id,
      in_reply_to_status_id_str: tweet.in_reply_to_status_id_str,
      in_reply_to_user_id: tweet.in_reply_to_user_id,
      in_reply_to_user_id_str: tweet.in_reply_to_user_id_str,
      in_reply_to_screen_name: tweet.in_reply_to_screen_name,
      user: tweet.user, // user.screen_name
      geo: tweet.geo,
      coordinates: tweet.coordinates,
      place: tweet.place,
      contributors: tweet.contributors,
      retweeted_status: tweet.retweeted_status,
      is_quote_status: tweet.is_quote_status,
      quote_count: tweet.quote_count,
      reply_count: tweet.reply_count,
      retweet_count: tweet.retweet_count,
      favorite_count: tweet.favorite_count,
      entities: tweet.entities, // entities.hashtags , entities.user_mentions
      favorited: tweet.favorited,
      retweeted: tweet.retweeted,
      filter_level: tweet.filter_level,
      lang: tweet.lang,
      timestamp_ms: tweet.timestamp_ms
    })

    Twit.save((err, Twit) => {
      if(err) res(err.message);
      res(null, {twit: tweet.text})
    });

  })
}

/*
* filter the tweets by:
* username
* hashtag
* user mention
*/
exports.filter = (req, res) => {
  const queryFilters = [
    { name: 'user.screen_name', value: req.query.userName }, // userName=tunahorse21
    { name: 'entities.hashtags.text', value: { "$in" : [req.query.hashtag] } }, // hashtag=startup
    { name: 'entities.user_mentions.screen_name', value: { "$in" : [req.query.userMention] } }, // userMention=YouTube
    { name: 'pageNumber', value: req.query.pageNumber } // pageNumber=3
  ],
  limit = parseFloat(req.query.limit ? req.query.limit : 100); // limit=30

  let  result = {},
      filters = {},
      pageNumber = 1;


  queryFilters.forEach((filter, key) => {
    if (filter.name === "pageNumber" && typeof filter.value !== 'undefined') {
      pageNumber = filter.value;
    } else {
      if (typeof filter.value === 'object'){
        if (typeof filter.value["$in"][0] !== 'undefined') {
          filters[filter.name] = filter.value
        }
      } else {
        if (typeof filter.value !== 'undefined') {
          filters[filter.name] = filter.value
        }
      }
    }
  })

  Twits.
    find(filters).
    count().
    exec( (err, count) => {
      result.total = { items: count, pages: parseInt(count / limit)+1 }
    })

  Twits.
    find(filters).
    skip(limit*(pageNumber-1)).
    limit(limit).
    sort({ _id: 1 }).
    select({ text: 1, user: 1 }).
    exec((err, twits) => {
      if (err) {
        res.send(err);
      } else if (twits.length > 0) {
        let data = []
        twits.forEach( (twit, key) => {
          data.push({ userName: twit.user.screen_name, twit: twit.text })
        })
        result.pageNumber = pageNumber
        result.data = data
      }
      res.json(result);
    });

}
