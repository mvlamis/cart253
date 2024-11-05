/**
 * Vertical circles
 * Pippin Barr
 * 
 * Draws a series of circles from the top to the bottom of the canvas.
 * Arguably not in the most efficient way.
 */

"use strict";

/**
 * Create the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Draw circles from the top to the bottom of the canvas
 */
function draw() {
    background(0);

    // Set up the position and diameter of the first circle
    let x = width / 2;
    let y = 0;
    let diameter = 50;

    // Here is the magical while loop
    // Keep checking if y is still less than the height...
    while (y <= height) {
        // If it is, draw the next circle
        ellipse(x, y, diameter);
        // And increase y to move down
        y += diameter;
    }
}