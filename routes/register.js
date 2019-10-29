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
                        MongoClient.connect(url, {
                            useNewUrlParser: true,
                            useUnifiedTopology: true,
                        })
                            .then(async client => {
                                const db = client.db(dbName);
                                let currObjects;

                                await db
                                    .collection('objects')
                                    .find({})
                                    .project({
                                        name: 1,
                                        img: 1,
                                        price: 1,
                                    })
                                    .toArray()
                                    .then(result => {
                                        result.forEach(s => {
                                            s.qty = 0;
                                        });
                                        currObjects = result;
                                    })
                                    .catch(err => {
                                        return res.status(422).json(err);
                                    });

                                await db.collection('userStocks').insertOne({
                                    userEmail: req.body.email,
                                    balance: 500,
                                    stocks: currObjects,
                                });
                                client.close();
                                res.status(201).send('Successfully registered');
                            })
                            .catch(err => {
                                return res.status(422).json(err);
                            });
                        // returnera korrekt svar
                    }
                );
            }
        });
    }
);

module.exports = router;
