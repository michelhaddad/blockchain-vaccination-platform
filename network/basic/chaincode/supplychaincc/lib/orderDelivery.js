/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

// Enumerate order delivery paper state values
const cpState = {
    IN_BORDER_CONTROL: 1,
    TO_STORAGE: 2,
    IN_STORAGE: 3,
    TO_HOSPITAL: 4,
    IN_HOSPITAL : 5
};

/**
 * OrderDelivery class extends State class
 * Class will be used by application and smart contract to define an order
 */
class OrderDelivery extends State {

    constructor(obj) {
        super(OrderDelivery.getClass(), obj.orderID);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */

    getIssuer(){
        return this.borderControl;
    }

    setIssuer(newBorderControl){
        this.borderControl = newBorderControl;
    }

    getStorage(){
        return this.storage;
    }

    setStorage(newStorage){
        this.storage = newStorage;
    }
    
    getHospital(){
        return this.hospital;
    }

    setHospital(newHospital){
        this.hospital = newHospital;
    }

    getBatchNumber(){
        return this.batchNumber;
    }

    setBatchNumber(newBatchNumber){
        this.batchNumber = newBatchNumber;
    }

    getNumberOfVials(){
        return this.numberOfVials;
    }

    setNumberOfVials(newNumberOfVials){
        this.numberOfVials = newNumberOfVials;
    }

    getArrivalDateTime(){
        return this.arrivalDateTime;
    }

    setArrivalDateTime(newArrivalDateTime){
        this.arrivalDateTime = newArrivalDateTime;
    }

    getUpdateDateTime(){
        return this.updateDateTime;
    }

    setUpdateDateTime(newUpdateDateTime){
        this.updateDateTime = newUpdateDateTime;
    }

    /**
     * Useful methods to encapsulate order delivery states
     */
    setInBorderControl() {
        this.currentState = cpState.IN_BORDER_CONTROL;
    }

    setToStorage() {
        this.currentState = cpState.TO_STORAGE;
    }

    setInStorage() {
        this.currentState = cpState.IN_STORAGE;
    }

    setToHospital() {
        this.currentState = cpState.TO_HOSPITAL;
    }

    setInHospital(){
        this.currentState = cpState.IN_HOSPITAL;
    }

    /**
     * Useful methods to check order delivery states
     */
    isInBorderControl() {
        return this.currentState === cpState.IN_BORDER_CONTROL;
    }

    isToStorage() {
        return this.currentState === cpState.TO_STORAGE;
    }

    isInStorage() {
        return this.currentState === cpState.IN_STORAGE;
    }

    isToHospital() {
        return this.currentState === cpState.TO_HOSPITAL;
    }
    isInHospital() {
        return this.currentState === cpState.IN_HOSPITAL;
    }

    static fromBuffer(buffer) {
        return OrderDelivery.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to donation paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, OrderDelivery);
    }

    /**
     * Factory method to create a donation paper object
     */
    static createInstance(orderID, issuer, storage, hospital, batchNumber, numberOfVials, 
        arrivalDateTime, issueDateTime, updateDateTime) {
        return new OrderDelivery({ orderID, issuer, storage, hospital, batchNumber, numberOfVials, 
            arrivalDateTime, issueDateTime, updateDateTime});
    }

    static getClass() {
        return 'org.papernet.orderDelivery';
    }
}

module.exports = OrderDelivery;
