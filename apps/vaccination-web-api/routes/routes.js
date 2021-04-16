'use strict';
module.exports = function (app) {

  const donationsController = require('../controllers/donationController');
  const orderController = require('../controllers/orderController');
  const hospitalController = require('../controllers/hospitalController');

  app.route('/donations')
    .get(donationsController.getAllDonations);
  app.route('/donations/donate')
    .post(donationsController.donate);
  app.route('/donations/redeem')
    .put(donationsController.redeem);
  app.route('/user/donations')
    .get(donationsController.getUserDonations);

  app.route('/orders')
  .get(orderController.getAllOrders);
  app.route('/orders')
  .post(orderController.issueOrder);
  app.route('/orders/:id/approve')
  .put(orderController.approveOrder);
  app.route('/orders/:id/reject')
  .put(orderController.rejectOrder);
  app.route('/orders/:id/ship')
  .put(orderController.setOrderShipped);
  app.route('/orders/:id/deliver')
  .put(orderController.setOrderDelivered);

  app.route('/hospitals')
  .get(hospitalController.getAllHospitals);
  app.route('/hospitals/:id/deliver')
  .put(hospitalController.deliverVials);
  app.route('/hospitals/:id/inoculate')
  .put(hospitalController.inoculatePatients);

};
