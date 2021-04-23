'use strict';

const DonorMSP = 'DonorMSP';
const ImpactMSP = 'ImpactMSP';
const HopistalMSP = 'HospitalMSP';
const ManufacturerMSP = 'ManufacturerMSP';
const BorderControlMSP = 'BorderControlMSP';
const StorageFacilityMSP = 'StorageFacilityMSP'
const MophMSP = 'MOPHMSP'

const ALL_MSPS = [DonorMSP, ImpactMSP, HopistalMSP, ManufacturerMSP, BorderControlMSP, StorageFacilityMSP, MophMSP];

const QUERY_FUNCTIONS = ['query', 'indexOrderDelivery', 'getAllOrderDeliveries'];
const ALL_FUNCTIONS = [...QUERY_FUNCTIONS, 'issue', 'storageDelivery', 'storageArrival', 'hospitalDelivery', 'hospitalArrival'];
const BORDERCONTROL_FUNCTIONS = ['storageDelivery'];
const STORAGEFACILITY_FUNCTIONS = ['storageArrival','hospitalDelivery'];
const HOSPITAL_FUNCTIONS = [...QUERY_FUNCTIONS, 'hospitalArrrival'];


const INSTANCIATION_FUNCTION = 'instantiate';


module.exports = {
    ALL_FUNCTIONS,
    BORDERCONTROL_FUNCTIONS,
    STORAGEFACILITY_FUNCTIONS,
    HOSPITAL_FUNCTIONS,
    MOPH_FUNCTIONS,
    QUERY_FUNCTIONS,
    DonorMSP,
    ImpactMSP,
    MophMSP,
    StorageFacilityMSP,
    BorderControlMSP,
    HopistalMSP,
    ManufacturerMSP,
    ALL_MSPS,
    INSTANCIATION_FUNCTION
}