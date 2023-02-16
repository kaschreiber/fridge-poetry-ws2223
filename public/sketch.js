/***********************************************************
 * js
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
 * The following example uses global variables,
 * which should be avoided for any semi-professional website!
 * I chose to go with global mode in this example as the code
 * is less cluttered and easier to read. Also, if you are a
 * beginner, working in global mode is just fine.
 *********************************************************/

"use strict";

// As described in the Note above, we are working
// in global mode with global variables. This should be
// avoided in a professional context!

// TODO 5
let socket = io();
let fridge  = new Fridge();


function setup()
{

    fridge.init();


    // TODO 9
    // Receive signal from server that
    // a magnet moved
    socket.on('serverBroadcastMagnetMove', (data) =>
    {
        console.log('I received:', data);

        // Set the position of the magnet
        fridge.magnets[data.index].x = data.x;
        fridge.magnets[data.index].y = data.y;
    });

    // TODO 15
    socket.on('serverAsksForMagnetData', () =>
    {
        console.log('Sending all magnet data');
        for (let i = 0; i < fridge.magnets.length; i++)
        {
            let data =
                {
                    index: fridge.magnets[i].index,
                    x: fridge.magnets[i].x,
                    y: fridge.magnets[i].y
                }
            // Make use of the already existing pipe
            socket.emit('clientMagnetMove', data);
        }
    });

    // TODO 18
    socket.on('serverSendsDbData', (data) =>
    {
        for (let i = 0; i < data.length; i++)
        {
            // We can't be sure that data array from the
            // database has the same order as the magnets
            // array. We need to identify each element
            // by its index.
            let index = fridge.magnets.findIndex(obj => obj.index === data[i].index);

            fridge.magnets[index].index = data[i].index;
            fridge.magnets[index].x = data[i].x;
            fridge.magnets[index].y = data[i].y;
        }
    });

    // TODO 12
    socket.emit('clientSetupReady');

}


function loadStringsFromFile(filePath, callback)
{
    let client = new XMLHttpRequest();
    client.open('GET', filePath);
    client.onloadend = function() {

        fridge.words = client.responseText.split(/[\r\n]+/);

        callback();
    }
    client.send();
}

loadStringsFromFile("./data/text/wordkit_happiness.txt", setup);
