/***********************************************************
 * Magnet.js
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

class Magnet
{
    constructor(t, i, parent)
    {
        this.text = t;
        this.index = i;

        // x,y define the top left
        // of the magnet
        this.x = 0;
        this.y = 0;

        this.dragged = false;

        this.w = 0;
        this.h = 0;

        this.DOMNode = this.createDOMMagnet(t, parent);
        this.setSize();
        this.setPosition(Math.random(), Math.random());
    }

    setPosition(newX, newY)
    {
        // Get container position and width in pixel
        let fridge = this.DOMNode.parentElement;
        let containerWidth = fridge.clientWidth;
        let containerHeight = fridge.clientHeight;
        // Check if Magnet (the DOM element with padding, border, etc.)
        // is in bounds of the board.
        // If not, we are going to put it at the minimum position from the border
        if(newX * containerWidth > containerWidth - this.w){
            newX = (containerWidth - this.w) / containerWidth;
        }
        if(newY * containerHeight > containerHeight - this.h){
            newY = (containerHeight - this.h) / containerHeight;
        }
        this.x = newX;
        this.y = newY;
        this.DOMNode.style.left = this.x * 100 + "%";
        this.DOMNode.style.top = this.y * 100 + "%";
    }

    setSize(){
        this.w = this.DOMNode.offsetWidth;
        this.h = this.DOMNode.offsetHeight;
    }

    createDOMMagnet(text, parent)
    {
        let element = document.createElement("div");
        element.classList.add("magnet");
        window.addEventListener("mouseup", () => this.stopDragging(this));
        // This could seem strange: We are checking ON the element if the mouse is pressed down
        // But then checking within the whole window if the mouse is up?!
        // That is because the "mouseup" event can behave strange when we are dragging the element (as the mouse can "slide" off the element while dragging and then not trigger the event anymore)
        // To avoid bugs, it's best to simply check globally if the mouse isn't being pressed anymore
        element.addEventListener("mousedown", () => this.startDragging(this));
        element.innerText = text;
        parent.appendChild(element);
        return element;
    }

    startDragging(magnet){
        magnet.dragged = true;
    }

    stopDragging(magnet){
        magnet.dragged = false;
    }

    moveMagnet(mouseX, mouseY){
        // Get container position and width in pixel
        let fridge = this.DOMNode.parentElement;
        let containerWidth = fridge.clientWidth;
        let containerHeight = fridge.clientHeight;

        // Getting the position isn't as easy because of the way we
        // used CSS to position it.
        // But we know that the width and height are both 90% of the body.
        // Then it is offset in the middle, meaning 5% to the left and 5% down
        // from the top of body.
        let containerX = document.getElementsByTagName("body")[0].clientWidth * 0.05;
        let containerY = document.getElementsByTagName("body")[0].clientHeight * 0.05;
        let newX = containerX;
        let newY = containerY;

        // Here we check if the mouse is in bounds
        // If not, we are going to use the closest edge on each axis
        if(mouseX > containerX){
            newX = mouseX;
            if(mouseX > containerWidth + containerX){
                newX = containerWidth + containerX;
            }
        }
        if(mouseY > containerY){
            newY = mouseY;
            if(mouseY > containerHeight + containerY){
                newY = containerHeight + containerY;
            }
        }
        // Because our x and y are relative values from 0 to 1 we need
        // to convert our mouse position.
        let relativeX = (newX - containerX) / containerWidth;
        let relativeY = (newY - containerY) / containerHeight;
        this.setPosition(relativeX, relativeY);
    }

    update(mouseX, mouseY)
    {
        // If the magnet is dragged we update the position accordingly
        if(this.dragged){
            this.moveMagnet(mouseX, mouseY);

            // TODO 6:
            let data =
                {
                    index: this.index,
                    x: this.x,
                    y: this.y
                }
            // 6b. and send it to the server
            // (emit a signal)
            socket.emit('clientMagnetMove', data);
        }
        // Else we also set the position in case somebody else dragged & moved
        else {
            this.setPosition(this.x, this.y);
        }
    }
}
