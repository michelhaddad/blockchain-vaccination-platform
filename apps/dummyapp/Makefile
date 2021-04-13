
#set +x

NETWORK ?= basic
CHANNEL ?= contractchannel

install:
	npm install

network:
	echo ${NETWORK}

users:
	NETWORK=${NETWORK} node enrollAdmins.js
	NETWORK=${NETWORK} node registerUsers.js

invoke:
	NETWORK=${NETWORK} CHANNEL=${CHANNEL} node invoke.js

query:
	NETWORK=${NETWORK} CHANNEL=${CHANNEL} node query.js ${KEY}

query-all:
	NETWORK=${NETWORK} node queryAll.js

issue:
	NETWORK=${NETWORK} CHANNEL=${CHANNEL} node issue.js
redeem:
	NETWORK=${NETWORK} CHANNEL=${CHANNEL} node redeem.js

supplychain:
	NETWORK=${NETWORK} CHANNEL=${CHANNEL} node supplychain.js
clean:
	rm -rf ./wallet

