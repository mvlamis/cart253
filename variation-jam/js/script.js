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
let font = "sans-serif";

let content = "";
let words = [];
let underlinedWordIndex = -1;
let underlineTimeout;

/**
 * OH LOOK I DIDN'T DESCRIBE SETUP!!
*/
function setup() {
    createCanvas(600, 800);
}

function keyPressed() {
    if (keyCode === BACKSPACE) {
        content = content.slice(0, -1);
    } else if (keyCode === ENTER) {
        content += '\n';
    } else if (key === ' ') {
        content += ' ';
        if (state === "autocorrect") {
            underlineLastWord();
        }
    } else if (key.length === 1) { // Only add printable characters
        content += key;
    }
}

function underlineLastWord() {
    words = content.split(' ');
    underlinedWordIndex = words.length - 2; // second last element is the last word before space
    if (underlineTimeout) {
        clearTimeout(underlineTimeout);
    }
    underlineTimeout = setTimeout(() => {
        if (underlinedWordIndex >= 0 && words[underlinedWordIndex].length > 1) {
            words[underlinedWordIndex] = jumbleWord(words[underlinedWordIndex]);
            content = words.join(' ');
            underlinedWordIndex = -1;
        }
    }, 500);
}

function jumbleWord(word) {
    let chars = word.split('');
    let index1 = Math.floor(Math.random() * chars.length);
    let index2 = (index1 + 1 + Math.floor(Math.random() * (chars.length - 1))) % chars.length;
    [chars[index1], chars[index2]] = [chars[index2], chars[index1]];
    return chars.join('');
}

function navbar() {
    push();
    stroke(140);
    strokeWeight(1);
    fill(50);
    rect(0, 0, 600, 40);
    fill("red");
    ellipse(25, 20, 15, 15);
    fill("yellow");
    ellipse(50, 20, 15, 15);
    fill("green");
    ellipse(75, 20, 15, 15);
    pop();
    fill(255);
    textSize(15);
    textAlign(LEFT, CENTER);
    text("Michaelsoft Wurd", 110, 20);
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

    // font buttons
    push();
    fill(150);
    stroke(1);
    rect(460, 100, 30, 30);
    rect(500, 100, 30, 30);
    rect(540, 100, 30, 30);
    fill(0);
    noStroke();
    textSize(15);
    textAlign(CENTER, CENTER);
    textFont('sans-serif');
    text("Aa", 475, 115);
    textFont('serif');
    text("Aa", 515, 115);
    textFont('monospace');
    text("Aa", 555, 115);
    pop();

    if (mouseIsPressed && mouseX > 460 && mouseX < 490 && mouseY > 100 && mouseY < 130) {
        font = "sans-serif";
    }
    if (mouseIsPressed && mouseX > 500 && mouseX < 530 && mouseY > 100 && mouseY < 130) {
        font = "serif";
    }
    if (mouseIsPressed && mouseX > 540 && mouseX < 570 && mouseY > 100 && mouseY < 130) {
        font = "monospace";
    }
}

function regularEditor() {
    background(240);
    fill(255);
    noStroke();
    rect(20, 150, 560, 600);
    ribbonMenu();

    // text editor
    push();
    textFont(font);
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    let x = 30;
    let y = 160;
    let lineHeight = 24;
    let words = content.split(' ');
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        if (i === underlinedWordIndex) {
            drawSquigglyUnderline(word, x, y + lineHeight);
        }
        text(word, x, y);
        x += textWidth(word + ' ');
        if (x > width - 40) {
            x = 30;
            y += lineHeight;
        }
    }
    pop();
}

function drawSquigglyUnderline(word, x, y) {
    push();
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    beginShape();
    let width = 0;
    for (let i = 0; i < word.length; i++) { 
        width = textWidth(word.substring(0, i)); // get width of substring
    }
    // sawtooth wave with period of 2
    for (let i = 0; i < width; i += 2) {
        vertex(x + i, y + (i % 4 < 2 ? 2 : -2)); // if i is divisible by 4, draw up, else draw down
    }
    endShape();
    pop();
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