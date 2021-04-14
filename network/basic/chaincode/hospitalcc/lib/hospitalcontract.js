/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');
const Hospital = require('./hospital.js');
const HospitalList = require('./hospitalList.js');
const { hospitals, dosesPerVial } = require('./constants');


/**
 * A custom context provides easy access to list of all hospitals
 */
class HospitalContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.hospitalList = new HospitalList(this);
    }
}

/**
 * Define hospital smart contract by extending Fabric Contract class
 *
 */
class HospitalContract extends Contract {

    /**
     * Define a custom context for hospital
    */
    createContext() {
        return new HospitalContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {    
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');

        for (const h of hospitals) {
            let hospital = Hospital.createInstance(h.hospitalID, h.name, h.address);
            await ctx.hospitalList.addHospital(hospital);
        }
    }

    async query(ctx, query) {
        const iterator = await ctx.stub.getQueryResult(query);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    /**
     * Selects hospitals from database
     * 
     * @param {Context} ctx 
     * @returns 
     */
    async indexHospitals(ctx) {
        let query = {
            selector: {
                class: Hospital.getClass()
            }
        }
        query = JSON.stringify(query);
        const results = await this.query(ctx, query);
        return results;
    }

    async deliverVials(ctx, hospitalID, batchID, vials, manufacturer) {
        let hospital = await ctx.hospitalList.getHospital(hospitalID);
        const totalDoses = dosesPerVial[manufacturer] * vials;
        hospital.addDosesToBatch(batchID, totalDoses, manufacturer);

        await ctx.hospitalList.updateHospital(hospital);
        return hospital;
    }

    async inoculatePatients(ctx, hospitalID, batchID, patientCount) {
        let hospital = await ctx.hospitalList.getHospital(hospitalID);
        hospital.removeDosesFromBatch(batchID, patientCount);

        await ctx.hospitalList.updateHospital(hospital);
        return hospital;
    }
}

module.exports = HospitalContract;