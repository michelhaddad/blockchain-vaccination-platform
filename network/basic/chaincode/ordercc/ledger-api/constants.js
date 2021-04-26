"use strict";

const DonorMSP = "DonorMSP";
const ImpactMSP = "ImpactMSP";
const HopistalMSP = "HospitalMSP";
const ManufacturerMSP = "ManufacturerMSP";
const BorderControlMSP = "BorderControlMSP";
const StorageFacilityMSP = "StorageFacilityMSP";
const MophMSP = "MOPHMSP";

const ALL_MSPS = [
  DonorMSP,
  ImpactMSP,
  HopistalMSP,
  ManufacturerMSP,
  BorderControlMSP,
  StorageFacilityMSP,
  MophMSP,
];

const QUERY_FUNCTIONS = ["query", "getAllOrders", "getAllApprovedOrders"];
const ALL_FUNCTIONS = [...QUERY_FUNCTIONS, "issue", "approve", "reject", "setOrderShipped", "setOrderDelivered"];
const MANUFACTURER_FUNCTIONS = [...QUERY_FUNCTIONS, "approve", "reject", "setOrderShipped"];
const MOPH_FUNCTIONS = [...QUERY_FUNCTIONS, "issue"];
const BORDERCONTROL_FUNCTIONS = [...QUERY_FUNCTIONS, "setOrderDelivered"];

const INSTANCIATION_FUNCTION = "instantiate";

module.exports = {
  ALL_FUNCTIONS,
  BORDERCONTROL_FUNCTIONS,
  MANUFACTURER_FUNCTIONS,
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
  INSTANCIATION_FUNCTION,
};
