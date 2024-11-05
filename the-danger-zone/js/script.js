/**
 * The Danger Zone
 * Pippin Barr
 * 
 * A world. A danger zone. A need to place our hero randomly  in the world
 * so that they don't land in the danger zone.
 */

"use strict";

// The danger zone - cannot put the hero in this circular area
const dangerZone = {
    x: 200,
    y: 200,
    size: 100
};

// Our hero! We want to place them on the canvas, but
// NOT in the danger zone
const hero = {
    x: undefined, // We don't know their x yet
    y: undefined, // We don't know their y yet
    size: 50
};

function setup() {
    createCanvas(400, 400);

    // Place the hero in a starting position
    // We'll also move them on mouse pressed
    placeHero();
}

/**
 * Display the zone and the hero
 */
function draw() {
    background(0);

    // Draw the danger zone
    push();
    fill(255, 0, 0);
    ellipse(dangerZone.x, dangerZone.y, dangerZone.size);
    pop();

    // Draw the hero
    push();
    fill(255, 255, 0);
    ellipse(hero.x, hero.y, hero.size);
    pop();
}

/**
 * Places the hero in a random position NOT in the danger zone
 */
function placeHero() {
    // Choose a random spot for the hero
    hero.x = random(0, width);
    hero.y = random(0, height);

    // This COULD BE IN THE DANGER ZONE
    // So let's use a while loop to keep checking that
    // and repositioning the hero until we find a spot that
    // isn't

    // Get the distance between the hero and the zone
    let d = dist(hero.x, hero.y, dangerZone.x, dangerZone.y);
    // Check if there's an overlap between the hero and the zone
    while (d < hero.size / 2 + dangerZone.size / 2) {
        // If we get to here, then there *is* an overlap
        // So we need try a new position
        hero.x = random(0, width);
        hero.y = random(0, height);
        // And we need to recalculate the distance for out next time
        // through the while-loop's condition above
        d = dist(hero.x, hero.y, dangerZone.x, dangerZone.y);
    }
    // When we get to here (AFTER the while-loop) we know that the hero's
    // current position does NOT overlap the danger zone!
}

/**
 * Move the hero to a new position on mouse click so we can
 * test out our program further by clicking
 */
function mousePressed() {
    placeHero();
}