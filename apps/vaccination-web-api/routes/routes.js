'use strict';
module.exports = function(app) {
  var apis = require('../controllers/controller');

  // todoList Routes
  app.route('/firstRoute')
    .get(apis.test);

};
