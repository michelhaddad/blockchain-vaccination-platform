
#set +x

HLNETWORK?=el-network
ORG_NUMBER?=1
NETWORK?=basic
PEER_NUMBER?=0
ABSPATH=/go/src/github.com

WHICHOS := $(shell uname)

start:
	make generate
	docker-compose up -d
	
destroy:
	docker-compose down
	rm -rf *-e
	rm -rf ./docker-compose*.yaml ./connection-profile*.yaml

generate:
	cp templates/docker-compose-TEMPLATE.yaml docker-compose.yaml
	sed -i -e "s/CONFIG_NETWORK_NAME/${HLNETWORK}/g" docker-compose.yaml
	sed -i -e "s/CONFIG_ORG_NUM/${ORG_NUMBER}/g" docker-compose.yaml
	sed -i -e "s/CONFIG_PEER_NUM/${PEER_NUMBER}/g" docker-compose.yaml

	cp templates/network/${NETWORK}/connection-profile-TEMPLATE.yaml connection-profile-impact.yaml
	sed -i -e  "s/HLNETWORK/${HLNETWORK}/g" connection-profile-impact.yaml
	sed -i -e  "s/ORG/impact/g" connection-profile-impact.yaml
	sed -i -e  "s~ABSPATH~${ABSPATH}~g" connection-profile-impact.yaml

	for ORG in MOPH BorderControl Manufacturer Hospital StorageFacility Donor ; \
	do \
		cp templates/network/${NETWORK}/connection-profile-TEMPLATE.yaml connection-profile-$${ORG}.yaml; \
		sed -i -e  "s/HLNETWORK/${HLNETWORK}/g" connection-profile-$${ORG}.yaml; \
		sed -i -e  "s/ORG/$${ORG}/g" connection-profile-$${ORG}.yaml; \
		sed -i -e  "s~ABSPATH~${ABSPATH}~g" connection-profile-$${ORG}.yaml; \
	done
ifeq ($(WHICHOS),Darwin)
	rm *-e
endif
