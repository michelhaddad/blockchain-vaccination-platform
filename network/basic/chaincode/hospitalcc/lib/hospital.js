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

    addDosesToBatch(batchID, doseCount, manufacturer) {
        doseCount = parseInt(doseCount);

        // Add doses in Batch IDs section
        if (!this.vaccineDataPerBatch[batchID] && manufacturer) {
            this.vaccineDataPerBatch[batchID] = {
                dosesDelivered: doseCount,
                remainingDoses: doseCount,
                manufacturer: manufacturer
            }
        } else if (!this.vaccineDataPerBatch[batchID]) {
            throw new Error("Manufacturer needs to be specified.")
        } else {
            this.vaccineDataPerBatch[batchID].dosesDelivered += doseCount;
            this.vaccineDataPerBatch[batchID].remainingDoses += doseCount;
        }
        
        // increment to total remaining and delivrered doses
        this.totalDosesReceived += doseCount;
        this.totalRemainingDoses += doseCount;
    }

    removeDosesFromBatch(batchID, doseCount) {
        doseCount = parseInt(doseCount);
        const today = new Date().toISOString().slice(0, 10);

        // Decrement doses in Batch Ids section
        if (!this.vaccineDataPerBatch[batchID]) {
            throw new Error(this.name + " didn't receive any doses from this batch.")
        } else {
            this.vaccineDataPerBatch[batchID].remainingDoses -= doseCount;
        }

        // Add to daily administered doses
        if (!this.dailyAdministeredDoses[today]) {
            this.dailyAdministeredDoses[today] = {
                [batchID]: doseCount
            }
        } else {
            if (!this.dailyAdministeredDoses[today][batchID]) {
                this.dailyAdministeredDoses[today][batchID] = doseCount;
            } else {
                this.dailyAdministeredDoses[today][batchID] -= doseCount;
            }
        }

        // Decrement from total remaining doses
        this.totalRemainingDoses -= doseCount;
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
    static createInstance(hospitalID, name, address = '') {
        return new Hospital({ hospitalID, name, address, vaccineDataPerBatch: {}, totalDosesReceived: 0, totalRemainingDoses: 0, dailyAdministeredDoses: {}});
    }

    static getClass() {
        return 'org.vaccinenet.hospital';
    }
}

module.exports = Hospital;
