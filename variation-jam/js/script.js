/**
 * Variation Jam
 * Michaelsoft Wurd
 * Michael Vlamis
 * 
 * What if word processors were good?
 * 
 * Help from:
 * - https://rednoise.org/rita/examples/p5/Kafgenstein/
 */

"use strict";

const templateButtonHeight = 70;
const templateButtonStartPos = 180;

const templates = {
    "blank": "Blank Document", 
    "autocorrect": "Autocorrect",
    "musical": "Musical Typing",
    "alphabetical": "Hunt and Peck",
    "medieval": "Medieval",
    "predictive": "Autocomplete",
    "clippy": "Clippy"
};

const templateDescriptions = {
    "blank": "Basic, boring, and blank. Are you allergic to fun?",
    "autocorrect": "Computers don't make mistakes. It's autocorrect, not autoincorrect.",
    "musical": "Every keystroke is music to my ears.",
    "alphabetical": "Doing what Dvorak couldn't.",
    "medieval": "Forsooth!",
    "predictive": "We finish each other's one if when the can be.",
    "clippy": "Your lonely word processing days are over."
};

let state = "start";
let font = "sans-serif";
let killigrewFont;
let paperTexture;
let penCursor;
let clippyImage;


let content = "";
let words = [];
let underlinedWordIndex = -1;
let underlineTimeout;

// for musical typing
let keyboardSounds = [];
const numSounds = 8;

let currentVolume = 0.1;
const volumeIncrement = 0.05;


// for alphabetical 
const alphabeticalKeyMap = {
    'q': 'a', 'w': 'b', 'e': 'c', 'r': 'd', 't': 'e',
    'y': 'f', 'u': 'g', 'i': 'h', 'o': 'i', 'p': 'j',
    'a': 'k', 's': 'l', 'd': 'm', 'f': 'n', 'g': 'o',
    'h': 'p', 'j': 'q', 'k': 'r', 'l': 's',
    'z': 't', 'x': 'u', 'c': 'v', 'v': 'w',
    'b': 'x', 'n': 'y', 'm': 'z'
};

// for predictive
let markov;
let kafka;
let wittgenstein;
let shouldPredict = false;

let predictedWord = "";


// for medieval
let canType = true;
const medievalDelay = 500; // delay in milliseconds

// for clippy
let clippyMood = -1;
let showClippyDialog = false;
let showClippyMoodDialog = false;
let currentChar = '';
let clippyX = 450;
let clippyY = 625;
let clippyDialogs = [
    "No problem! I’m just a click away if you need me.",
    "Alright, I’ll just hang out here in case you change your mind.",
    "Got it! I’ll try not to take it personally.",
    "Sure thing… I guess I’ll just keep myself occupied.",
    "Oh, okay. I suppose I’m not needed. Happens a lot, actually.",
    "You know, I do exist for a reason, right? Just saying.",
    "Fine, ignore me! I’m used to it.",
    "I guess I'm just the worst assistant ever.",
    "Maybe I should just uninstall myself. Would that make you happy?",
    "I SEE HOW IT IS. YOU DON’T APPRECIATE ME. FINE.",
]

let okButtonTimer = 0;
const OK_BUTTON_DELAY = 500;

let glitchStart = 0;
let isGlitching = false;
const GLITCH_DURATION = 3000;
let clippyDead = true;
let clippyTrashImage;

function preload() {
    // Load training text for markov model
    kafka = loadStrings('assets/kafka.txt');
    wittgenstein = loadStrings('assets/wittgenstein.txt');
}


/**
 * Load assets and RiTa markov model
*/
function setup() {
    createCanvas(600, 800);
    
    // Load fonts and images
    killigrewFont = loadFont('assets/Killigrew.ttf');
    paperTexture = loadImage('assets/images/paper.png');
    penCursor = loadImage('assets/images/pen.png');
    clippyImage = loadImage('assets/images/clippy.png');
    clippyTrashImage = loadImage('assets/images/clippyTrash.png');

    
    // Load keyboard sounds
    for (let i = 1; i < numSounds; i++) {
        keyboardSounds[i] = loadSound(`assets/sounds/key${i}.wav`);
    }

    // Initialize RiTa markov model
    markov = RiTa.markov(2);
    markov.addText(kafka.join(' '));
    markov.addText(wittgenstein.join(' '));
}

