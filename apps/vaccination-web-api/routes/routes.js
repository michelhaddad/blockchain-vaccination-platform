'use strict';
module.exports = function(app) {

  const donationsController = require('../controllers/donationController');
  app.route('/donations')
    .get(donationsController.getDonations);
  app.route('/donations/donate')
    .get(donationsController.donate);
  app.route('/donations/:donorId')
    .get(donationsController.getDonationsPerDonor);
  

};
