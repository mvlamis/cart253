
function setup() {
    createCanvas(1000, 1000);
    background(100,100,255);
}

function draw() {
    strokeWeight(0);
    fill(30, 150, 0);
    rect(200, 300, 200, 400);
    fill(255, 255, 255);
    rect(400, 300, 200, 400);
    fill(255, 0, 0);
    rect(600, 300, 200, 400);
}