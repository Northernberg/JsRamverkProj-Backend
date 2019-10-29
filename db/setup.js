const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'stocks';

MongoClient.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, client) => {
        const db = client.db(dbName);

        db.collection('objects').drop();

        db.collection('objects').insertMany([
            {
                name: 'Peasoup',
                img: 'peasoup.jpg',
                price: 99,
                qty: 100,
                rate: 1,
                history: [],
            },
            {
                name: 'Punsch',
                price: 40,
                img: 'punsch.jpg',
                qty: 100,
                rate: 1,
                history: [],
            },
            {
                name: 'Peasoupkorv',
                price: 30,
                img: 'peasoupkorv.jpg',
                qty: 100,
                rate: 1,
                history: [],
            },
            {
                name: 'Gulaschsoup',
                price: 50,
                img: 'gulaschsoup.jpg',
                qty: 100,
                rate: 1,
                history: [],
            },
            {
                name: 'Meatsoup',
                price: 60,
                img: 'meatsoup.jpg',
                qty: 100,
                rate: 1,
                history: [],
            },
            {
                name: 'Pancake',
                price: 15,
                img: 'pancake.jpg',
                qty: 100,
                rate: 1,
                history: [],
            },
            {
                name: 'Tomatsoup',
                price: 35,
                img: 'tomatsoup.jpg',
                qty: 100,
                rate: 1,
                history: [],
            },
        ]);
        client.close();
    }
);

MongoClient.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, client) => {
        const db = client.db(dbName);

        db.collection('userStocks').drop();
        db.collection('userStocks').insertOne({
            _id: '5da80c9516e1ee3890169aa8',
            userEmail: 'test@test.com',
            balance: 0,
            stocks: [
                {
                    name: 'Peasoup',
                    img: 'peasoup.jpg',
                    qty: 0,
                },
                {
                    name: 'Punsch',
                    img: 'punsch.jpg',
                    qty: 0,
                },
                {
                    name: 'Peasoupkorv',
                    img: 'peasoupkorv.jpg',
                    qty: 0,
                },
                {
                    name: 'Gulaschsoup',
                    img: 'gulaschsoup.jpg',
                    qty: 0,
                },
                {
                    name: 'Meatsoup',
                    img: 'meatsoup.jpg',
                    qty: 0,
                },
                {
                    name: 'Pancake',
                    img: 'pancake.jpg',
                    qty: 0,
                },
                {
                    name: 'Tomatsoup',
                    img: 'tomatsoup.jpg',
                    qty: 0,
                },
            ],
        });
        client.close();
    }
);
