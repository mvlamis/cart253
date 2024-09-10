"use strict";

let holeShade = 12; // greyscale value for the hole
let holeX = 300; // x-coordinate of the hole
let holeY = 400; // y-coordinate of the hole
let holeSize = 200; // diameter of the hole

function setup() {
    createCanvas(640, 640);
}

function draw() {
    background(255, 255, 0);

    push();
    noStroke();
    fill(holeShade);
    ellipse(holeX, holeY, holeSize);
    pop();
}