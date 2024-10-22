/**
 * Frogfrogfrog
 * Pippin Barr
 * With yassifications by Michael Vlamis
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 * 
 * New features:
 * - Title screen
 * - Clouds
 * - Visual improvements
 *  - Background gradient
 *  - Frog eyes
 * - Hunger system
 * - Game over screen
 * - Different types of flies
 * 
 * To do:
 * - Add timer
 * - Add sound effects
 * - Add music
 * - Add story text in the title screen
 * - Add instructions in the title screen
 * 
 * To do (advanced):
 * - Add different types of flies
 * - Add power-ups
 * - Add obstacles
*/

"use strict";

const MAX_HUNGER = 100;
let hunger = MAX_HUNGER;
let hungerLossRate = 0.1;
let state = "title";
let flyCount = -1;
let clouds = [];

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

// Our fly
// Has a position, size, speed of horizontal movement, and type
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3,
    type: "regular", // Can be: regular, hungryFly, fastFly, badFly
    color: "#000000" // Default color
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();
}

function draw() {
    if (state === "title") {
        title();
    }
    else if (state === "game") {
        game();
    }
    else if (state === "gameOver") {
        gameOver();
    }
}

function title() {
    push();
    fill("#000000");
    textAlign(CENTER);
    textSize(40);
    text("Félipé the Famished Frog", 320, 240);
    textSize(20);
    text("Click to start", 320, 280);
    pop();
}

function game() {
    backgroundGradient();
    drawClouds();
    if (random(1) < 0.005) {
        createCloud();
    }
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    drawHunger();
    checkTongueFlyOverlap();
    decreaseHunger();
    checkGameOver();
    drawHungerLossIndicator();
}

function gameOver() {
    push();
    fill("#000000");
    textAlign(CENTER);
    textSize(40);
    text("Game Over", 320, 240);
    textSize(20);
    text("Click to restart", 320, 280);
    pop();
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }
}

/**
 * Draws the fly as a circle with its assigned color
 */
function drawFly() {
    push();
    noStroke();
    fill(fly.color);
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(60, 300);
    flyCount++;
    
    // Randomly assign a type to the fly
    const flyTypes = ["regular", "hungryFly", "fastFly", "badFly"];
    fly.type = random(flyTypes);

    // Assign color based on fly type
    if (fly.type === "regular") {
        fly.color = "#000000"; // Black
    } else if (fly.type === "hungryFly") {
        fly.color = "#00FF00"; // Green
    } else if (fly.type === "fastFly") {
        fly.color = "#0000FF"; // Blue
    } else if (fly.type === "badFly") {
        fly.color = "#FF0000"; // Red
    }
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 55) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#A9E055");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    // Draw the frog's eyes
    push();
    noStroke();
    fill("#f2672c");
    ellipse(frog.body.x - 30, frog.body.y - 50, 15);
    ellipse(frog.body.x + 30, frog.body.y - 50, 15);
    fill("#000000");
    ellipse(frog.body.x - 30, frog.body.y - 50, 4, 10);
    ellipse(frog.body.x + 30, frog.body.y - 50, 4, 10);
    pop();
}

function drawHunger() {
    const barWidth = 300;
    const barHeight = 20;
    const barX = 10;
    const barY = 10;

    // Draw the background of the hunger bar
    push();
    fill("#EEEEEE");
    rect(barX, barY, barWidth, barHeight);
    pop();

    // Draw the current hunger level
    const currentHungerWidth = map(hunger, 0, MAX_HUNGER, 0, barWidth);
    push();
    fill("#FF0000");
    rect(barX, barY, currentHungerWidth, barHeight);
    pop();

    // Draw the border of the hunger bar
    push();
    noFill();
    stroke("#000000");
    rect(barX, barY, barWidth, barHeight);
    pop();
}

function drawClouds() {
    for (let cloud of clouds) {
        cloud.x += cloud.speed;
        if (cloud.x > width + cloud.size) { 
            // Remove the cloud
            clouds = clouds.filter(c => c !== cloud);
        }
        push();
        fill("#FFFFFF");
        noStroke();
        ellipse(cloud.x, cloud.y, cloud.size);
        ellipse(cloud.x + cloud.size/2, cloud.y, cloud.size/2);
        pop();
    }
}

function createCloud() {
    const cloud = {
        x: -100,
        y: random(100, 300),
        size: random(50, 100),
        speed: random(0.1, 1)
    };
    clouds.push(cloud);
}

function backgroundGradient() { // shamelessly stolen from https://editor.p5js.org/REAS/sketches/S1TNUPzim
    push();
    // Define colors
    let color1 = color(3, 169, 252);
    let color2 = color(108, 149, 189);
    // Draw the gradient
    for (let i = 0; i < height; i++) {
        let inter = map(i, 0, height, 0, 1);
        let c = lerpColor(color1, color2, inter);
        stroke(c);
        line(0, i, width, i);
    }
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size/2 + fly.size/2);
    if (eaten) {
        // Apply effects based on fly type
        if (fly.type === "regular") {
            hunger = min(hunger + 20, MAX_HUNGER);
        } else if (fly.type === "hungryFly") {
            hunger = min(hunger + 40, MAX_HUNGER);
        } else if (fly.type === "fastFly") {
            hunger = min(hunger + 20, MAX_HUNGER);
            // Increase hunger loss rate temporarily
            console.log("Hunger loss rate increased");
            setTimeout(() => { 
                hungerLossRate = 0.1;
                console.log("Hunger loss rate back to normal");
            }, 5000); // 5 seconds
            hungerLossRate = 0.3;
        } else if (fly.type === "badFly") {
            hunger = max(hunger - 20, 0);
        }

        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

/**
 * Decreases the hunger level over time
 */
function decreaseHunger() {
    hunger -= hungerLossRate;
}

/**
 * Checks if the game is over
 */
function checkGameOver() {
    if (hunger <= 0) {
        state = "gameOver";
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (state === "title") {
        state = "game";
    }
    else if (state === "game") {
        if (frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
        }
    }
    else if (state === "gameOver") {
        // Reset the game and start directly
        resetGame();
    }
}

/**
 * Resets the game state
 */
function resetGame() {
    hunger = MAX_HUNGER;
    flyCount = -1;
    resetFly();
    state = "game";
}

/**
 * Draws a visual indicator when the hunger loss rate is increased
 */
function drawHungerLossIndicator() {
    if (hungerLossRate > 0.1) {
        push();
        stroke("#FF0000");
        strokeWeight(10);
        noFill();
        rect(0, 0, width, height);
        pop();
    }
}