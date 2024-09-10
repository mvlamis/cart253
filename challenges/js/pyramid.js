
function setup() {
    createCanvas(1000, 1000);
    background(100,100,255);
}

function draw() {
    strokeWeight(0);
    fill(255, 255, 0);
    ellipse(100, 700, 1000, 1000);
    ellipse (700, 900, 1000, 1000);
    fill(200,200,0);
    triangle(300, 500, 400, 600, 400, 300);
    fill(200,200,200);
    triangle(400, 600, 500, 500, 400, 300);
}