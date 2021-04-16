export const networkConfig = 
{
    "channel": {
        "channelName": "mychannel",
        "contract": "dummycc"
    },
    "organizations": {
        "Impact": {
            "MSP": "ImpactMSP"
        },
        "MOPH": {
            "MSP": "MOPHMSP"
        },
        "BorderControl": {
            "MSP": "BorderControlMSP"
        },
        "Manufacturer": {
            "MSP": "ManufacturerMSP"
        }
    },
    "users": [
        {
            "name": "user1",
            "organization": "Impact"
        },
        {
            "name": "user2",
            "organization": "MOPH"
        },
        {
            "name": "user3",
            "organization": "BorderControl"
        },
        {
            "name": "user4",
            "organization": "Manufacturer"
        }
    ],
    "transactions": [
        {
            "user": "user1",
            "txFunction": "setValue",
            "key": "Key1"
        },
        {
            "user": "user2",
            "txFunction": "setValue",
            "key": "Key2",
            "previousKey": "Key1"
        },
        {
            "user": "user3",
            "txFunction": "setValue",
            "key": "Key3",
            "previousKey": "Key2"
        },
        {
            "user": "user4",
            "txFunction": "setValue",
            "key": "Key4"
        },
        {
            "user": "user1",
            "txFunction": "setValue",
            "key": "Key2"
        },
        {
            "user": "user1",
            "txFunction": "setValue",
            "key": "Key3"
        },
        {
            "user": "user2",
            "txFunction": "setValue",
            "key": "Key2"
        },
        {
            "user": "user3",
            "txFunction": "setValue",
            "key": "Key2"
        },
        {
            "user": "user4",
            "txFunction": "setValue",
            "key": "Key4"
        },
        {
            "user": "user2",
            "txFunction": "setValue",
            "key": "Key4"
        }
    ]
}