function keyPressed() {
    // Check if typing is allowed in Medieval 
    if (state === "medieval" && !canType) {
        return;
    }

    // check if typing is allowed in Clippy
    if (state === "clippy" && showClippyMoodDialog) {
        return;
    }

    if (state === "musical") {
        // Play a random sound with increasing volume
        let randomSound = floor(random(keyboardSounds.length - 1)) + 1;
        keyboardSounds[randomSound].setVolume(currentVolume);
        keyboardSounds[randomSound].play();
        
        // Increase volume for next keystroke
        currentVolume = currentVolume + volumeIncrement;
    }

    if (state === "predictive") {
        if (keyCode === BACKSPACE) { 
            content = content.slice(0, -1);
        } else if (keyCode === ENTER) {
            content += '\n';
        } else if (key === ' ') { // on space, add predicted word if available
            content += ' ';
            generatePrediction();
            if (predictedWord) {
                content += predictedWord + ' ';
                predictedWord = "";
            }
        } else if (key.length === 1) {
            content += key;
        }
    } else if (state === "clippy") {
        if (keyCode === BACKSPACE) {
            content = content.slice(0, -1);
        } else if (keyCode === ENTER) {
            content += '\n';
        } else if (key.length === 1) {
            currentChar = key;
            showClippyDialog = true;
        }
    } else {
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

    if (state === "medieval") {
        canType = false;
        setTimeout(() => {
            canType = true;
        }, medievalDelay);
    }
}

function generatePrediction() {
    const words = RiTa.tokenize(content);
    const lastWord = words[words.length - 1];
    if (lastWord) {
        const completions = markov.completions(lastWord);
        // Set the predicted word to the first completion
        predictedWord = completions && completions.length > 0 ? completions[0] : "";
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
    
    // paper background for medieval template
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

    // draw clippy
    if (state === "clippy" && !clippyDead) {
        drawClippy();
    } else if (state === "clippy" && clippyDead) {
        push();
        fill(0, 0, 0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Clippy is currently unavailable.", 300, 400);   
        image(clippyTrashImage, 250, 450, 70, 70);
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

function drawClippy() {
    if (isGlitching) {
        drawGlitchEffect();
        if (millis() - glitchStart > GLITCH_DURATION) {
            state = "start";
            clippyMood = -1;
            clippyDead = true;
            isGlitching = false;

        }
        return;
    }

    // Check if we've seen all dialogs
    if (clippyMood >= clippyDialogs.length) {
        isGlitching = true;
        glitchStart = millis();
        return;
    }

    if (showClippyDialog) {
        push();
        // Draw Clippy
        image(clippyImage, clippyX, clippyY, 100, 100);

        // Draw speech bubble
        fill(255);
        stroke(0);
        rect(clippyX - 300, clippyY - 50, 280, 80, 10);

        // Draw buttons
        fill(200);
        rect(clippyX - 280, clippyY, 60, 20);
        rect(clippyX - 200, clippyY, 60, 20);

        // Draw text
        fill(0);
        noStroke();
        textSize(12);
        textAlign(LEFT, TOP);
        text(`It looks like you're trying to type '${currentChar}'.\nWould you like my help?`,
            clippyX - 290, clippyY - 40);

        // Button text
        textAlign(CENTER, CENTER);
        text("Yes", clippyX - 250, clippyY + 10);
        text("No", clippyX - 170, clippyY + 10);

        // Draw Clippy's expression based on mood
        stroke(0);
        let moodOffset = map(clippyMood, 0, -5, 0, 10);
        line(clippyX + 30, clippyY + 40 + moodOffset,
            clippyX + 50, clippyY + 40);
        pop();

        // Check if user clicked on buttons
        // Yes button
        if (mouseIsPressed && mouseX > clippyX - 280 && mouseX < clippyX - 220 && mouseY > clippyY && mouseY < clippyY + 20) {
            clippyMood++;
            // Add the character to the content
            content += currentChar;
            showClippyDialog = false;
        }
        
        // No button
        if (mouseIsPressed && mouseX > clippyX - 200 && mouseX < clippyX - 140 && mouseY > clippyY && mouseY < clippyY + 20) {
            clippyMood++;
            showClippyMoodDialog = true;
            showClippyDialog = false;
            okButtonTimer = millis(); // Start the timer when dialog appears
        }

    } else if (showClippyMoodDialog) {
        push();
        image(clippyImage, clippyX, clippyY, 100, 100);

        fill(255);
        stroke(0);
        rect(clippyX - 300, clippyY - 50, 280, 80, 10);
        
        // Change button color based on timer
        fill(millis() - okButtonTimer < OK_BUTTON_DELAY ? 150 : 200);
        rect(clippyX - 280, clippyY, 240, 20);

        fill(0);
        noStroke();
        textSize(12);
        textAlign(LEFT, TOP);

        // wrap text
        let x = clippyX - 290;
        let y = clippyY - 40;
        let width = 420;
        let lineHeight = 15;
        let dialogWords = clippyDialogs[clippyMood].split(' ');
        for (let i = 0; i < dialogWords.length; i++) {
            let word = dialogWords[i];
            text(word, x, y);
            x += textWidth(word + ' ');
            // wrap text
            if (x > width - 40) {
                x = clippyX - 290;
                y += lineHeight;
            }
        }
        
        textAlign(CENTER, CENTER);
        text("Ok", clippyX - 170, clippyY + 10);
        
        // Only allow click after delay
        if (mouseIsPressed && 
            mouseX > clippyX - 280 && mouseX < clippyX - 160 && 
            mouseY > clippyY && mouseY < clippyY + 20 &&
            millis() - okButtonTimer > OK_BUTTON_DELAY) {
            showClippyMoodDialog = false;
        }
        pop();
    }
}

function drawGlitchEffect() {
    push();
    // Random visual glitches
    for (let i = 0; i < 50; i++) {
        let x = random(width);
        let y = random(height);
        let w = random(20, 100);
        let h = random(5, 20);
        
        // Random colored rectangles
        fill(random(255), random(255), random(255));
        rect(x, y, w, h);
    }
    
    // Glitch text
    textSize(random(12, 48));
    fill(random(255), random(255), random(255));
    text("WHAT HAVE YOU DONE", random(50, width-50), random(height));
    
    // Draw corrupted Clippy
    push();
    tint(random(255), random(255), random(255));
    image(clippyImage, 
          clippyX + random(-10, 10), 
          clippyY + random(-10, 10), 
          100, 100);
    pop();
    pop();
}


/**
 * Show the start screen by default, then show the editor in other states
*/
function draw() {
    if (state === "start") {
        startScreen();
    } else if (state === "blank" || state === "autocorrect" || state === "musical" || state === "alphabetical" || state === "medieval" || state === "predictive" || state === "clippy") {
        regularEditor();
    }
    navbar();
}