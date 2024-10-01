/**
 * Art Jam
 * Michael Vlamis
 * 
 * Interactive Art Thing
 */

"use strict";

let circles = [];
const maxCircles = 100;

let colourScheme = "green";
let dotColour;
let bgGlow = 0;

const connections = true;
const glow = true;
const circlesFade = true;
const circleCount = true;

// colour change buttons
function mousePressed() {
  if (dist(mouseX, mouseY, 30, 100) < 25) {
    colourScheme = "red";
  }
  if (dist(mouseX, mouseY, 30, 150) < 25) {
    colourScheme = "green";
  }
  if (dist(mouseX, mouseY, 30, 200) < 25) {
    colourScheme = "blue";
  }
}

function mouseReleased() {
  bgGlow = 0;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textFont("Courier New");
}

function draw() {
  background(0, 10);

  // Draw background glow
  if (mouseIsPressed) {
    if (bgGlow < 5) {
      bgGlow += 0.025;
    } else {
      bgGlow = 5;
    }
  }
  if (colourScheme == "red") {
    fill(255, 0, 0, 1);
  }
  if (colourScheme == "green") {
    fill(0, 255, 0, 1);
  }
  if (colourScheme == "blue") {
    fill(0, 0, 255, 1);
  }

  for (let i = 0; i < 100; i++) {
    ellipse(windowWidth/2, windowHeight/2, i * bgGlow);
  }

  // Set colour scheme
  if (colourScheme == "red") {
    dotColour = color(random(255), 0, 0, 150);
  }
  if (colourScheme == "green") {
    dotColour = color(0, random(255), 0, 150);
  }
  if (colourScheme == "blue") {
    dotColour = color(0, 0, random(255), 150);
  }

  // Add new circle based on mouse position
  if (mouseIsPressed && circles.length < maxCircles && dist(mouseX, mouseY, pmouseX, pmouseY) > 10) {
    circles.push({
      x: mouseX,
      y: mouseY,
      size: random(10, 50),
      color: dotColour
    });
  }
  
  // Update and draw circles
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    
    // Draw circle
    noStroke();
    fill(circle.color);
    ellipse(circle.x, circle.y, circle.size);
    
    // Draw connections
    if (i > 0 && connections) {
      let prevCircle = circles[i - 1];
      stroke(circle.color);
      line(circle.x, circle.y, prevCircle.x, prevCircle.y);
    }

    // Draw bezier connections
    if (i > 1 && connections) {
      let prevCircle = circles[i - 1];
      let prevPrevCircle = circles[i - 2];
      stroke(255, 255, 255, random(0, 30));
      strokeWeight(random(1, 10));
      noFill()
      bezier(circle.x, circle.y, prevCircle.x + random(-10, 10), prevCircle.y, prevPrevCircle.x, prevPrevCircle.y, prevPrevCircle.x, prevPrevCircle.y);
    }

    // Draw circle glow
    if (glow) {
      noFill();
      stroke(circle.color);
      strokeWeight(10);
      ellipse(circle.x, circle.y, circle.size + 10);
    }
    
    // Slowly move circles
    circle.x += random(-1, 1);
    circle.y += random(-1, 1);
    
    // Remove circles that are too small
    if (circlesFade) {
      circle.size *= 0.99;
      if (circle.size < 1) {
        circles.splice(i, 1);
      }
    }
  }

  // draw circle count
  if (circleCount) {
    fill(0);
    stroke(0);
    textSize(50);
    rect(0, 0, 100, 55);
    fill(255);
    text(circles.length, 10, 50);
  }

  // draw active colour scheme indicator
  fill(255);
  noStroke();
  if (colourScheme == "red") {
    ellipse(30, 100, 45);
  }
  if (colourScheme == "green") {
    ellipse(30, 150, 45);
  }
  if (colourScheme == "blue") {
    ellipse(30, 200, 45);
  }

  // draw colour change buttons
  push();
  fill(255, 0, 0);
  ellipse(30, 100, 35);
  fill(0, 255, 0);
  ellipse(30, 150, 35);
  fill(0, 0, 255);
  ellipse(30, 200, 35);
  pop();
}
