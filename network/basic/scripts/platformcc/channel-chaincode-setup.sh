#!/bin/bash

echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "CONF of CHANNEL1 : CONTRACT"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
export CHANNEL_NAME=contractchannel

#Create channel
export CACERT_ORDERER=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/el-network.com/orderers/orderer.el-network.com/tls/ca.crt
export CACERT_1=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Impact.el-network.com/peers/peer0.Impact.el-network.com/tls/ca.crt
export CACERT_2=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MOPH.el-network.com/peers/peer0.MOPH.el-network.com/tls/ca.crt
export CACERT_3=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/BorderControl.el-network.com/peers/peer0.BorderControl.el-network.com/tls/ca.crt
export CACERT_4=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Manufacturer.el-network.com/peers/peer0.Manufacturer.el-network.com/tls/ca.crt
export CACERT_5=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Donor.el-network.com/peers/peer0.Donor.el-network.com/tls/ca.crt
peer channel create -o orderer.el-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts-contractchannel/channel.tx --tls --cafile $CACERT_ORDERER

#Connect peers to channel
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "CONNECTING PEERS TO CHANNEL"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
for ORG_NUM in Impact MOPH BorderControl Manufacturer Donor
do
if [ $ORG_NUM == Impact ]; then
        CACERT=$CACERT_1
    else if [ $ORG_NUM == MOPH ]; then
            CACERT=$CACERT_2
        else if [ $ORG_NUM == BorderControl ]; then
                CACERT=$CACERT_3
            else if [ $ORG_NUM == Manufacturer ]; then
                CACERT=$CACERT_4
            else 
                CACERT=$CACERT_5
            fi
        fi
    fi
fi
    eval "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG_NUM.el-network.com/users/Admin@$ORG_NUM.el-network.com/msp CORE_PEER_ADDRESS=peer0.$ORG_NUM.el-network.com:7051 CORE_PEER_LOCALMSPID=${ORG_NUM}MSP CORE_PEER_TLS_ROOTCERT_FILE=$CACERT"

    echo "Connecting peer0 of $ORG_NUM to $CHANNEL_NAME..."
    peer channel join -b contractchannel.block
done

#Update channel
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "UPDATING CHANNEL"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
for ORG_NUM in Impact MOPH BorderControl Manufacturer Donor
do
if [ $ORG_NUM == Impact ]; then
        CACERT=$CACERT_1
    else if [ $ORG_NUM == MOPH ]; then
            CACERT=$CACERT_2
        else if [ $ORG_NUM == BorderControl ]; then
                CACERT=$CACERT_3
            else if [ $ORG_NUM == Manufacturer ]; then
                CACERT=$CACERT_4
            else 
                CACERT=$CACERT_5
            fi
        fi
    fi
fi
    eval "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG_NUM.el-network.com/users/Admin@$ORG_NUM.el-network.com/msp CORE_PEER_ADDRESS=peer0.$ORG_NUM.el-network.com:7051 CORE_PEER_LOCALMSPID=${ORG_NUM}MSP CORE_PEER_TLS_ROOTCERT_FILE=$CACERT"
    echo "Updating $CHANNEL_NAME..."
    peer channel update -o orderer.el-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts-contractchannel/${ORG_NUM}MSPanchors.tx --tls --cafile $CACERT_ORDERER
done

#Install chaincode
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "INSTALLING CHAINCODE"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
for ORG_NUM in Impact MOPH BorderControl Manufacturer Donor
do
if [ $ORG_NUM == Impact ]; then
        CACERT=$CACERT_1
    else if [ $ORG_NUM == MOPH ]; then
            CACERT=$CACERT_2
        else if [ $ORG_NUM == BorderControl ]; then
                CACERT=$CACERT_3
            else if [ $ORG_NUM == Manufacturer ]; then
                CACERT=$CACERT_4
            else 
                CACERT=$CACERT_5
            fi
        fi
    fi
