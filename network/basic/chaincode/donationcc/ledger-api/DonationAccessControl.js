const ACLSubject = require('./ACLSubject');
const constants = require('./constants');

class DonationAccessControl {
    constructor() {
        const donorAcl = new ACLSubject(constants.DonorMSP);
        const mophAcl = new ACLSubject(constants.MophMSP);
        const impactAcl = new ACLSubject(constants.ImpactMSP);

        this.aclRules = {
            [donorAcl]: constants.DONOR_FUNCTIONS,
            [mophAcl]: constants.MOPH_FUNCTIONS,
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
        if (fcn == constants.INSTANCIATION_FUNCTION) return true;
        if (!this.aclRules[aclSubject]) {
            return false;
        }

        return this.aclRules[aclSubject].some(x => x === fcn);
    }
}

module.exports = DonationAccessControl;