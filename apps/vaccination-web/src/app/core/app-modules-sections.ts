export const userAuthModules = {
  "allModules": [
    {
      "moduleName": "Dashboard",
      "pages": [
        {
          "link": "/dashboard"
        }
      ]
    }],
  "allSidenavSection": [
    {
      "mainSection": {
        "title": "Dashboard",
        "link": "/dashboard"
      },
      "hasSubSections": false,
      "order": 0,
      "icon": "dashboard",
      "alwaysVisible": true
    },
    {
      "mainSection": {
        "title": "Network Configuration"
      },
      "hasSubSections": true,
      "order": 1,
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
      "alwaysVisible": false
    },
    {
      "mainSection": {
        "title": "Donations",
        "link": "/donations"
      },
      "hasSubSections": false,
      "order": 2,
      "icon": "money",
      "alwaysVisible": false
    },
    {
      "mainSection": {
        "title": "Distribution Planning",
        "link": "/planning"
      },
      "hasSubSections": false,
      "order": 3,
      "icon": "timeline",
      "alwaysVisible": false
    },
  ]
};
