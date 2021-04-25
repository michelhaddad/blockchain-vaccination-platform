#!/bin/bash

export GOPATH=$HOME/go
export GOBIN=$GOPATH/bin
export PATH=$PATH:$GOBIN
export FABRIC_CFG_PATH=$PWD

CRYPTOGEN=../cryptogen
CONFIGTXGEN=../configtxgen

WHICHOS=`uname -a`;
OSTYPE="Linux"
echo $WHICHOS
if [[  "${WHICHOS}" == *"Darwin"* ]]; then
  OSTYPE="Darwin"
fi

if [[ ${OSTYPE} == "Darwin" ]]; then
  CRYPTOGEN=../cryptogen_mac
  CONFIGTXGEN=../configtxgen_mac
fi


echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo "GENERATING ARTIFACTS"
echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

#Generate crypto material using crypto-config.yaml as config file
${CRYPTOGEN} generate --config=./crypto-config.yaml

mv ./crypto-config/peerOrganizations/org1.el-network.com/users/Admin@org1.el-network.com/msp/keystore/*_sk ./crypto-config/peerOrganizations/org1.el-network.com/users/Admin@org1.el-network.com/msp/keystore/adminKey1
mv ./crypto-config/peerOrganizations/org1.el-network.com/ca/*_sk ./crypto-config/peerOrganizations/org1.el-network.com/ca/key.pem

#Rename admin and ca private key files so their names are always the same (no need to change Hyperledger Explorer configuration after restarting the network)
for ORG in MOPH BorderControl Manufacturer Hospital StorageFacility Donor
do
	mv ./crypto-config/peerOrganizations/$ORG.el-network.com/users/Admin@$ORG.el-network.com/msp/keystore/*_sk ./crypto-config/peerOrganizations/$ORG.el-network.com/users/Admin@$ORG.el-network.com/msp/keystore/adminKey$ORG
  mv ./crypto-config/peerOrganizations/$ORG.el-network.com/ca/*_sk ./crypto-config/peerOrganizations/$ORG.el-network.com/ca/key.pem
done
mv ./crypto-config/ordererOrganizations/el-network.com/users/Admin@el-network.com/msp/keystore/*_sk ./crypto-config/ordererOrganizations/el-network.com/users/Admin@el-network.com/msp/keystore/ordererAdminKey
mv ./crypto-config/ordererOrganizations/el-network.com/ca/*_sk ./crypto-config/ordererOrganizations/el-network.com/ca/key.pem

#Generate configuration txs for contract channel
mkdir channel-artifacts-orderchannel
${CONFIGTXGEN} -profile OrdererGenesis -outputBlock ./channel-artifacts-orderchannel/genesis.block

export CHANNEL_NAME=orderchannel
${CONFIGTXGEN} -profile Orderchannel -outputCreateChannelTx ./channel-artifacts-orderchannel/channel.tx -channelID $CHANNEL_NAME

${CONFIGTXGEN} -profile Orderchannel -outputAnchorPeersUpdate ./channel-artifacts-orderchannel/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
${CONFIGTXGEN} -profile Orderchannel -outputAnchorPeersUpdate ./channel-artifacts-orderchannel/MOPHMSPanchors.tx -channelID $CHANNEL_NAME -asOrg MOPHMSP
${CONFIGTXGEN} -profile Orderchannel -outputAnchorPeersUpdate ./channel-artifacts-orderchannel/BorderControlMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BorderControlMSP
${CONFIGTXGEN} -profile Orderchannel -outputAnchorPeersUpdate ./channel-artifacts-orderchannel/ManufacturerMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ManufacturerMSP
${CONFIGTXGEN} -profile Orderchannel -outputAnchorPeersUpdate ./channel-artifacts-orderchannel/DonorMSPanchors.tx -channelID $CHANNEL_NAME -asOrg DonorMSP

#Generate configuration txs for distribution channel
mkdir channel-artifacts-distributionchannel
${CONFIGTXGEN} -profile OrdererGenesis -outputBlock ./channel-artifacts-distributionchannel/genesis.block

export CHANNEL_NAME=distributionchannel
${CONFIGTXGEN} -profile DistributionChannel -outputCreateChannelTx ./channel-artifacts-distributionchannel/channel.tx -channelID $CHANNEL_NAME

${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/MOPHMSPanchors.tx -channelID $CHANNEL_NAME -asOrg MOPHMSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/BorderControlMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BorderControlMSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/HospitalMSPanchors.tx -channelID $CHANNEL_NAME -asOrg HospitalMSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/StorageFacilityMSPanchors.tx -channelID $CHANNEL_NAME -asOrg StorageFacilityMSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/DonorMSPanchors.tx -channelID $CHANNEL_NAME -asOrg DonorMSP

