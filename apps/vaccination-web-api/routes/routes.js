'use strict';
module.exports = function (app) {

  const donationsController = require('../controllers/donationController');

  app.route('/donations')
    .get(donationsController.getAllDonations);
  app.route('/donations/donate')
    .post(donationsController.donate);
  app.route('/donations/redeem')
    .put(donationsController.redeem);
  app.route('/user/donations')
    .get(donationsController.getUserDonations)

};
