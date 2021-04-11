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

#Generate configuration txs
mkdir channel-artifacts
${CONFIGTXGEN} -profile FourOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
export CHANNEL_NAME=mychannel
${CONFIGTXGEN} -profile FourOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

${CONFIGTXGEN} -profile FourOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/ImpactMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ImpactMSP
${CONFIGTXGEN} -profile FourOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/MOPHMSPanchors.tx -channelID $CHANNEL_NAME -asOrg MOPHMSP
${CONFIGTXGEN} -profile FourOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/BorderControlMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BorderControlMSP
${CONFIGTXGEN} -profile FourOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/ManufacturerMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ManufacturerMSP
