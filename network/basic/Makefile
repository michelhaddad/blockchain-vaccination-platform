
#set +x

HLNETWORK?=el-network
# default path to be used in connection profile files
ABSPATH?=$(shell dirname $(shell dirname $(shell dirname ${PWD})))

WHICHOS := $(shell uname)

start:
	make generate ABSPATH=${ABSPATH}
	./start-platform.sh
	
destroy:
	./destroy-network.sh
	rm -rf *-e
	rm -rf ../../apps/vaccination-web-api/wallet
	rm -rf connection-profile-Donor.yaml
	rm -rf connection-profile-Impact.yaml
	rm -rf connection-profile-Hospital.yaml
	rm -rf connection-profile-MOPH.yaml
	rm -rf connection-profile-Manufacturer.yaml
	rm -rf connection-profile-StorageFacility.yaml
	rm -rf connection-profile-BorderControl.yaml

add_user:
	./add_user.sh 

rmchaincode:
	docker images | grep "supplychain" | xargs docker rmi
	docker images | grep "ordercc" | xargs docker rmi
	docker images | grep "hospitalcc" | xargs docker rmi
	docker images | grep "donationcc" | xargs docker rmi
	  
generate:
	cp docker-compose-TEMPLATE.yaml docker-compose.yaml
	sed -i -e "s/HLNETWORK/${HLNETWORK}/g" docker-compose.yaml
	cp connectionProfile-TEMPLATE.json connectionProfile.json
	sed -i -e "s/HLNETWORK/${HLNETWORK}/g" connectionProfile.json
	sed -i -e "s~ABSPATH~${ABSPATH}~g" connectionProfile.json
	for ORG in Org1 MOPH BorderControl Manufacturer Hospital StorageFacility Donor ; \
	do \
		cp connection-profile-TEMPLATE.yaml connection-profile-$${ORG}.yaml; \
		sed -i -e  "s/HLNETWORK/${HLNETWORK}/g" connection-profile-$${ORG}.yaml; \
		sed -i -e  "s/ORG/$${ORG}/g" connection-profile-$${ORG}.yaml; \
		sed -i -e  "s~ABSPATH~${ABSPATH}~g" connection-profile-$${ORG}.yaml; \
	done
ifeq ($(WHICHOS),Darwin)
	rm *-e
endif
	export ABSPATH=${ABSPATH}
