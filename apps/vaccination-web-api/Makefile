
#set +x

NETWORK ?= basic
ORDERCHANNEL ?= orderchannel
DISTCONTRACTCHANNEL ?= distributionchannel

install:
	npm install

network:
	echo ${NETWORK}

users:
	NETWORK=${NETWORK} node enrollAdmins.js
	NETWORK=${NETWORK} node registerUsers.js
	
clean:
	rm -rf ./wallet

