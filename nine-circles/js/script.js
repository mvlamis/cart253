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
    // NOTE: We now have a "starting Y" where the first
    // circle will be drawn
    let startY = 0;
    let diameter = 10;

    // Count with i from 0 up to 8
    for (let i = 0; i < 9; i++) {
        // The y position of each circle should be the starting y
        // PLUS i times the diameter
        // So that when i is 0, y will be startY
        // When i is 1, y will be startY + diameter
        // When i is 2, y will be startY + 2*diameter
        // etc.
        // Causing the circles to move down the canvas
        let y = startY + i * diameter;
        ellipse(x, y, diameter);
    }
}