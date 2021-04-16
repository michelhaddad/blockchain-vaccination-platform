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
          "link": "/networkconfiguration/channels"
        },
        {
          "title": "Organizations",
          "link": "/networkconfiguration/organizations"
        }
      ],
      "organizations": [4]
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
        "title": "Distribution Plans",
        "link": "/planning"
      },
      "hasSubSections": false,
      "icon": "timeline",
      "organizations": [1,2,3,5]
    }
  ]
};
