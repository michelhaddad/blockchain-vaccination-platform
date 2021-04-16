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

#Rename admin and ca private key files so their names are always the same (no need to change Hyperledger Explorer configuration after restarting the network)
for ORG in Impact MOPH BorderControl Manufacturer Hospital StorageFacility Donor
do
	mv ./crypto-config/peerOrganizations/$ORG.el-network.com/users/Admin@$ORG.el-network.com/msp/keystore/*_sk ./crypto-config/peerOrganizations/$ORG.el-network.com/users/Admin@$ORG.el-network.com/msp/keystore/adminKey$ORG
  mv ./crypto-config/peerOrganizations/$ORG.el-network.com/ca/*_sk ./crypto-config/peerOrganizations/$ORG.el-network.com/ca/key.pem
done
mv ./crypto-config/ordererOrganizations/el-network.com/users/Admin@el-network.com/msp/keystore/*_sk ./crypto-config/ordererOrganizations/el-network.com/users/Admin@el-network.com/msp/keystore/ordererAdminKey
mv ./crypto-config/ordererOrganizations/el-network.com/ca/*_sk ./crypto-config/ordererOrganizations/el-network.com/ca/key.pem

#Generate configuration txs for contract channel
mkdir channel-artifacts-contractchannel
${CONFIGTXGEN} -profile OrdererGenesis -outputBlock ./channel-artifacts-contractchannel/genesis.block

export CHANNEL_NAME=contractchannel
${CONFIGTXGEN} -profile ContractChannel -outputCreateChannelTx ./channel-artifacts-contractchannel/channel.tx -channelID $CHANNEL_NAME

${CONFIGTXGEN} -profile ContractChannel -outputAnchorPeersUpdate ./channel-artifacts-contractchannel/ImpactMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ImpactMSP
${CONFIGTXGEN} -profile ContractChannel -outputAnchorPeersUpdate ./channel-artifacts-contractchannel/MOPHMSPanchors.tx -channelID $CHANNEL_NAME -asOrg MOPHMSP
${CONFIGTXGEN} -profile ContractChannel -outputAnchorPeersUpdate ./channel-artifacts-contractchannel/BorderControlMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BorderControlMSP
${CONFIGTXGEN} -profile ContractChannel -outputAnchorPeersUpdate ./channel-artifacts-contractchannel/ManufacturerMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ManufacturerMSP
${CONFIGTXGEN} -profile ContractChannel -outputAnchorPeersUpdate ./channel-artifacts-contractchannel/DonorMSPanchors.tx -channelID $CHANNEL_NAME -asOrg DonorMSP

#Generate configuration txs for distribution channel
mkdir channel-artifacts-distributionchannel
${CONFIGTXGEN} -profile OrdererGenesis -outputBlock ./channel-artifacts-distributionchannel/genesis.block

export CHANNEL_NAME=distributionchannel
${CONFIGTXGEN} -profile DistributionChannel -outputCreateChannelTx ./channel-artifacts-distributionchannel/channel.tx -channelID $CHANNEL_NAME

${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/ImpactMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ImpactMSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/MOPHMSPanchors.tx -channelID $CHANNEL_NAME -asOrg MOPHMSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/BorderControlMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BorderControlMSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/HospitalMSPanchors.tx -channelID $CHANNEL_NAME -asOrg HospitalMSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/StorageFacilityMSPanchors.tx -channelID $CHANNEL_NAME -asOrg StorageFacilityMSP
${CONFIGTXGEN} -profile DistributionChannel -outputAnchorPeersUpdate ./channel-artifacts-distributionchannel/DonorMSPanchors.tx -channelID $CHANNEL_NAME -asOrg DonorMSP

