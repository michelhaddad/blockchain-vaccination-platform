'use strict';

const DonorMSP = 'DonorMSP';
const ImpactMSP = 'ImpactMSP';
const HopistalMSP = 'HospitalMSP';
const ManufacturerMSP = 'ManufacturerMSP';
const BorderControlMSP = 'BorderControlMSP';
const StorageFacilityMSP = 'StorageFacilityMSP'
const MophMSP = 'MOPHMSP'

const ALL_MSPS = [DonorMSP, ImpactMSP, HopistalMSP, ManufacturerMSP, BorderControlMSP, StorageFacilityMSP, MophMSP];

const QUERY_FUNCTIONS = ['query', 'indexDonations', 'indexUserDonations', 'getMophBalance'];
const ALL_FUNCTIONS = [...QUERY_FUNCTIONS, 'triggerMophPayment', 'issue', 'redeem'];
const DONOR_FUNCTIONS = [...QUERY_FUNCTIONS, 'issue'];
const MOPH_FUNCTIONS = [...QUERY_FUNCTIONS, 'triggerMophPayment', 'redeem'];


module.exports = {
    ALL_FUNCTIONS,
    DONOR_FUNCTIONS,
    MOPH_FUNCTIONS,
    QUERY_FUNCTIONS,
    DonorMSP,
    ImpactMSP,
    MophMSP,
    StorageFacilityMSP,
    BorderControlMSP,
    HopistalMSP,
    ManufacturerMSP,
    ALL_MSPS
}