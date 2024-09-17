/**
 * Mr. Furious
 * Pippin Barr
 *
 * A guy who becomes visibly furious!
 */

"use strict";

// Our friend Mr. Furious
let mrFurious = {
    // Position and size
    x: 200,
    y: 200,
    size: 100,
    // Colour
    fill: {
        r: 255,
        g: 225,
        b: 225
    },
    shakeValue: 5
};

// our ENEMY, the bird
let bird = {
    x: 120,
    y: 480,
    size: 50,
    velocity: {
        x: 1,
        y: -2
    },
    minVelocity: {
        x: -3,
        y: -2
    },
    maxVelocity: {
        x: 3,
        y: 2
    },
    acceleration: {
        x: 0.025,
        y: -0.05
    }
};

let backgroundColor = {
    r: 160,
    g: 180,
    b: 200
};


/**
 * Create the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Draw (and update) Mr. Furious
 */
function draw() {
    background(backgroundColor.r, backgroundColor.g, backgroundColor.b);

    // turn red over time
    mrFurious.fill.g = mrFurious.fill.g - 0.5;
    mrFurious.fill.b = mrFurious.fill.b - 0.5;
    mrFurious.fill.g = constrain(mrFurious.fill.g, 100, 255);
    mrFurious.fill.b = constrain(mrFurious.fill.b, 100, 255);

    // background colour changes
    backgroundColor.r = backgroundColor.r - 0.5;
    backgroundColor.g = backgroundColor.g - 0.5;
    backgroundColor.b = backgroundColor.b - 0.5;
    backgroundColor.r = constrain(backgroundColor.r, 50, 255);
    backgroundColor.g = constrain(backgroundColor.g, 50, 255);
    backgroundColor.b = constrain(backgroundColor.b, 100, 255);

    // bird movement
    bird.velocity.x = bird.velocity.x + bird.acceleration.x;
    bird.velocity.y = bird.velocity.y + bird.acceleration.y;
    bird.velocity.x = constrain(bird.velocity.x, bird.minVelocity.x, bird.maxVelocity.x);
    bird.velocity.y = constrain(bird.velocity.y, bird.minVelocity.y, bird.maxVelocity.y);
    bird.x = bird.x + bird.velocity.x;
    bird.y = bird.y + bird.velocity.y;

    // mr. furious shakes in anger
    mrFurious.x = mrFurious.x + random(-mrFurious.shakeValue, mrFurious.shakeValue);
    mrFurious.y = mrFurious.y + random(-mrFurious.shakeValue/5, mrFurious.shakeValue/5);
    
    // increase the shake value
    mrFurious.shakeValue = mrFurious.shakeValue + 0.1;
    mrFurious.shakeValue = constrain(mrFurious.shakeValue, 5, 25);

    // keep mr. furious on the canvas
    mrFurious.x = constrain(mrFurious.x, 0, width);
    mrFurious.y = constrain(mrFurious.y, 0, height);

    // Draw Mr. Furious as a coloured circle
    push();
    noStroke();
    fill(mrFurious.fill.r, mrFurious.fill.g, mrFurious.fill.b);
    ellipse(mrFurious.x, mrFurious.y, mrFurious.size);
    pop();

    // Draw the bird as a triangle
    push();
    noStroke();
    fill(255);
    triangle(bird.x, bird.y, bird.x + bird.size, bird.y, bird.x + bird.size / 2, bird.y - bird.size);
    pop();

}