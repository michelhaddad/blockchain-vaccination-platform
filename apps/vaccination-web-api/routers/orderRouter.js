const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orderController')
const deliveriesController = require('../controllers/supplychainController')

const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', ordersController.getAllOrders);

router.get('/:id/deliveries', deliveriesController.getAllOrderDeliveries);

router.post('/', ordersController.issueOrder);

router.put('/:id/approve', ordersController.approveOrder);

router.put('/:id/reject', ordersController.rejectOrder);

router.put('/:id/ship', ordersController.setOrderShipped);

router.put('/:id/deliver', ordersController.setOrderDelivered);

module.exports = router;