'use strict';

const DonorMSP = 'DonorMSP';
const ImpactMSP = 'ImpactMSP';
const HopistalMSP = 'HospitalMSP';
const ManufacturerMSP = 'ManufacturerMSP';
const BorderControlMSP = 'BorderControlMSP';
const StorageFacilityMSP = 'StorageFacilityMSP'
const MophMSP = 'MOPHMSP'

const ALL_MSPS = [DonorMSP, ImpactMSP, HopistalMSP, ManufacturerMSP, BorderControlMSP, StorageFacilityMSP, MophMSP];

const QUERY_FUNCTIONS = ['query', 'indexHospitals', 'getHospital'];
const ALL_FUNCTIONS = [...QUERY_FUNCTIONS, 'deliverVials', 'inoculatePatients'];



const INSTANCIATION_FUNCTION = 'instantiate';


module.exports = {
    ALL_FUNCTIONS,
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