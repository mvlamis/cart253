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
 *  - Day/night cycle
 *  - Frog eyes
 * - Hunger system
 * - Game over screen
 * - Different types of flies
 * - Timer
 * - Best time
 * - Story and instructions
 * - Multiple flies
 * - Power-ups
 * - Sound effects
 * - Music
*/

"use strict";

const MAX_HUNGER = 100;
const MAX_FLIES = 5; // Maximum number of flies on screen
let hunger = MAX_HUNGER;
let hungerLossRate = 0.1;
let state = "title";
let flyCount = -1;
let clouds = [];
let startTime;
let elapsedTime = 0;
let bestTime = 0;
let titleScreenPart = 1;
let flies = []; // Array to store multiple flies
let powerUpsOnScreen = [];
let appliedPowerUps = [];
let cOffset = 0;
let sounds = {};

const powerUps = [ // powerups have names because i do not want to code in emojis thank you very much
    ["wokeLeft", "🏳️‍🌈"],
    ["wigglyTongue", "🫨"],
    ["allergicReaction", "👅"]
];

function preload() {
    sounds = {
        bg: loadSound("/mod-jam/assets/sounds/bg.mp3"),
        bornthisway: loadSound("/mod-jam/assets/sounds/bornthisway.mp3"),
        buzz: loadSound("/mod-jam/assets/sounds/buzz.mp3"),
        eat: loadSound("/mod-jam/assets/sounds/eat.mp3"),
        mlerm: loadSound("/mod-jam/assets/sounds/mlerm.mp3"),
        widemlerm: loadSound("/mod-jam/assets/sounds/widemlerm.mp3"),
        wobblymlerm: loadSound("/mod-jam/assets/sounds/wobblymlerm.mp3"),
        wompwomp: loadSound("/mod-jam/assets/sounds/wompwomp.mp3")
    };

    sounds.bg.setLoop(true);
}

// Our frog
const frog = {
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,
        state: "idle"
    }
};

function createFly() {
    return {
        x: 0,
        y: random(60, 300),
        size: 10,
        speed: random(1, 5),
        type: random(["regular", "hungryFly", "fastFly", "badFly"]),
        getColor() {
            switch (this.type) {
                case "regular": return "#000000";
                case "hungryFly": return "#00FF00";
                case "fastFly": return "#0000FF";
                case "badFly": return "#FF0000";
            }
        }
    };
}

function setup() {
    createCanvas(640, 480);
    // Initialize with a few flies
    flies.push(createFly());
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
    if (titleScreenPart === 1) {
        fill("#FFFFFF");
        rect(0, 0, width, height);
        fill("#000000");
        text("Félipé the Famished Frog", 320, 240);
        textSize(20);
        text("Click to continue", 320, 280);
    } else if (titleScreenPart === 2) {
        textSize(15);
        fill("#FFFFFF");
        rect(0, 0, width, height);
        fill("#000000");
        text("Once upon a time, there was a frog named Félipé.", 320, 200);
        text("Félipé was notoriously greedy among his peers, and would eat whatever he could see.", 320, 230);
        text("Help Félipé on his weight loss journey by catching flies with his tongue!", 320, 260);
        textSize(20);
        text("Click to continue", 320, 300);
    } else if (titleScreenPart === 3) {
        textSize(20);
        fill("#FFFFFF");
        rect(0, 0, width, height);
        fill("#000000");
        text("Instructions:", 320, 200);
        text("- Move the frog with your mouse", 320, 230);
        text("- Click to launch the tongue", 320, 260);
        text("- Catch flies to keep Félipé from starving", 320, 290);

        // Draw colored dots and descriptions
        const descriptions = [
            { color: "#000000", text: "Diet Coke" },
            { color: "#00FF00", text: "Ozempic" },
            { color: "#0000FF", text: "Alcohol" },
            { color: "#FF0000", text: "Hyperthyroidism" }
        ];

        let x = 60;
        let y = 340;

        descriptions.forEach((desc) => {
            noStroke();
            fill(desc.color);
            ellipse(x, y - 5, 10, 10);
            fill("#000000");
            textAlign(LEFT);
            text(desc.text, x + 15, y);
            x += 120; // Move x position for next description
        });

        textAlign(CENTER);
        text("Click to start", 320, 400);
    }
    pop();
}

