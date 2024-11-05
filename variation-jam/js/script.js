/**
 * Variation Jam
 * Michaelsoft Wurd
 * Michael VLamis
 * 
 * What if word processors were good?
 * 
 */

"use strict";

const templateButtonHeight = 100;
const templateButtonStartPos = 200;

const templates = {"blank": "Blank Document", "autocorrect": "Autocorrect"};
const templateDescriptions = {
    "blank": "Basic, boring, and blank. Are you allergic to fun?", 
    "autocorrect": "A document with autocorrect enabled"};

let state = "start";

let content = "";

/**
 * OH LOOK I DIDN'T DESCRIBE SETUP!!
*/
function setup() {
    createCanvas(600, 800);
}

function navbar() {
    fill(0);
    rect(0, 0, 600, 40);
    fill("red");
    ellipse(25, 25, 15, 15);
    fill("yellow");
    ellipse(50, 25, 15, 15);
    fill("green");
    ellipse(75, 25, 15, 15);
    fill(255);
    textSize(15);
    textAlign(LEFT, CENTER);
    text("Michaelsoft Wurd", 110, 25);
}

function startScreen() {
    background(240);
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Welcome to Michaelsoft Wurd", 300, 100);
    textSize(20);
    text("Create new document from template", 300, 135);

    // Draw template buttons
    for (let i = 0; i < Object.keys(templates).length; i++) {
        let template = Object.keys(templates)[i];
        let templateName = templates[template];
        fill(200);
        stroke(1);
        rect(100, templateButtonStartPos + 1.2 * i * templateButtonHeight, 400, templateButtonHeight);
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        noStroke();
        text(templateName, 300, templateButtonStartPos + 1.2 * i * templateButtonHeight + templateButtonHeight / 2);
        if (mouseIsPressed && mouseX > 100 && mouseX < 500 && mouseY > templateButtonStartPos + 1.2 * i * templateButtonHeight && mouseY < templateButtonStartPos + 1.2 * i * templateButtonHeight + templateButtonHeight) {
            state = template;
        }
    }

}

function ribbonMenu() {
    fill(200);
    rect(20, 50, 560, 90);
    fill(0);
    textSize(12);
    textAlign(LEFT, CENTER);
    text("File     Edit     View     Insert     Format     Tools     Table     Help", 30, 65);
    fill(150);
    stroke(1);
    rect(30, 80, 110, 50);
    fill(0);
    noStroke();
    text("Change template", 40, 105);
    if (mouseIsPressed && mouseX > 30 && mouseX < 130 && mouseY > 80 && mouseY < 130) {
        state = "start";
    }
    // template name text
    fill(0);
    textSize(18);
    textAlign(LEFT, CENTER);
    text(templates[state], 150, 90);
    // template description text
    textSize(12);
    text(templateDescriptions[state], 150, 110);

}

function regularEditor() {
    background(240);
    fill(255);
    noStroke();
    rect(20, 150, 560, 600);
    ribbonMenu();

    // text editor
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
}


/**
 * OOPS I DIDN'T DESCRIBE WHAT MY DRAW DOES!
*/
function draw() {
    if (state === "start") {
        startScreen();
    } else if (state === "blank") {
        regularEditor();
    } else if (state === "autocorrect") {
        regularEditor();
    }
    navbar();
}