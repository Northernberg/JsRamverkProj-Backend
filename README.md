[![Code Coverage](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/?branch=master)

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/?branch=master)

[![Build Status](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Northernberg/JsRamverkProj-Backend/build-status/master)

[![Build Status](https://travis-ci.org/Northernberg/Jsramverk-back.svg?branch=master)](https://travis-ci.org/Northernberg/Jsramverk-back)

# Setup

```
git clone https://github.com/Northernberg/JsRamverkProj-Backend.git
npm install
```
## Install MongoDb
MongoDb is required, please install according to your OS and start MongoDb service at default 'mongodb://localhost:27017'

[Official MongoDb instructions](https://docs.mongodb.com/manual/installation/)

Then populate the database with products and defined test user
```
node db/setup.js
```

## Setup SQLite
Setup SQLite db file and migrate with table


Stand in project folder
```
cat db/migrate.sql | sqlite3 db/users.sqlite
```
# Start application

`node app.js`

# Tools

### MongoDb

Used for storage of user inventory and current market of stocks. Chose this technique to learn more about NoSQL and find out its pros and cons. It is also very versatile to insert new products without having to follow the same structure.

### SQLite

Used for user information such as login and contact details. This technique was used so I woulden't have to create new functionality for login and register.

### JWT

Used to authenticate requests to the API. This is used because of its simple implementenation and JSON structure to recognize authenticated users.

# Websocket

Used socket.IO for the websocket that recieve updates on prices when a user is buying or selling stocks. This is then emitted to all connected clients and gives the user a live experience of price change. I used socket.io as it was simple to use.

# Unit testing

I used the npm packages Mocha to create the test suites and Chai to mock requests to the API. In the tests I got around 50% coverage, according to Scrutinizer CI although that includes lines such as MongoDb connecting. In my local tests I get 60-70% coverage which is more reasonable. Although, it might show that my code is not that perfect in the backend which I agree. I made the tests to see how far I could go with some simple status checking in each requests. Some of my requests did not deal with errors that well, as it resulted in a 200 instead of 400 code.
