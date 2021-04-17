'use strict';
module.exports = function (app) {

  const donationsController = require('../controllers/donationController');
  const orderController = require('../controllers/orderController');
  const hospitalController = require('../controllers/hospitalController');
  const deliveriesController = require('../controllers/supplychainController');

  app.route('/donations')
    .get(donationsController.getAllDonations);
  app.route('/donations/donate')
    .post(donationsController.donate);
  app.route('/donations/redeem')
    .put(donationsController.redeem);
  app.route('/donations/user')
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
  .put(orderController.setOrderDelivered); // by border control
  app.route('/orders/:id/deliveries')
  .get(deliveriesController.getAllOrderDeliveries);

  app.route('/hospitals')
  .get(hospitalController.getAllHospitals);
  app.route('/hospitals/:id/deliver')
  .put(hospitalController.deliverVials);
  app.route('/hospitals/:id/inoculate')
  .put(hospitalController.inoculatePatients);

  app.route('/deliveries')
  .get(deliveriesController.getAllDeliveries); //
  app.route('/deliveries')
  .post(deliveriesController.issueOrderDelivery);
  app.route('/deliveries/:id/settostorage')
  .put(deliveriesController.setStorageDelivery);
  app.route('/deliveries/:id/setinstorage')
  .put(deliveriesController.setStorageArrival);
  app.route('/deliveries/:id/settohospital')
  .put(deliveriesController.setHospitalDelivery);
  app.route('/deliveries/:id/setinhospital')
  .put(deliveriesController.setHospitalArrival);


};
