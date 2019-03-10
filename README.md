# HDip in Computer Science - WIT, Enterprise Web Development - Assignment 1

## A web-based point of interest javascript app to explore islands of Ireland

### Comments:

Tag v1 - initial release

### Installation:

- Download [node](https://nodejs.org/en/download/) and npm packages
- Get Google API Key [Guide](https://developers.google.com/maps/documentation/javascript/get-api-key#get-an-api-key)
- Create `.env` file in root project directory and add the following properties
```
cookie_password = required32charactersforpassword!
cookie_name = poi-user
db = <your mongo db connection>
google_api_key = <your googla api key>
```
- Execute `npm install` to download the following dependencies
```
"dependencies": {
    "boom": "^7.3.0",
    "dotenv": "^6.2.0",
    "fs": "0.0.1-security",
    "handlebars": "^4.1.0",
    "hapi": "^18.0.0",
    "hapi-auth-cookie": "^9.1.0",
    "inert": "^5.1.2",
    "joi": "^14.3.1",
    "mais-mongoose-seeder": "^1.0.7",
    "mongoose": "^5.4.7",
    "util": "^0.11.1",
    "uuid": "^3.3.2",
    "vision": "^5.4.4"
  }
```
- Execute `node index` to start the app