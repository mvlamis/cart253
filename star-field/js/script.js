"use strict";

// How many stars to display?
const NUM_STARS = 1000;

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(0);

    // randomSeed() allows us to make random() more predictable
    // When we set the random seed we make it so that all the
    // random() functions we call from here will have the same
    // (random) return values in a sequence
    // (Try removing it and seeing what happens!)
    randomSeed(1);
    // A for-loop to count from 0 up to the number of stars
    for (let i = 0; i < NUM_STARS; i++) {
        drawStar();
    }
    // Once we get here (with the for-loop done) we will have
    // drawn NUM_STARS stars.
}

/**
 * Draws a star at a random position
 */
function drawStar() {
    push();
    const x = random(0, width);
    const y = random(0, height);
    const diameter = random(2, 5);
    ellipse(x, y, diameter);
    pop();
}