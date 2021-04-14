'use strict';
var invoke = require('../invoke')
exports.test = function(req, res) {
    invoke().then(()=> res.status(204).send({}))
};
