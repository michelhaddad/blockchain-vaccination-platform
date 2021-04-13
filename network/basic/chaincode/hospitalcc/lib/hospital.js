/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

/**
 * Hospital class extends State class
 * Class will be used by application and smart contract to define a hospital
 */
class Hospital extends State {

    constructor(obj) {
        super(Hospital.getClass(), obj.hospitalID);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */

    getName(){
        return this.name;
    }

    getAddress(){
        return this.address;
    }

    getVaccineData(){
        return this.vaccineData;
    }

    setVaccineData(vaccineData) {
        this.vaccineData = vaccineData;
    }

    addDosesToBatch(batchID, doseCount, manufacturer = '') {
        if (!this.vaccineData[batchID] && manufacturer) {
            this.vaccineData[batchID] = {
                dosesDelivered: doseCount,
                remainingDoses: doseCount,
                manufacturer: manufacturer
            }
        } else if (!this.vaccineData[batchID]) {
            throw new Error("Manufacturer needs to be specified.")
        } else {
            this.vaccineData[batchID].dosesDelivered += doseCount;
            this.vaccineData[batchID].remainingDoses += doseCount;
        }
    }

    removeDosesFromBatch(batchID, doseCount) {
        if (!this.vaccineData[batchID]) {
            throw new Error(this.name + " didn't receive any doses from this batch.")
        } else {
            this.vaccineData[batchID].remainingDoses -= doseCount;
        }
    }

    static fromBuffer(buffer) {
        return Hospital.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to donation paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Hospital);
    }

    /**
     * Factory method to create a donation paper object
     */
    static createInstance(hospitalID, name, address = '', vaccineData = {}) {
        return new Hospital({ hospitalID, name, address, vaccineData});
    }

    static getClass() {
        return 'org.vaccinenet.hospital';
    }
}

module.exports = Hospital;
