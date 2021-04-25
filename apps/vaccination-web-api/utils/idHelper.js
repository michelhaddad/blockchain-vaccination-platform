const uuid = require('uuid');

module.exports.generateUID = () => uuid.v4();

console.log(this.generateUID())