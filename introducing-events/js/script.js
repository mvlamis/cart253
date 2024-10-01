"use strict";

function setup() {
    createCanvas(400, 400);

    // Filling the background here so it DOESN'T
    // happen every frame
    background(0);
}

function draw() {
    // This is empty!
    // All the action happens when the mouse is pressed
    // By not refilling the background every frame we can see
    // the cumulative effect of the mouse presses!
}

/**
 * The mousePressed() function is AUTOMATICALLY CALLED BY p5
 * whenever the mouse button is pressed down! Handy!
 */
function mousePressed() {
    // Draw an ellipse on the canvas when the mouse is pressed down
    push();
    noStroke();
    fill(255, 255, 0);
    ellipse(mouseX, mouseY, 50);
    pop();
}