/***********************************************************
 * app.js
 *
 * Author: Lena Gieseke
 *
 * Date: December 2018
 * Update: January 2021
 *
 * Purpose: Browser-based representation
 *          of word magnets on a fridge.
 *
 * Usage:
 *
 * Notes: SOLUTION
 *
 *********************************************************/


// TODO 1
const express = require('express');

// TODO 3a
const socketio = require('socket.io');

// TODO 10a

// DATABASE ////////////////////////////////////////
const mongoose = require('mongoose');

// SUBSTITUTE THIS STRING WITH YOUR CONNECTION STRING
// SUBSTITUTE <password> WITH YOUR PASSWORD
const DB_URL = 'mongodb+srv://admin:DRYZ9BhjtnrNx@fridgecluster.o7yedjz.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connection established to', DB_URL))
    .catch(err => console.error('Unable to connect to the mongoDB server. Error:', err.message));

// TODO 10b

// TODO 11

let MagnetSchema = new mongoose.Schema(
    {
        index: Number,
        x: Number,
        y: Number,
    });

let Magnet = mongoose.model('magnet', MagnetSchema);

// APPLICATION ////////////////////////////////////////

// TODO 2
const port = process.env.PORT || 3000;

const app = express();

const server = app
    .use(express.static('public'))
    .listen(port, () => console.log(`Listening on ${port}`));

// TODO 3b
// Creating a new communication pipe
// based on the given express server and port
const io = socketio(server);

// Adds a callback function ("listener")
// for the event "connection", which
// the express server emits.
// "on" stands for "addEventListener"
io.on('connection', socket =>
{
    console.log('New client connected');

    // TODO 13
    socket.on('clientSetupReady', () =>
    {
        console.log('Client ready');

        Magnet.find()
            .then(docs =>
            {
                if(docs.length === 0)
                {
                    // TODO 14
                    console.log('Init Database');
                    socket.emit('serverAsksForMagnetData');
                }
                else
                {
                    // TODO 17
                    console.log('Init Client');
                    socket.emit('serverSendsDbData', docs);
                }
            })
            .catch(err => console.error(err));
    });

    // TODO 7
    // Receive moving signal from a client
    socket.on('clientMagnetMove', (data) =>
    {
        console.log('Moved:', data);

        // TODO 8
        // Send the movement data to all
        // other clients
        socket.broadcast.emit('serverBroadcastMagnetMove', data);

        // TODO 16
        Magnet.findOne({index:Number(data.index)})
            .then(docs =>
            {
                if(docs !== null) // update
                {
                    docs.x = data.x;
                    docs.y = data.y;
                    docs.save();
                }
                else // initialize
                {
                    let tmpMagnet = new Magnet(data);
                    tmpMagnet.save()
                        // .then(doc => console.log('New element saved', doc))
                        .catch(err => console.error(err))
                }
            })
            .catch(err => console.error(err));

    });
});
