var express = require('express');
var router = express.Router();

const db = require('../database.js');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const { check, validationResult } = require('express-validator');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'stocks';

router.post(
    '/',
    [check('email').isEmail(), check('password').isLength({ min: 8 })],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            if (err) {
                return res.status(422).send(err);
            } else {
                db.run(
                    'INSERT INTO users (firstname, lastname, email, password, birthdate) VALUES (?, ?, ?, ?, ?)',
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    hash,
                    req.body.birthdate,
                    err => {
                        if (err) {
                            return res
                                .status(422)
                                .send('Error in registration');
                        }
                        res.status(201).send('Successfully registered');
                        // returnera korrekt svar
                    }
                );
                MongoClient.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
                    .then(client => {
                        const db = client.db(dbName);

                        db.collection('userStocks').insertOne({
                            userEmail: req.body.email,
                            balance: 500,
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
                    })
                    .catch(err => {
                        return res.status(422).json(err);
                    });
            }
        });
    }
);

module.exports = router;