fi
    eval "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG_NUM.el-network.com/users/Admin@$ORG_NUM.el-network.com/msp CORE_PEER_ADDRESS=peer0.$ORG_NUM.el-network.com:7051 CORE_PEER_LOCALMSPID=${ORG_NUM}MSP CORE_PEER_TLS_ROOTCERT_FILE=$CACERT"
    echo "Installing chaincode on peer0 of $ORG_NUM of $CHANNEL_NAME..."
    peer chaincode install -n dummycc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/dummycc
    peer chaincode install -n donationcc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/donationcc
    peer chaincode install -n ordercc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/ordercc
    peer chaincode install -n supplychaincc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/supplychaincc
done

# Instantiate chaincode
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "INSTANTIATING CHAINCODE"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Impact.el-network.com/users/Admin@Impact.el-network.com/msp
CORE_PEER_ADDRESS=peer0.Impact.el-network.com:7051
CORE_PEER_LOCALMSPID=ImpactMSP
CORE_PEER_TLS_ROOTCERT_FILE=$CACERT_1
CORE_VM_DOCKER_ATTACHSTDOUT=true

peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n dummycc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','ManufacturerMSP.member','DonorMSP.member')" --tls --cafile $CACERT_ORDERER
echo "Instanciated the dummycc chaincode"
peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n donationcc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','ManufacturerMSP.member','DonorMSP.member')" --tls --cafile $CACERT_ORDERER
echo "Instanciated the donationcc chaincode"
peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n ordercc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','ManufacturerMSP.member','DonorMSP.member')" --tls --cafile $CACERT_ORDERER
echo "Instanciated the ordercc chaincode"
peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n supplychaincc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','ManufacturerMSP.member','DonorMSP.member')" --tls --cafile $CACERT_ORDERER
echo "Instanciated the supplychaincc chaincode"

echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "CONF of CHANNEL2 : DISTRIBUTION"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
export CHANNEL_NAME=distributionchannel

#Create channel
export CACERT_ORDERER=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/el-network.com/orderers/orderer.el-network.com/tls/ca.crt
export CACERT_1=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Impact.el-network.com/peers/peer0.Impact.el-network.com/tls/ca.crt
export CACERT_2=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MOPH.el-network.com/peers/peer0.MOPH.el-network.com/tls/ca.crt
export CACERT_3=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/BorderControl.el-network.com/peers/peer0.BorderControl.el-network.com/tls/ca.crt
export CACERT_4=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Hospital.el-network.com/peers/peer0.Hospital.el-network.com/tls/ca.crt
export CACERT_5=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/StorageFacility.el-network.com/peers/peer0.StorageFacility.el-network.com/tls/ca.crt
export CACERT_6=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Donor.el-network.com/peers/peer0.Donor.el-network.com/tls/ca.crt
peer channel create -o orderer.el-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts-distributionchannel/channel.tx --tls --cafile $CACERT_ORDERER

#Connect peers to channel
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "CONNECTING PEERS TO CHANNEL"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
for ORG_NUM in Impact MOPH BorderControl Hospital StorageFacility Donor
do
if [ $ORG_NUM == Impact ]; then
        CACERT=$CACERT_1
    else if [ $ORG_NUM == MOPH ]; then
            CACERT=$CACERT_2
        else if [ $ORG_NUM == BorderControl ]; then
                CACERT=$CACERT_3
            else if [ $ORG_NUM == Hospital ]; then
                CACERT=$CACERT_4
                else if [ $ORG_NUM == StorageFacility ]; then
                CACERT=$CACERT_5
                else
                CACERT=$CACERT_6
                fi
            fi
        fi
    fi
fi
    eval "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG_NUM.el-network.com/users/Admin@$ORG_NUM.el-network.com/msp CORE_PEER_ADDRESS=peer0.$ORG_NUM.el-network.com:7051 CORE_PEER_LOCALMSPID=${ORG_NUM}MSP CORE_PEER_TLS_ROOTCERT_FILE=$CACERT"

    echo "Connecting peer0 of $ORG_NUM to $CHANNEL_NAME..."
    peer channel join -b distributionchannel.block
