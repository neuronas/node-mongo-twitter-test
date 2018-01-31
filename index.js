require('dotenv').config()
var express = require("express"),
    app = express(),
    port = process.env.PORT || 4000,
    bodyParser  = require("body-parser");

/* persistencia de datos */
 var mongoose = require("mongoose"),
     Twits = require("./models/apiModel"),
     controller = require('./controllers/apiController');
 if(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_PORT) {
   var DB_URI = process.env.DB_HOST+":"+process.env.DB_PORT+"/"+process.env.DB_NAME
 }

/* conexion a la base de datos (MongoDB instance) */
 mongoose.connect(DB_URI || 'mongodb://localhost/dbtest', {useMongoClient:true});
 mongoose.connection.once('open', () => {
     console.log('mongoDB Connected');
     controller.getTwits((err, res) => {
       if (err) console.log("error al guardar en base de datos", err)
       console.log("saved: " + res.twit)
     })
 }).on('error', (error) => {
     console.log('CONNECTION ERROR:',error);
 });

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
var routes = require("./routes/apiRoutes");
routes(app)

// cors
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Middlewar
app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// start Server
app.listen(port, () => {
  console.log("Node server running on http://localhost:"+ port);
});