function game() {
    if (appliedPowerUps.some(p => p[0] === "wokeLeft")) {
        drawMovingRainbow();
    } else {
        colorMode(RGB);
        backgroundGradient();
    }
    drawPowerUpsOnScreen();
    drawInfoBar();
    drawClouds();
    if (random(1) < 0.005) { 
        createCloud();
    }
    if (random(1) < 0.001) {
        createPowerUp();
    }

    // Handle flies
    updateFlies();
    drawFlies();

    moveFrog();
    moveTongue();
    drawFrog();
    drawHunger();
    checkTongueFlyOverlap();
    decreaseHunger();
    checkGameOver();
    drawHungerLossIndicator();
    updateTimer();
    updatePowerUpsOnScreen();
    checkFrogPowerUpOverlap();
    removeExpiredPowerUps();
    updateDayNightCycle();
    // loop bg music
    if (!sounds.bg.isPlaying() && !appliedPowerUps.some(p => p[0] === "wokeLeft") && state === "game") {
        sounds.bg.play();
    }
    // loop fly buzz sound
    if (!sounds.buzz.isPlaying() && flies.length > 0 && state === "game") {
        sounds.buzz.play();
    }
}

function gameOver() {
    push();
    fill("#FFFFFF");
    rect(0, 0, width, height);
    fill("#000000");
    textAlign(CENTER);
    textSize(40);
    text("Game Over", 320, 240);
    textSize(20);
    text(`Final Time: ${(elapsedTime / 1000).toFixed(1)}s`, 320, 280);
    text(`Best Time: ${(bestTime / 1000).toFixed(1)}s`, 320, 310);
    text("Click to restart", 320, 340);
    pop();
}

