const ACLSubject = require('./ACLSubject');
const constants = require('./constants');

class OrderAccessControl {
    constructor() {
        const manufacturerAcl = new ACLSubject(constants.ManufacturerMSP);
        const mophAcl = new ACLSubject(constants.MophMSP);
        const bordercontrolAcl = new ACLSubject(constants.BorderControlMSP);
        const impactAcl = new ACLSubject(constants.ImpactMSP);

        this.aclRules = {
            [manufacturerAcl]: constants.MANUFACTURER_FUNCTIONS,
            [mophAcl]: constants.MOPH_FUNCTIONS,
            [bordercontrolAcl] : constants.BORDERCONTROL_FUNCTIONS,
            [impactAcl]: constants.QUERY_FUNCTIONS
        }
    }

    getClientMspId(ctx) {
        return ctx.clientIdentity.getMSPID();
    }

    checkAccess(ctx, fcn) {
        const mspId = this.getClientMspId(ctx);
        const aclSubject = new ACLSubject(mspId);
        if (!constants.ALL_MSPS.some(x => x == mspId)) {
            throw new Error("User is not recognized");
        }

        if (!this.aclRules[aclSubject]) {
            return false;
        }

        if (fcn == constants.INSTANCIATION_FUNCTION) return true;
        
        
        return this.aclRules[aclSubject].some(x => x === fcn);
    }
}

module.exports = OrderAccessControl;