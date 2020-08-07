const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/APIAuthentication',{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true });
const app = express();

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
//routes
app.use('/users',require('./routes/users'));
// start the server
const port = process.env.PORT || 8000;
app.listen(port);
console.log('Server listening at port: ${port}');