/**
 * Art Jam
 * Michael Vlamis
 * 
 * Interactive Art Thing
 */

"use strict";

let circles = [];
const maxCircles = 100;

const connections = true;
const glow = true;
const circlesFade = true;
const circleCount = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0, 10);
  
  // Add new circle based on mouse position
  if (mouseIsPressed && circles.length < maxCircles) {
    circles.push({
      x: mouseX,
      y: mouseY,
      size: random(10, 50),
      color: color(random(255), 255, random(255), 150)
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

    // draw circle count
    if (circleCount) {
      fill(0);
      stroke(0);
      textSize(50);
      rect(0, 0, 100, 100);
      if (circles.length == maxCircles) {
        fill(circle.color);
      } else {
        fill(255);
      }
      text(circles.length, 10, 50);
    }
  }
}
