/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');
const Hospital = require('./hospital.js');

class HospitalList extends StateList {

    constructor(ctx) {
        super(ctx, Hospital.getClass());
        this.use(Hospital);
    }

    async addHospital(hospital) {
        return this.addState(hospital);
    }

    async getHospital(hospitalID) {
        return this.getState(hospitalID);
    }

    async updateHospital(hospital) {
        return this.updateState(hospital);
    }
}


module.exports = HospitalList;
