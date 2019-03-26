
/**
 * 
 * Eclipse Operating System Alpha
 * 
 * Copyright 2019
 * Eclipse Development Team
 * All right reserved
 * 
 **/

// Used for some browsers to force them to render smoothly, without this, it is very pixelated
smooth();

/* 
Colors object to be used whenever using background, fill or stroke. This is to make it easier to change the colors without hacing to go through the code and change every instance of the particular color.

Usage:

fill(colors.red);

*/
var colors = {
    red:        color(255, 0, 0),
    green:      color(0, 143, 0),
    blue:       color(0, 0, 255),
    white:      color(255),
    black:      color(0),
    grey:       color(170),
    theme:      color(189, 0, 0),   // Eclipse OS default dark red theme
    darkgrey:   color(48, 48, 48),
    lightgrey:  color(196, 196, 196),
};

var system = {
    // Only one user can be created as of now
    user: "Guest",
    password: "",
    // Time object to be used whenever displaying or printing time
    time: {
        // Set to null so it is easier to find out if they have not been updated
        hour: null,
        minute: null,
        second: null,
        // AM or PM
        timeStamp: null,
        formattedTime: null,
        update: function() {
            this.hour = hour();
            this.minute = minute();
            this.second = second();
            if (this.minute < 10) {
                if (this.hour > 12) {
                    this.timeStamp = "PM";
                    this.formattedTime = this.hour - 12 + ":0" + this.minute + " " + this.timeStamp;
                } else {
                    this.timeStamp = "AM";
                    this.formattedTime = this.hour + ":0" + this.minute + " " + this.timeStamp;
                }
            } else {
                if (this.hour > 12) {
                    this.timeStamp = "PM";
                    this.formattedTime = this.hour - 12 + ":" + this.minute + " " + this.timeStamp;
                } else {
                    this.timeStamp = "AM";
                    this.formattedTime = this.hour + ":" + this.minute + " " + this.timeStamp;
                }
            }
        }
    },
    scene: "logo",
    version: "Alpha 0.2",
    // Works just like colors. The higher the number, the higher the brightness.
    screenBrightness: 0,
    loggedIn: true,
    // Stores system events such as scene changes, applications ran, etc.
    events: []
};

// Still deciding on wether to use Mouse object or multiple variables like pressesd, released, etc.

// var clicked = false;
// mousePressed = function() {
//     clicked = true;
// };
// mouseReleased = function() {
//     clicked = false;
// };

/*
Icon object to be used whenever displaying icons, wether that be using KA's images or using shapes.

Usage:

var img = new Image("Image Name", function() {
    // Draw code 
});
draw = function() {
    img.draw();
};

*/
var Icon = function (name, sprite) {
    this.name = name;
    this.sprite = sprite;
    Icon.prototype.draw = function() {
        try {
            this.sprite();
        } catch(error) {
            // Prints out error if `this.sprite` is not a function
            println(error);
        }
    };
};
var IconOne = new Icon("One", function() {
    noStroke();
    fill(colors.theme);
    ellipse(200, 200, 100, 100);
});

var draw = function() {
    background(colors.white);
    IconOne.draw();
    // Update the time in the `system` object every frame
    system.time.update();
    // For debugging purposes
    println(system.time.formattedTime);
};
