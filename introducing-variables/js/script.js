"use strict";

function setup() {
    createCanvas(640, 640);
}

function draw() {
    background(0);

    push();
    noStroke();
    fill(mouseX, mouseY, 0);
    ellipse(width/2, height/2, mouseX, mouseY);
    pop();
}