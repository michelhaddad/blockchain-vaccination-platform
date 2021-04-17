const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donationController')

const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', donationsController.getAllDonations);

router.post('/donate', donationsController.donate);

router.put('/redeem', donationsController.redeem);

module.exports = router;