/**
 * Variation Jam
 * Michaelsoft Wurd
 * Michael Vlamis
 * 
 * What if word processors were good?
 * 
 */

"use strict";

const templateButtonHeight = 100;
const templateButtonStartPos = 180;

const templates = {
    "blank": "Blank Document", 
    "autocorrect": "Autocorrect",
    "musical": "Musical Typing",
    "alphabetical": "Hunt and Peck",
    "medieval": "Medieval"
};

const templateDescriptions = {
    "blank": "Basic, boring, and blank. Are you allergic to fun?",
    "autocorrect": "Computers don't make mistakes. It's autocorrect, not autoincorrect.",
    "musical": "Every keystroke is music to my ears.",
    "alphabetical": "Doing what Dvorak couldn't.",
    "medieval": "Forsooth!"
};

let state = "start";
let font = "sans-serif";
let killigrewFont;
let paperTexture;
let penCursor;

let content = "";
let words = [];
let underlinedWordIndex = -1;
let underlineTimeout;

let keyboardSounds = [];
const numSounds = 8; // Number of different sounds to cycle through

let currentVolume = 0.1;
const volumeIncrement = 0.05;

const alphabeticalKeyMap = {
    'q': 'a', 'w': 'b', 'e': 'c', 'r': 'd', 't': 'e',
    'y': 'f', 'u': 'g', 'i': 'h', 'o': 'i', 'p': 'j',
    'a': 'k', 's': 'l', 'd': 'm', 'f': 'n', 'g': 'o',
    'h': 'p', 'j': 'q', 'k': 'r', 'l': 's',
    'z': 't', 'x': 'u', 'c': 'v', 'v': 'w',
    'b': 'x', 'n': 'y', 'm': 'z'
};

/**
 * OH LOOK I DIDN'T DESCRIBE SETUP!!
*/
function setup() {
    createCanvas(600, 800);
    
    // Load fonts and images
    killigrewFont = loadFont('assets/Killigrew.ttf');
    paperTexture = loadImage('assets/images/paper.png');
    penCursor = loadImage('assets/images/pen.png');
    
    // Load keyboard sounds
    for (let i = 1; i < numSounds; i++) {
        keyboardSounds[i] = loadSound(`assets/sounds/key${i}.wav`);
    }
}

function keyPressed() {
    if (state === "musical") {
        // Play a random sound with increasing volume
        let randomSound = floor(random(keyboardSounds.length - 1)) + 1;
        keyboardSounds[randomSound].setVolume(currentVolume);
        keyboardSounds[randomSound].play();
        
        // Increase volume for next keystroke
        currentVolume = currentVolume + volumeIncrement;
    }

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
        if (state === "alphabetical" && alphabeticalKeyMap[key.toLowerCase()]) {
            let mappedKey = alphabeticalKeyMap[key.toLowerCase()];
            // Preserve original capitalization
            content += key === key.toUpperCase() ? mappedKey.toUpperCase() : mappedKey;
        } else {
            content += key;
        }
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
    if (state !== "start") {
        let desc = templateDescriptions[state];
        let x = 150;
        let y = 110;
        let width = 450;
        let lineHeight = 15;
        let descWords = desc.split(' ');
        for (let i = 0; i < descWords.length; i++) {
            let word = descWords[i];
            text(word, x, y);
            x += textWidth(word + ' ');
            // wrap text
            if (x > width - 40) {
                x = 150;
                y += lineHeight;
            }
        }
    }
    

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
    
    // Draw paper background for medieval template
    if (state === "medieval") {
        image(paperTexture, 10, 140, 580, 620);
    } else {
        rect(20, 150, 560, 600);
    }
    
    ribbonMenu();

    // text editor
    push();
    textFont(state === "medieval" ? killigrewFont : font);
    fill(0);
    textSize(state === "medieval" ? 32 : 20);
    textAlign(LEFT, TOP);
    let x = 30;
    let y = state === "medieval" ? 180 : 160;
    let lineHeight = state === "medieval" ? 40 : 24;
    
    // Split content by newlines first, then words
    let lines = content.split('\n');
    let cursorX = x;
    let cursorY = y;
    
    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        let words = lines[lineNum].split(' ');
        x = 30; // Reset x at start of each line
        
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            let wordWidth = textWidth(word + ' ');
            
            // Check if word would go past margin
            if (x + wordWidth > width - 40) {
                x = 30;
                y += lineHeight;
            }
            
            text(word, x, y);
            x += wordWidth;
            
            // Update cursor position
            if (lineNum === lines.length - 1 && i === words.length - 1) {
                cursorX = x;
                cursorY = y;
            }
        }
        
        // Move to next line after processing each line
        y += lineHeight;
        
        // If this is the last line, set cursor position
        if (lineNum === lines.length - 1 && lines[lineNum] === '') {
            cursorX = 30;
            cursorY = y;
        }
    }

    // Draw pen cursor in medieval mode
    if (state === "medieval") {
        push();
        imageMode(CENTER);
        image(penCursor, cursorX + 360, cursorY - 20, 828, 280);
        pop();
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
    } else if (state === "blank" || state === "autocorrect" || state === "musical" || state === "alphabetical" || state === "medieval") {
        regularEditor();
    }
    navbar();
}