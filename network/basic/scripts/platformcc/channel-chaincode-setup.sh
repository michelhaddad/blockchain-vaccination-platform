#!/bin/bash

export CHANNEL_NAME=mychannel

#Create channel
export CACERT_ORDERER=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/el-network.com/orderers/orderer.el-network.com/tls/ca.crt
export CACERT_1=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Impact.el-network.com/peers/peer0.Impact.el-network.com/tls/ca.crt
export CACERT_2=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MOPH.el-network.com/peers/peer0.MOPH.el-network.com/tls/ca.crt
export CACERT_3=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/BorderControl.el-network.com/peers/peer0.BorderControl.el-network.com/tls/ca.crt
export CACERT_4=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Manufacturer.el-network.com/peers/peer0.Manufacturer.el-network.com/tls/ca.crt
peer channel create -o orderer.el-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile $CACERT_ORDERER

#Connect peers to channel
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "CONNECTING PEERS TO CHANNEL"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
for ORG_NUM in Impact MOPH BorderControl Manufacturer
do
if [ $ORG_NUM == Impact ]; then
        CACERT=$CACERT_1
    else if [ $ORG_NUM == MOPH ]; then
            CACERT=$CACERT_2
        else if [ $ORG_NUM == BorderControl ]; then
                CACERT=$CACERT_3
            else
                CACERT=$CACERT_4
        fi
    fi
fi
    eval "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG_NUM.el-network.com/users/Admin@$ORG_NUM.el-network.com/msp CORE_PEER_ADDRESS=peer0.$ORG_NUM.el-network.com:7051 CORE_PEER_LOCALMSPID=${ORG_NUM}MSP CORE_PEER_TLS_ROOTCERT_FILE=$CACERT"

    echo "Connecting peer0 of $ORG_NUM to channel..."
    peer channel join -b mychannel.block
done

#Update channel
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "UPDATING CHANNEL"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
for ORG_NUM in Impact MOPH BorderControl Manufacturer
do
if [ $ORG_NUM == Impact ]; then
        CACERT=$CACERT_1
    else if [ $ORG_NUM == MOPH ]; then
            CACERT=$CACERT_2
        else if [ $ORG_NUM == BorderControl ]; then
                CACERT=$CACERT_3
            else
                CACERT=$CACERT_4
        fi
    fi
fi
    eval "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG_NUM.el-network.com/users/Admin@$ORG_NUM.el-network.com/msp CORE_PEER_ADDRESS=peer0.$ORG_NUM.el-network.com:7051 CORE_PEER_LOCALMSPID=${ORG_NUM}MSP CORE_PEER_TLS_ROOTCERT_FILE=$CACERT"
    echo "Updating channel..."
    peer channel update -o orderer.el-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/${ORG_NUM}MSPanchors.tx --tls --cafile $CACERT_ORDERER
done

#Install chaincode
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "INSTALLING CHAINCODE"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
for ORG_NUM in Impact MOPH BorderControl Manufacturer
do
if [ $ORG_NUM == Impact ]; then
        CACERT=$CACERT_1
    else if [ $ORG_NUM == MOPH ]; then
            CACERT=$CACERT_2
        else if [ $ORG_NUM == BorderControl ]; then
                CACERT=$CACERT_3
            else
                CACERT=$CACERT_4
        fi
    fi
fi
    eval "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG_NUM.el-network.com/users/Admin@$ORG_NUM.el-network.com/msp CORE_PEER_ADDRESS=peer0.$ORG_NUM.el-network.com:7051 CORE_PEER_LOCALMSPID=${ORG_NUM}MSP CORE_PEER_TLS_ROOTCERT_FILE=$CACERT"
    echo "Installing chaincode on peer0 of $ORG_NUM..."
    peer chaincode install -n dummycc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/dummycc
    peer chaincode install -n donationcc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/donationcc
    peer chaincode install -n ordercc -v 5.5 -l node -p /opt/gopath/src/github.com/chaincode/ordercc
done

# Instantiate chaincode
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Impact.el-network.com/users/Admin@Impact.el-network.com/msp
CORE_PEER_ADDRESS=peer0.Impact.el-network.com:7051
CORE_PEER_LOCALMSPID=ImpactMSP
CORE_PEER_TLS_ROOTCERT_FILE=$CACERT_1

peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n dummycc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','ManufacturerMSP.member')" --tls --cafile $CACERT_ORDERER
echo "Instanciated the dummycc chaincode"
peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n donationcc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','ManufacturerMSP.member')" --tls --cafile $CACERT_ORDERER
echo "Instanciated the donationcc chaincode"
peer chaincode instantiate -o orderer.el-network.com:7050 -C $CHANNEL_NAME -n ordercc -l node -v 5.5 -c '{"Args":[]}' -P "OR ('ImpactMSP.member','MOPHMSP.member','BorderControlMSP.member','ManufacturerMSP.member')" --tls --cafile $CACERT_ORDERER
echo "Instanciated the ordercc chaincode"