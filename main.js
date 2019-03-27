/**
 *
 * Eclipse Operating System Alpha
 * version 10.0#
 *
 * Copyright 2019
 * Eclipse Development Team
 * All right reserved
 * Code made available under the MIT license
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

var clicked = false;
mousePressed = function() {
    clicked = true;
};
mouseReleased = function() {
    clicked = false;
};

var Icon = function (name, sprite) {
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
    this.name = name;
    this.sprite = sprite;
    this.draw = function() {
        try {
            this.sprite();
        } catch(error) {
            // Prints out error if `this.sprite` is not a function
            println("Error displaying icon " + name + "\n");
            println(error);
        }
    };
};
var App = function(name, init, draw) {
    /*
    App object to be used whenever making an application, widget or scene.
    Usage:
    
        var app = new App("App Name", function() {
            // Init code
        }, function() {
            // Draw code
        });
        app.init();
        draw = function() {
            app.draw();
        };
        
    */
    this.name = name;
    this.init = init;
    this.draw = draw;
};

var iconOne = new Icon("One", function() {
    noStroke();
    fill(colors.theme);
    ellipse(200, 200, 100, 100);
});
var appOne = new App("One", function() {
    this.x = 1;
}, function() {
    fill(colors.black);
    text(system.time.formattedTime, this.x, 20);
    if(frameCount % 50 === 0) {
        this.x += 20;
        if(this.x > width) {
            this.x = 0;
        }
    }
});
appOne.init();

var draw = function() {
    background(colors.white);
    iconOne.draw();
    appOne.draw();
    // Update the time in the `system` object every frame
    system.time.update();
};
