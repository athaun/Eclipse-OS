/**
 * 
 * Eclipse Operating System Alpha
 * 
 * Copyright 2019
 * Eclipse Development Team
 * All right reserved
 * 
 **/

// Setup (this initialized and or declares system variables)
smooth();// used in some browsers to force them to render smoothly (without this, it is very pixelated)

var colors = {
    red:        color(255, 0, 0),
    green:      color(0, 143, 0),
    blue:       color(0, 0, 255),
    white:      color(255, 0, 0),
    black:      color(255, 0, 0),
    grey:       color(255, 0, 0),
    theme:      color(189, 0, 0), // Eclipse OS default dark red theme
    darkgrey:   color(48, 48, 48),
    lightgrey:  color(196, 196, 196),
}; // these are system colors that must be used in apps for continuity across system, access like fill(colors.red);
var system = {
  user: "Eclipse Basic User",
  password: "",
  time: {
      hour: hour(),
      minute: minute(),
      second: second(),
      timeStamp: "", // AM or PM
      currentTime: ""
  },
  scene: "logo",
  back_ground: 1,
  version: "V. 2019",
  screenBrightness: 0, // full brightness = 0; absolute dimness (black) = 255
  loggedIn: true,
  events: [] // push events that should be noted like user opened app, or user changed password
};
var vocal = {
    greeting: "Hello " + system.user + ", my name is Vocal, your personal assistant. How may I be of assistance?",
    response: "..."
};

var setClock = function() {
    
    if (system.time.minute < 10) {
        if (system.time.hour > 12) {
            system.time.timeStamp = "PM";
            system.time.currentTime = system.time.hour - 12 + ":0" + system.time.minute + " " + system.time.timeStamp;
        } else {
            system.time.timeStamp = "AM";
            system.time.currentTime = system.time.hour + ":0" + system.time.minute + " " + system.time.timeStamp;
        }
    } else {
        if (system.time.hour > 12) {
            system.time.timeStamp = "PM";
            system.time.currentTime = system.time.hour - 12 + ":" + system.time.minute + " " + system.time.timeStamp;
        } else {
            system.time.timeStamp = "AM";
            system.time.currentTime = system.time.hour + ":" + system.time.minute + " " + system.time.timeStamp;
        }
    }
    
};

var clicked = false;

mousePressed = function() {
    clicked = true;// sets clicked to true only while the mouse si beging clicked
};
mouseReleased = function() {
    clicked = false;// as soon as user releases the mouse button, set clicked to false
};

var Icon = function (X, Y, Width, Height, name) {
    // icon constructor
    this.x = X;
    this.y = Y;
    this.width = Width;
    this.height = Height;
    
    Icon.prototype.draw = function() {
        
        fill(colors.red);
        noStroke();
        ellipse(this.x, this.y, this.width, this.height);
        
    };
};

var IconOne = new Icon(100, 100, 100, 100);

var draw = function() {
    IconOne.draw();
    setClock();//refreshes the clock every time draw is called
    println(system.time.currentTime);
};














