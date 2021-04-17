const passport = require('passport');
const mongoose = require('mongoose');
const nocache = require('nocache');
const cors = require('cors');

const indexRouter = require('./routers/indexRouter');
const deliveriesRouter = require('./routers/deliveriesRouter');
const userRouter = require('./routers/userRouter');
const orderRouter = require('./routers/orderRouter');
const donationRouter = require('./routers/donationRouter');
const hospitalRouter = require('./routers/hospitalRouter');
const { verifyUser } = require('./database/authenticate');


var express = require('express'),
  app = express(),
  port = 3000,
  bodyParser = require('body-parser');

const url = "mongodb://localhost:27017/vaccinaton-platform";
const connect = mongoose.connect(url, {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
});
connect.then(
  (db) => {
    console.log('Successfully connected to the MongoDB server');
  },
  (err) => {
    console.log(err);
  },
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(nocache());
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/deliveries', verifyUser, deliveriesRouter);
app.use('/orders', verifyUser, orderRouter);
app.use('/hospitals', verifyUser, hospitalRouter);
app.use('/donations', verifyUser, donationRouter);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);


console.log('todo list RESTful API server started on: ' + port);