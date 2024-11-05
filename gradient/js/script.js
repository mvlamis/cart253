function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(0);

    // Here's our loop that goes from 0 (the left) to width (the right)
    // of the canvas. Let's call it x because that's what it is!
    // x stars at 0 (the left) and goes up by one (x++) until it reaches
    // the width
    for (let x = 0; x <= width; x++) {
        // Each time, we will draw a line vertically on the canvas at x
        push();
        // We will choose a colour for the line by mapping the current x
        // Which is between 0 and width
        // To a valid fill value, which is between 0 and 255
        let strokeColour = map(x, 0, width, 0, 255);
        stroke(strokeColour);
        // Draw the line
        line(x, 0, x, height);
        pop();
    }
}