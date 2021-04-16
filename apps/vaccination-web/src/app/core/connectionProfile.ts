export const connectionProfile = {
	"name": "HLNETWORK",
	"version": "1.0.0",
	"license": "Apache-2.0",
	"client": {
		"tlsEnable": true,
		"adminUser": "admin",
		"adminPassword": "adminpw",
		"enableAuthentication": false,
		"organization": "Impact",
		"connection": {
			"timeout": {
				"peer": {
					"endorser": "300"
				},
				"orderer": "300"
			}
		}
	},
	"channels": {
		"mychannel": {
			"peers": {
				"peer0.Impact.HLNETWORK.com": {
					"endorsingPeer": true,
					"chaincodeQuery": true,
					"ledgerQuery": true,
					"eventSource": true
				},
				"peer0.MOPH.HLNETWORK.com": {
					"endorsingPeer": true,
					"chaincodeQuery": true,
					"ledgerQuery": true,
					"eventSource": true
				},
				"peer0.BorderControl.HLNETWORK.com": {
					"endorsingPeer": true,
					"chaincodeQuery": true,
					"ledgerQuery": true,
					"eventSource": true
				},
				"peer0.Manufacturer.HLNETWORK.com": {
					"endorsingPeer": true,
					"chaincodeQuery": true,
					"ledgerQuery": true,
					"eventSource": true
				},
				"peer0.Hospital.HLNETWORK.com": {
					"endorsingPeer": true,
					"chaincodeQuery": true,
					"ledgerQuery": true,
					"eventSource": true
				},
				"peer0.StorageFacility.HLNETWORK.com": {
					"endorsingPeer": true,
					"chaincodeQuery": true,
					"ledgerQuery": true,
					"eventSource": true
				},
				"peer0.Donor.HLNETWORK.com": {
					"endorsingPeer": true,
					"chaincodeQuery": true,
					"ledgerQuery": true,
					"eventSource": true
				}
			},
			"orderers": [
				"orderer.HLNETWORK.com"
			],
			"connection": {
				"timeout": {
					"peer": {
						"endorser": "6000",
						"eventHub": "6000",
						"eventReg": "6000"
					},
					"orderer": "6000"
				}
			}
		}
	},
	"organizations": {
		"Impact": {
			"mspid": "ImpactMSP",
			"fullpath": true,
			"peers": [
				"peer0.Impact.HLNETWORK.com"
			],
			"certificateAuthorities": [
                "ca.Impact.HLNETWORK.com"
            ],
			"adminPrivateKey": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Impact.HLNETWORK.com/users/Admin@Impact.HLNETWORK.com/msp/keystore/adminKeyImpact"
			},
			"signedCert": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Impact.HLNETWORK.com/users/Admin@Impact.HLNETWORK.com/msp/signcerts/Admin@Impact.HLNETWORK.com-cert.pem"
			}
		},
		"MOPH": {
			"mspid": "MOPHMSP",
			"fullpath": true,
			"peers": [
				"peer0.MOPH.HLNETWORK.com"
			],
			"certificateAuthorities": [
                "ca.MOPH.HLNETWORK.com"
            ],
			"adminPrivateKey": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/MOPH.HLNETWORK.com/users/Admin@MOPH.HLNETWORK.com/msp/keystore/adminKeyMOPH"
			},
			"signedCert": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/MOPH.HLNETWORK.com/users/Admin@MOPH.HLNETWORK.com/msp/signcerts/Admin@MOPH.HLNETWORK.com-cert.pem"
			}
		},
		"BorderControl": {
			"mspid": "BorderControlMSP",
			"fullpath": true,
			"peers": [
				"peer0.BorderControl.HLNETWORK.com"
			],
			"certificateAuthorities": [
                "ca.BorderControl.HLNETWORK.com"
            ],
			"adminPrivateKey": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/BorderControl.HLNETWORK.com/users/Admin@BorderControl.HLNETWORK.com/msp/keystore/adminKeyBorderControl"
			},
			"signedCert": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/BorderControl.HLNETWORK.com/users/Admin@BorderControl.HLNETWORK.com/msp/signcerts/Admin@BorderControl.HLNETWORK.com-cert.pem"
			}
		},
		"Manufacturer": {
			"mspid": "ManufacturerMSP",
			"fullpath": true,
			"peers": [
				"peer0.Manufacturer.HLNETWORK.com"
			],
			"certificateAuthorities": [
                "ca.Manufacturer.HLNETWORK.com"
            ],
			"adminPrivateKey": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Manufacturer.HLNETWORK.com/users/Admin@Manufacturer.HLNETWORK.com/msp/keystore/adminKeyManufacturer"
			},
			"signedCert": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Manufacturer.HLNETWORK.com/users/Admin@Manufacturer.HLNETWORK.com/msp/signcerts/Admin@Manufacturer.HLNETWORK.com-cert.pem"
			}
		},
		"Hospital": {
			"mspid": "HospitalMSP",
			"fullpath": true,
			"peers": [
				"peer0.Hospital.HLNETWORK.com"
			],
			"certificateAuthorities": [
                "ca.Hospital.HLNETWORK.com"
            ],
			"adminPrivateKey": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Hospital.HLNETWORK.com/users/Admin@Hospital.HLNETWORK.com/msp/keystore/adminKeyHospital"
			},
			"signedCert": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Hospital.HLNETWORK.com/users/Admin@Hospital.HLNETWORK.com/msp/signcerts/Admin@Hospital.HLNETWORK.com-cert.pem"
			}
		},
		"StorageFacility": {
			"mspid": "StorageFacilityMSP",
			"fullpath": true,
			"peers": [
				"peer0.StorageFacility.HLNETWORK.com"
			],
			"certificateAuthorities": [
                "ca.StorageFacility.HLNETWORK.com"
            ],
			"adminPrivateKey": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/StorageFacility.HLNETWORK.com/users/Admin@StorageFacility.HLNETWORK.com/msp/keystore/adminKeyStorageFacility"
			},
			"signedCert": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/StorageFacility.HLNETWORK.com/users/Admin@StorageFacility.HLNETWORK.com/msp/signcerts/Admin@StorageFacility.HLNETWORK.com-cert.pem"
			}
		},
		"Donor": {
			"mspid": "DonorMSP",
			"fullpath": true,
			"peers": [
				"peer0.Donor.HLNETWORK.com"
			],
			"certificateAuthorities": [
                "ca.Donor.HLNETWORK.com"
            ],
			"adminPrivateKey": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Donor.HLNETWORK.com/users/Admin@Donor.HLNETWORK.com/msp/keystore/adminKeyDonor"
			},
			"signedCert": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Donor.HLNETWORK.com/users/Admin@Donor.HLNETWORK.com/msp/signcerts/Admin@Donor.HLNETWORK.com-cert.pem"
			}
		},
		"OrdererOrg": {
			"mspid": "OrdererMSP",
			"fullpath": true,
			"adminPrivateKey": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/ordererOrganizations/HLNETWORK.com/users/Admin@HLNETWORK.com/msp/keystore/ordererAdminKey"
			},
			"signedCert": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/ordererOrganizations/HLNETWORK.com/users/Admin@HLNETWORK.com/msp/signcerts/Admin@HLNETWORK.com-cert.pem"
			}
		}
	},
	"peers": {
		"peer0.Impact.HLNETWORK.com": {
			"tlsCACerts": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Impact.HLNETWORK.com/peers/peer0.Impact.HLNETWORK.com/msp/tlscacerts/tlsca.Impact.HLNETWORK.com-cert.pem"
			},
			"url": "grpcs://localhost:7051",
			"grpcOptions": {
				"ssl-target-name-override": "peer0.Impact.HLNETWORK.com"
			}
		},
		"peer0.MOPH.HLNETWORK.com": {
			"tlsCACerts": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/MOPH.HLNETWORK.com/peers/peer0.MOPH.HLNETWORK.com/msp/tlscacerts/tlsca.MOPH.HLNETWORK.com-cert.pem"
			},
			"url": "grpcs://localhost:8051",
			"grpcOptions": {
				"ssl-target-name-override": "peer0.MOPH.HLNETWORK.com"
			}
		},
		"peer0.BorderControl.HLNETWORK.com": {
			"tlsCACerts": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/BorderControl.HLNETWORK.com/peers/peer0.BorderControl.HLNETWORK.com/msp/tlscacerts/tlsca.BorderControl.HLNETWORK.com-cert.pem"
			},
			"url": "grpcs://localhost:9051",
			"grpcOptions": {
				"ssl-target-name-override": "peer0.BorderControl.HLNETWORK.com"
			}
		},
		"peer0.Manufacturer.HLNETWORK.com": {
			"tlsCACerts": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Manufacturer.HLNETWORK.com/peers/peer0.Manufacturer.HLNETWORK.com/msp/tlscacerts/tlsca.Manufacturer.HLNETWORK.com-cert.pem"
			},
			"url": "grpcs://localhost:10051",
			"grpcOptions": {
				"ssl-target-name-override": "peer0.Manufacturer.HLNETWORK.com"
				
      		}
		},
		"peer0.Hospital.HLNETWORK.com": {
			"tlsCACerts": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Hospital.HLNETWORK.com/peers/peer0.Hospital.HLNETWORK.com/msp/tlscacerts/tlsca.Hospital.HLNETWORK.com-cert.pem"
			},
			"url": "grpcs://localhost:11051",
			"grpcOptions": {
				"ssl-target-name-override": "peer0.Hospital.HLNETWORK.com"
				
      		}
		},
		"peer0.StorageFacility.HLNETWORK.com": {
			"tlsCACerts": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/StorageFacility.HLNETWORK.com/peers/peer0.StorageFacility.HLNETWORK.com/msp/tlscacerts/tlsca.StorageFacility.HLNETWORK.com-cert.pem"
			},
			"url": "grpcs://localhost:12051",
			"grpcOptions": {
				"ssl-target-name-override": "peer0.StorageFacility.HLNETWORK.com"
				
      		}
		},
		"peer0.Donor.HLNETWORK.com": {
			"tlsCACerts": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/peerOrganizations/Donor.HLNETWORK.com/peers/peer0.Donor.HLNETWORK.com/msp/tlscacerts/tlsca.Donor.HLNETWORK.com-cert.pem"
			},
			"url": "grpcs://localhost:13051",
			"grpcOptions": {
				"ssl-target-name-override": "peer0.Donor.HLNETWORK.com"
				
      		}
		}
	},
	"orderers": {
		"orderer.HLNETWORK.com": {
			"tlsCACerts": {
				"path": "ABSPATH/blockchain-analyzer/network/basic/crypto-config/ordererOrganizations/HLNETWORK.com/msp/tlscacerts/tlsca.HLNETWORK.com-cert.pem"
			},
			"url": "grpcs://localhost:7050",
			"grpcOptions": {
				"ssl-target-name-override": "orderer.HLNETWORK.com"
			}
		}
	},
	"certificateAuthorities": {
		"ca.Impact.HLNETWORK.com": {
			"url": "http://localhost:7054",
			"caName": "ca.Impact.HLNETWORK.com"
		},
		"ca.MOPH.HLNETWORK.com": {
			"url": "http://localhost:8054",
			"caName": "ca.MOPH.HLNETWORK.com"
		},
		"ca.BorderControl.HLNETWORK.com": {
			"url": "http://localhost:9054",
			"caName": "ca.BorderControl.HLNETWORK.com"
		},
		"ca.Manufacturer.HLNETWORK.com": {
			"url": "http://localhost:10054",
			"caName": "ca.Manufacturer.HLNETWORK.com"
		},
		"ca.Hospital.HLNETWORK.com": {
			"url": "http://localhost:11054",
			"caName": "ca.Hospital.HLNETWORK.com"
		},
		"ca.StorageFacility.HLNETWORK.com": {
			"url": "http://localhost:12054",
			"caName": "ca.StorageFacility.HLNETWORK.com"
		},
		"ca.Donor.HLNETWORK.com": {
			"url": "http://localhost:13054",
			"caName": "ca.Donor.HLNETWORK.com"
		}
	}
}

