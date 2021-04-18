'use strict';

class ACLSubject {

    constructor(mspid) {
        this._mspid = mspid;
    }

    getMspId() {
        return this._mspid;
    }

    setMspId(mspId) {
        this._mspid = mspId;
    }

    equals(obj) {
        if (obj instanceof ACLSubject) {
            return obj.getMspId() == (this.getMspId());
        }
        return false;
    }

    toString() {
        return "MSP ID: " + this.getMspId();
    }
}


module.exports = ACLSubject;