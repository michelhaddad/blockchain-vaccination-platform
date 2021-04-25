const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const donationController = require('../controllers/donationController')

const bodyParser = require('body-parser');
const { verifyUser, verifyAdmin } = require('../database/authenticate');

router.use(bodyParser.json());

router.get('/donations', verifyUser, donationController.getUserDonations);

router.post('/signup', verifyUser, verifyAdmin, userController.signupUser);

router.post('/login', passport.authenticate('local'), userController.login);

module.exports = router;