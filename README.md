[![Code Coverage](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/?branch=master)

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/?branch=master)

[![Build Status](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/build-status/master)

# Setup

```
git clone https://github.com/Northernberg/JsRamverkProj-Backend.git
npm install
```

# Start application

`Node app.js`

# Tools

### MongoDb

Used for storage of user inventory and current market of stocks. Chose this technique to learn more about NoSQL and find out its pros and cons. It is also very versatile to insert new products without having to follow the same structure.

### SQLite

Used for user information such as login and contact details. This technique was used so I woulden't have to create new functionality for login and register.

### JWT

Used to authenticate requests to the API. This is used because of its simple implementenation and JSON structure to recognize authenticated users.
