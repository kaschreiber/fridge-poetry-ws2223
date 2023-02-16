/***********************************************************
 * Fridge.js
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

"use strict";

// Class which holds
// all magnet objects
class Fridge
{
    constructor()
    {
        this.canvasW = 0;
        this.canvasH = 0;
        this.magnets = [];
        this.words = [];
        this.domElement;
        // We save the last mouse position here
        // This is because we can only get the mouse position from events like "mousemove"
        // But we always want to send it to the magnets in case we are dragging them
        // So we always send the position, but check within each magnet if we need to update it to it
        this.mouseX = 0;
        this.mouseY = 0;
    }

    init()
    {
        let container = document.createElement('div');
        container.classList.add("fridge");
        document.body.appendChild(container);
        this.domElement = container;
        // Load the magnets
        for (let i = 0; i < this.words.length; i++) 
        {
            // Passing the word 
            // and the array index to use as id
            this.magnets.push(new Magnet(this.words[i], i, container));
        }
        document.addEventListener("mousemove", (event) => {this.mouseX = event.clientX; this.mouseY = event.clientY;})
        this.update(this);
    }

    update(fridge)
    {
        for (let i = 0; i < fridge.magnets.length; i++) 
        {
            fridge.magnets[i].update(fridge.mouseX, fridge.mouseY);
        }
        window.requestAnimationFrame(() => fridge.update(fridge));
    }
}


