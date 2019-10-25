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
                name: 'Ärtsoppa',
                img: 'artsoppa.jpg',
                price: 99,
                qty: 100,
                rate: 1,
            },
            {
                name: 'Punsch',
                price: 40,
                img: 'punsch.jpg',
                qty: 100,
                rate: 1,
            },
            {
                name: 'Ärtsoppakorv',
                price: 30,
                img: 'artsoppakorv.jpg',
                qty: 100,
                rate: 1,
            },
            {
                name: 'Gulaschsoppa',
                price: 50,
                img: 'gulaschsoppa.jpg',
                qty: 100,
                rate: 1,
            },
            {
                name: 'Köttsoppa',
                price: 60,
                img: 'kottsoppa.jpg',
                qty: 100,
                rate: 1,
            },
            {
                name: 'Pannkaka',
                price: 15,
                img: 'pannkaka.jpg',
                qty: 100,
                rate: 1,
            },
            {
                name: 'Tomatsoppa',
                price: 35,
                img: 'tomatsoppa.jpg',
                qty: 100,
                rate: 1,
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
            history: [],
            stocks: [
                {
                    name: 'Ärtsoppa',
                    img: 'artsoppa.jpg',
                    qty: 0,
                },
                {
                    name: 'Punsch',
                    img: 'punsch.jpg',
                    qty: 0,
                },
                {
                    name: 'Ärtsoppakorv',
                    img: 'artsoppakorv.jpg',
                    qty: 0,
                },
                {
                    name: 'Gulaschsoppa',
                    img: 'gulaschsoppa.jpg',
                    qty: 0,
                },
                {
                    name: 'Köttsoppa',
                    img: 'kottsoppa.jpg',
                    qty: 0,
                },
                {
                    name: 'Pannkaka',
                    img: 'pannkaka.jpg',
                    qty: 0,
                },
                {
                    name: 'Tomatsoppa',
                    img: 'tomatsoppa.jpg',
                    qty: 0,
                },
            ],
        });
        client.close();
    }
);
