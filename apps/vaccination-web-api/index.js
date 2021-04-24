const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const nocache = require('nocache');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const indexRouter = require('./routers/indexRouter');
const deliveriesRouter = require('./routers/deliveriesRouter');
const userRouter = require('./routers/userRouter');
const orderRouter = require('./routers/orderRouter');
const donationRouter = require('./routers/donationRouter');
const hospitalRouter = require('./routers/hospitalRouter');
const { verifyUser } = require('./database/authenticate');
const createAdminAccounts = require('./utils/createAdminAccounts');
const createUserAccounts = require('./utils/createUserAccounts');


const app = express();
const port = 3000;
const mongoUrl = "mongodb://localhost:27017/vaccinaton-platform";

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

const connect = mongoose.connect(mongoUrl, {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
});

const initialize = async () => {
  try {
    await connect;
    console.log('Successfully connected to the MongoDB server\n');
    if (!fs.existsSync('wallet')) {
      await createAdminAccounts();
      await createUserAccounts();
    }

    app.listen(port);
    console.log('Vaccination Platform REST server listening on port ' + port) + '\n\n';
  } catch (e) {
    console.error(e);
  }
}

initialize();
