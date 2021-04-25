const ACLSubject = require('./ACLSubject');
const constants = require('./constants');

class HospitalAccessControl {
    constructor() {
        const donorAcl = new ACLSubject(constants.DonorMSP);
        const mophAcl = new ACLSubject(constants.MophMSP);
        const impactAcl = new ACLSubject(constants.ImpactMSP);
        const hospitalAcl = new ACLSubject(constants.HopistalMSP);
        // const bordercontrolAcl = new ACLSubject(constants.BorderControlMSP);
        // const storagefacilityAcl = new ACLSubject(constants.StorageFacilityMSP);

        this.aclRules = {
            [donorAcl]: constants.QUERY_FUNCTIONS,
            [impactAcl]: constants.QUERY_FUNCTIONS,
            [mophAcl] : constants.QUERY_FUNCTIONS,
            [hospitalAcl] : constants.ALL_FUNCTIONS
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

module.exports = HospitalAccessControl;