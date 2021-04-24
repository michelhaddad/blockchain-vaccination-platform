const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController')

const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', hospitalController.getAllHospitals);

router.get('/dosesData', hospitalController.getDosesData);

router.get('/dailyadministrations', hospitalController.getDailyAdministrations);

router.put('/:id/deliver', hospitalController.deliverVials);

router.put('/:id/inoculate', hospitalController.inoculatePatients);

module.exports = router;