function updateFlies() {
    // Move existing flies
    for (let fly of flies) {
        fly.x += fly.speed;
    }

    // Remove flies that go off screen
    flies = flies.filter(fly => fly.x <= width);

    // Add new flies if we're below the maximum
    if (flies.length < MAX_FLIES && random(1) < 0.02) {
        flies.push(createFly());
    }
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

function drawFlies() {
    for (let fly of flies) {
        push();
        noStroke();
        fill(fly.getColor());
        ellipse(fly.x, fly.y, fly.size);
        pop();
    }
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
    if (!appliedPowerUps.some(p => p[0] === "wigglyTongue")) {
        // Tongue matches the frog's x
        frog.tongue.x = frog.body.x;
    } else { 
        frog.tongue.x = frog.body.x + 50 * sin(millis() / 100);
    }

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
    if (appliedPowerUps.some(p => p[0] === "allergicReaction")) {
        frog.tongue.size = 40;
    } else {
        frog.tongue.size = 20;
    }
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
    const barY = 15;

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

let day = true;
let transitionStartTime = 0;
let transitioning = false;

function backgroundGradient() {
    push();
    let color1, color2;

    if (transitioning) {
        let transitionProgress = (millis() - transitionStartTime) / 2000; // 2 seconds transition
        if (transitionProgress >= 1) {
            transitioning = false;
            day = !day;
        } else {
            if (day) {
                color1 = lerpColor(color(3, 169, 252), color(0, 0, 0), transitionProgress);
                color2 = lerpColor(color(108, 149, 189), color(25, 25, 112), transitionProgress);
            } else {
                color1 = lerpColor(color(0, 0, 0), color(3, 169, 252), transitionProgress);
                color2 = lerpColor(color(25, 25, 112), color(108, 149, 189), transitionProgress);
            }
        }
    }

    if (!transitioning) {
        if (day) {
            color1 = color(3, 169, 252);
            color2 = color(108, 149, 189);
        } else {
            color1 = color(0, 0, 0);
            color2 = color(25, 25, 112);
        }
    }

    for (let i = 0; i < height; i++) {
        let inter = map(i, 0, height, 0, 1);
        let c = lerpColor(color1, color2, inter);
        stroke(c);
        line(0, i, width, i);
    }
    pop();
}

function updateDayNightCycle() {
    if (millis() - transitionStartTime >= 10000) { // 10 seconds for each cycle
        transitioning = true;
        transitionStartTime = millis();
    }
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    for (let i = flies.length - 1; i >= 0; i--) {
        const fly = flies[i];
        const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
        const eaten = (d < frog.tongue.size / 2 + fly.size / 2);

        if (eaten) {
            // Play the eat sound
            sounds.eat.play();

            // Apply effects based on fly type
            switch (fly.type) {
                case "regular":
                    hunger = min(hunger + 20, MAX_HUNGER);
                    break;
                case "hungryFly":
                    hunger = min(hunger + 40, MAX_HUNGER);
                    break;
                case "fastFly":
                    hunger = min(hunger + 20, MAX_HUNGER);
                    hungerLossRate = 0.3;
                    setTimeout(() => { hungerLossRate = 0.1; }, 5000);
                    break;
                case "badFly":
                    hunger = max(hunger - 20, 0);
                    break;
            }

            // Remove the eaten fly
            flies.splice(i, 1);
            flyCount++;

            // Bring back the tongue
            frog.tongue.state = "inbound";
        }
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
        sounds.bg.stop();
        sounds.buzz.stop();
        sounds.wompwomp.play();
        if (elapsedTime > bestTime) {
            bestTime = elapsedTime;
        }
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (state === "title") {
        if (titleScreenPart < 3) {
            titleScreenPart++;
        } else {
            state = "game";
            startTime = millis();
        }
    }
    else if (state === "game") {
        if (frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
            if (appliedPowerUps.some(p => p[0] === "wigglyTongue")) {
                sounds.wobblymlerm.play();
            } else if (appliedPowerUps.some(p => p[0] === "allergicReaction")) {
                sounds.widemlerm.play();
            } else {
                sounds.mlerm.play();
            }

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
    flies = [];
    flies.push(createFly());
    state = "game";
    startTime = millis();
    elapsedTime = 0;
    powerUpsOnScreen = [];
    hungerLossRate = 0.1;
    appliedPowerUps = [];
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

/**
 * Updates the timer
 */
function updateTimer() {
    elapsedTime = millis() - startTime;
}

/**
 * Draws the timer
 */
function drawTimer() {
    push();
    fill("#FFFFFF");
    textSize(20);
    textAlign(RIGHT);
    text((elapsedTime / 1000).toFixed(1), 630, 30);
    pop();
}

function createPowerUp() {
    const powerUp = {
        x: random(50, width - 50),
        y: 0,
        size: 30,
        type: random(powerUps),
    };
    powerUpsOnScreen.push(powerUp);
}

function drawPowerUpsOnScreen() {
    for (let powerUp of powerUpsOnScreen) {
        push();
        stroke("#000000");
        fill("#FFFFFF");
        textAlign(CENTER, CENTER);
        textSize(powerUp.size);
        text(powerUp.type[1], powerUp.x, powerUp.y);
        pop();
    }
}

function updatePowerUpsOnScreen() {
    for (let powerUp of powerUpsOnScreen) {
        powerUp.y += 1;
    }
    console.log(powerUpsOnScreen);
}

function checkFrogPowerUpOverlap() {
    for (let i = powerUpsOnScreen.length - 1; i >= 0; i--) {
        const powerUp = powerUpsOnScreen[i];
        const d = dist(frog.body.x, frog.body.y, powerUp.x, powerUp.y);
        const eaten = (d < frog.body.size / 2 + powerUp.size / 2);

        if (eaten) {
            if (!appliedPowerUps.some(p => p[0] === powerUp.type[0])) {
                appliedPowerUps.push([powerUp.type[0], powerUp.type[1], millis()]); // Add power-up with timestamp
                if (powerUp.type[0] === "wokeLeft") {
                    sounds.bg.stop();
                    sounds.bornthisway.play();
                    
                }
            }

            powerUpsOnScreen.splice(i, 1);
        }
    }
}

function drawPowerUpDisplay() {
    push();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(20);
    // show power-up emojis in top bar
    let x = 330;
    let y = 25;
    for (let powerUp of appliedPowerUps) {
        text(powerUp[1], x, y);
        x += 30;
    }
    pop();
}

function drawInfoBar() {
    push();
    fill("#555555");
    rect(0, 0, width, 50);
    drawTimer();
    drawHunger();
    drawPowerUpDisplay();
    pop();
}

function drawMovingRainbow() { // shamefully stolen from https://editor.p5js.org/NickParsons/sketches/1xfjY-ZoE
    const inc = height / 100;
    colorMode(HSB);

    for (let y = 0; y < height; y += inc) {
        let h = (y / height) * 360;
        fill(abs(h + cOffset) % 360, 100, 100);
        noStroke();
        rect(0, y - inc, width, y);
    }

    cOffset -= 5;
}

// check and remove expired power-ups
function removeExpiredPowerUps() {
    const currentTime = millis();
    appliedPowerUps = appliedPowerUps.filter(p => currentTime - p[2] < 10000); // 10000 milliseconds = 10 seconds
}