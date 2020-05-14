'use strict';

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('Database is Connected!'), (err) => {
        console.log(err)
        console.log('Can\'t connect to the Database');
    });