done

#Update channel
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "UPDATING CHANNEL"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
for ORG_NUM in Impact MOPH BorderControl Hospital StorageFacility Donor
do
if [ $ORG_NUM == Impact ]; then
        CACERT=$CACERT_1
    else if [ $ORG_NUM == MOPH ]; then
            CACERT=$CACERT_2
        else if [ $ORG_NUM == BorderControl ]; then
                CACERT=$CACERT_3
            else if [ $ORG_NUM == Hospital ]; then
                CACERT=$CACERT_4
                else if [ $ORG_NUM == StorageFacility ]; then
                CACERT=$CACERT_5
                else
                CACERT=$CACERT_6
                fi
            fi
        fi
    fi
fi
    eval "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG_NUM.el-network.com/users/Admin@$ORG_NUM.el-network.com/msp CORE_PEER_ADDRESS=peer0.$ORG_NUM.el-network.com:7051 CORE_PEER_LOCALMSPID=${ORG_NUM}MSP CORE_PEER_TLS_ROOTCERT_FILE=$CACERT"
    echo "Updating $CHANNEL_NAME..."
    peer channel update -o orderer.el-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts-distributionchannel/${ORG_NUM}MSPanchors.tx --tls --cafile $CACERT_ORDERER
done

#Install chaincode
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "INSTALLING CHAINCODE"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
for ORG_NUM in Impact MOPH BorderControl Hospital StorageFacility Donor
do
if [ $ORG_NUM == Impact ]; then
        CACERT=$CACERT_1
    else if [ $ORG_NUM == MOPH ]; then
            CACERT=$CACERT_2
        else if [ $ORG_NUM == BorderControl ]; then
                CACERT=$CACERT_3
            else if [ $ORG_NUM == Hospital ]; then
                CACERT=$CACERT_4
                else if [ $ORG_NUM == StorageFacility ]; then
                CACERT=$CACERT_5
                else
                CACERT=$CACERT_6
                fi
            fi
        fi
    fi
fi
    eval "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG_NUM.el-network.com/users/Admin@$ORG_NUM.el-network.com/msp CORE_PEER_ADDRESS=peer0.$ORG_NUM.el-network.com:7051 CORE_PEER_LOCALMSPID=${ORG_NUM}MSP CORE_PEER_TLS_ROOTCERT_FILE=$CACERT"
    echo "Installing chaincode on peer0 of $ORG_NUM of $CHANNEL_NAME..."
    # peer chaincode install -n dummycc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/dummycc
    # peer chaincode install -n donationcc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/donationcc
    # peer chaincode install -n ordercc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/ordercc
    # peer chaincode install -n supplychaincc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/supplychaincc
done

# Instantiate chaincode
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "INSTANTIATING CHAINCODE"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Impact.el-network.com/users/Admin@Impact.el-network.com/msp
CORE_PEER_ADDRESS=peer0.Impact.el-network.com:7051
CORE_PEER_LOCALMSPID=ImpactMSP
CORE_PEER_TLS_ROOTCERT_FILE=$CACERT_1
CORE_VM_DOCKER_ATTACHSTDOUT=true

# peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n dummycc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','HospitalMSP.member','StorageFacilityMSP.member','DonorMSP.member')" --tls --cafile $CACERT_ORDERER
# echo "Instanciated the dummycc chaincode"
# peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n donationcc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','HospitalMSP.member','StorageFacilityMSP.member','DonorMSP.member')" --tls --cafile $CACERT_ORDERER
# echo "Instanciated the donationcc chaincode"
# peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n ordercc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','HospitalMSP.member','StorageFacilityMSP.member','DonorMSP.member')" --tls --cafile $CACERT_ORDERER
# echo "Instanciated the ordercc chaincode"
# peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n supplychaincc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','HospitalMSP.member','StorageFacilityMSP.member','DonorMSP.member')" --tls --cafile $CACERT_ORDERER
# echo "Instanciated the supplychaincc chaincode"