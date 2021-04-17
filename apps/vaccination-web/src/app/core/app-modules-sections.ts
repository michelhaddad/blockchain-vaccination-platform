export const userAuthModules = {
  "allSidenavSection": [
    {
      "mainSection": {
        "title": "Dashboard",
        "link": "/dashboard"
      },
      "hasSubSections": false,
      "icon": "dashboard",
      "organizations": [1,2,3,4,5,6]
    },
    {
      "mainSection": {
        "title": "Network Configuration"
      },
      "hasSubSections": true,
      "icon": "settings",
      "subSections": [
        {
          "title": "Channels",
          "link": "/networkconfiguration/channels",
          "organizations": [4]
        },
        {
          "title": "Organizations",
          "link": "/networkconfiguration/organizations",
          "organizations": [4]
        }
      ],
    },
    {
      "mainSection": {
        "title": "Donations",
        "link": "/donations"
      },
      "hasSubSections": false,
      "icon": "money",
      "organizations": [3,6]
    },
    {
      "mainSection": {
        "title": "Orders"
      },
      "hasSubSections": true,
      "icon": "timeline",
      "subSections": [
        {
          "title": "Orders",
          "link": "/orders",
          "organizations": [3,7,2]
        },
        {
          "title": "Distribution Schedule",
          "link": "/orders/planning",
          "organizations": [1,2,3,5],
        }
      ],

    },
  ]
};
