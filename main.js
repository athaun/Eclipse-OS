/**
 *
 * Eclipse Operating System
 * version 4.2.3
 *
 * Copyright 2019
 * Eclipse Development Team
 * All right reserved
 * Code made available under the MIT license
 *
 **/
 


// Setup {
// Speeds things up for easier testing
var developerMode = false;
var clicked = false;
// Since not everything is supported on all canvas sizes we have a canvas size check
if(width !== 600 && height !== 500) {
    println("Eclipse OS might not display correctly with your canvas size. Consider switching to a 600 by 500 canvas for optimal results.");
}
// Used for some browsers (like firefox) to force them to render smoothly, without this, it is very pixelated
smooth();
// To keep frame rate uniform, i.e. animation won't be too fast
frameRate(60);

// }
// System {
/*
Colors object to be used whenever using background, fill or stroke. This is to make it easier to change the colors without having to go through the code and change every instance of the particular color.

Usage:

    fill(colors.red);
    
*/
var colors = {
    theme:      color(189, 0, 0),
    red:        color(255, 0, 0),
    green:      color(0, 143, 0),
    blue:       color(0, 0, 255),
    white:      color(255),
    yellow:     color(255, 255, 0),
    black:      color(0),
    grey:       color(170),
    darkgrey:   color(48, 48, 48),
    lightgrey:  color(196, 196, 196),
};
var system = {
    version: "4.2.2",
    // Only one user can be created as of now
    username: "Guest",
    password: "",
    font: "sans",
    // Time object to be used whenever displaying or printing time
    time: {
        // Set to null so it is easier to find out if they have not been updated
        hour: null,
        minute: null,
        second: null,
        // AM or PM
        timeStamp: null,
        /*
        Should be used whenever dealing with time. Format is "HH:MM AM/PM".
        
        Usage:
        
            println(system.time.formatted);
        
        */
        formatted: null,
        update: function() {
            this.hour = hour();
            this.minute = minute();
            this.second = second();
            if (this.minute < 10) {
                if (this.hour > 12) {
                    this.timeStamp = "PM";
                    this.formatted = this.hour - 12 + ":0" + this.minute + " " + this.timeStamp;
                } else {
                    this.timeStamp = "AM";
                    this.formatted = this.hour + ":0" + this.minute + " " + this.timeStamp;
                }
            } else {
                if (this.hour > 12) {
                    this.timeStamp = "PM";
                    this.formatted = this.hour - 12 + ":" + this.minute + " " + this.timeStamp;
                } else {
                    this.timeStamp = "AM";
                    this.formatted = this.hour + ":" + this.minute + " " + this.timeStamp;
                }
            }
        }
    },
    scene: "boot",
    // Works just like colors. The higher the number, the higher the brightness.
    screenBrightness: 0,
    loggedIn: true,
    // Stores all icons
    icons: [],
    // Stores all applications
    apps: [],
    // Stores system events such as scene changes, applications ran, etc.
    events: [],
};
var Mouse = {
    pressed: false,
    released: false,
    dragged: false
};
var Key = {
    pressed: false,
    code: null
};
var ms = millis();
var FPS = 0;
var updateTime = function() {
    if (frameCount % 60 === 0) {
        FPS = floor((60 / (millis() - ms)) * 1000);
        ms = millis();
    }
};

// }
// GUI {
// Library developed by Aliquis
// See https://github.com/athaun/Eclipse-OS/wiki/GUI-Elements

// Config {
var config = {
    audioFeedback: null,
    animationStep: 0.2,
    font: createFont(system.font, 16),
    strokeWeight: 1,
    symbolWeight: 3,
    fill: {
        accent: color(colors.theme),
        outline: color(colors.grey),
        background: color(colors.lightgrey),
        disabled: color(colors.grey),
        gradient: true
    },
    shadow: {
        min: 25,
        max: 27.5,
        fill: color(colors.black, 2.5)
    },
    gradient: {
        startColor: color(colors.white, 50),
        stopColor: color(colors.white, 0),
        size: 25
    }
};
config.tooltip = {
    w: 25,
    h: 25,
    r: 50,
    arrowHeight: 3,
    padding: 10
};
config.flatbutton = {
    w: 50,
    h: 50,
    fill: color(colors.black, 1),
    padding: 0
};
config.button = {
    w: 75,
    h: 30,
    r: 50
};
config.symbolbutton = {
    r: 20
};
config.radiobutton = {
    r: 10
};
config.checkbox = {
    w: 20,
    h: 20,
    r: 50
};
config.slider = {
    w: 150,
    r: 10,
    min: 0,
    max: 100
};
config.pane = {
    w: 100,
    h: 125,
    r: 10
};
config.dropdown = {
    w: 125,
    h: 25,
    r: 50,
    items: 4
};
config.textbox = {
    w: 200,
    h: 30,
    r: 50,
    max: 20,
    live: true,
    obfuscation: "•",
    placeholder: " Vocal Search"
};
// }
// Functions {
String.prototype.toTitleCase = function(str) {
    return this.replace(/\w\S*/g, function(word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
};
Array.prototype.except = function(val) {
    return this.filter(function(arr) { return arr !== val; });
};
var inherit = function (subClass, superClass) {
    Object.setPrototypeOf(subClass.prototype, superClass.prototype);
    subClass.prototype.constructor = subClass;
    if (superClass.prototype.constructor === Object) {
        superClass.prototype.constructor = superClass;
    }
};
var noop = function() {};
var blur = function(x, y, w, h, n) {
    image(get(x, y, w, h), x, y, w / n, h / n);
    image(get(x, y, w / n, h / n), x, y, w, h);
};
// }
// Symbols {
var symbols = {
    checkmark: function(x, y, scale) {
        scale = scale || 1;
        line(x - (5 * scale), y + (1 * scale), x - (1.75 * scale), y + (5 * scale));
        line(x - (1.75 * scale), y + (5 * scale), x + (5 * scale), y - (5 * scale));
    },
    arrow: function(x, y, scale) {
        scale = scale || 1;
        noFill();
        beginShape();
        vertex(x - (5 * scale), y - (2 * scale));
        vertex(x, y + (3 * scale));
        vertex(x + (5 * scale), y - (2 * scale));
        endShape();
    },
    info: function(x, y, scale) {
        scale = scale || 1;
        noFill();
        beginShape();
        vertex(x, y - (5 * scale), x, y - (5 * scale));
        vertex(x, y - (5 * scale), x, y - (5 * scale));
        endShape();
        beginShape();
        vertex(x, y);
        vertex(x, y + (5 * scale));
        endShape();
    }
};
// }
// Element {
var Element = function(params) {
    this.x = params.x;
    this.y = params.y;
    this.w = params.w || this.shape === ellipse && params.r * 2;
    this.h = params.h || this.shape === ellipse && params.r * 2;
    this.label = params.label;
    this.shape = params.shape;
    this.action = params.action;
    
    this.x2 = this.x + this.w / 2;
    this.y2 = this.y + this.h / 2;
    this.x3 = this.x + this.w;
    this.y3 = this.y + this.h;
    this.r = params.r;
    this.cursor = "DEFAULT";
    
    this.setX = function(x) {
        this.x = x;
        this.x2 = this.x + this.w / 2;
        this.x3 = this.x + this.w;
    };
    this.setY = function(y) {
        this.y = y;
        this.y2 = this.y + this.h / 2;
        this.y3 = this.y + this.h;
    };
    
    this.selected = false;
    this.focused = false;
    this.toggled = this.toggled || params.toggled || false;
    this.transition = 0;
    this.transition2 = 0;
};
Element.prototype = {
    disable: function() {
        this.disabled = true;
        this.color = this.fill;
        this.fill = config.fill.disabled;
    },
    enable: function() {
        this.disabled = false;
        this.fill = this.color;
    },
    drawShadow: function(args) {
        if(this.disabled) {
            return;   
        }
        pushStyle();
        noStroke();
        stroke(config.shadow.fill);
        noFill();
        for(var i = 0; i < map(this.transition, 0, 1, config.shadow.min, config.shadow.max); i++) {
            strokeWeight(sin(i) * i);
            if(this.shape === rect && !args) {
                (this.shape)(this.x + 1.5, this.y + 3, this.w - 4, this.h - 3, this.r);
            } else {
                ellipseMode(CORNER);
                (this.shape).apply(this, args);
            }
        }
        popStyle();
    },
    drawGradient: function() {
        if(!config.fill.gradient || this.disabled) {
            return;
        }
        pushStyle();
        strokeWeight(1);
        if(this.shape === rect) {
            for(var i = 0; i < config.gradient.size; i ++) {
                stroke(lerpColor(config.gradient.startColor, config.gradient.stopColor, map(i, 0, config.gradient.size, 0, 1)));
                line(this.x, this.y + i, this.x2 + this.w / 2, this.y + i);
            }
        } else {
            println("Only rect gradients are avalible.");
            noLoop();
        }
        popStyle();
    },
    animate: function() {
        if(this.selected || this.disabled) {
            this.transition -= config.animationStep * 2;
            this.transition2 += config.animationStep / 2;
        } else if(this.mouseOver()) {
            this.transition2 -= config.animationStep / 2;
            this.transition += config.animationStep;
            if(this.cursor !== "POINTER" && !this.noCursorChange) {
                 this.cursor = "POINTER";
                 cursor(this.cursor);
            }
        } else {
            this.transition2 -= config.animationStep;
            this.transition -= config.animationStep;
            if(this.cursor !== "DEFAULT" && !this.noCursorChange) {
                 this.cursor = "DEFAULT";
                 cursor(this.cursor);
            }
        }
        this.transition = constrain(this.transition, 0, 1);
        this.transition2 = constrain(this.transition2, 0, 1);
    },
    mouseOver: function() {
        return this.shape === rect ? (mouseX >= this.x && mouseX <= this.x3 && mouseY >= this.y && mouseY <= this.y3) : (dist(mouseX, mouseY, this.thumb ? this.thumb.x : this.x2, this.thumb ? this.thumb.y : this.y2) < this.r);
    },
    onmousepress: function() {
        if(this.mouseOver() && !this.disabled) {
            this.selected = true;
        } else {
            this.focused = false; 
        }
    },
    onmouserelease: function() {
        if(this.mouseOver() && this.selected && !this.disabled) {
            this.focused = true;
            this.toggled = !this.toggled;
            this.action();
            try {
                playSound(config.audioFeedback);
            } catch(error) {}
        }
        this.selected = false;
    },
    onmousedrag: noop,
    onmousescroll: noop,
    onkeypress: noop
};
// }

// Tooltip {
var Tooltip = function(params) {
    this.init = function() {
        params.label = this.label || params.label || "";
        params.shape = rect;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        textFont(config.font);
        params.w = max(textWidth(params.label) + config.tooltip.padding, config.tooltip.w);
        params.h = params.h || config.tooltip.h;
        params.r = config.tooltip.r;
        params.action = noop;
        Element.call(this, params);
        this.noCursorChange = true;
        this.disabled = this.disabled || params.disabled;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || color(colors.darkgrey, 200));
        this.bottom = this.y + this.h + config.tooltip.arrowHeight * 2 > height;
    };
    this.init();
};
Tooltip.prototype = {
    draw: function() {
        pushStyle();
        rectMode(CENTER);
        noStroke();
        fill(this.fill);
        if(this.bottom) {
            triangle(this.x, this.y, this.x - config.tooltip.arrowHeight, this.y - config.tooltip.arrowHeight, this.x + config.tooltip.arrowHeight, this.y - config.tooltip.arrowHeight);
        } else {
            triangle(this.x, this.y, this.x + config.tooltip.arrowHeight, this.y + config.tooltip.arrowHeight, this.x - config.tooltip.arrowHeight, this.y + config.tooltip.arrowHeight);
        }
        textAlign(CENTER, CENTER);
        textFont(config.font, 12.5);
        if(this.x - this.w / 2 < 5) {
            fill(this.fill);
            (this.shape)(this.x - (this.x - this.w / 2) + config.tooltip.arrowHeight, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2), this.w, this.h, this.r);
            fill(colors.white);
            text(this.label, this.x - (this.x - this.w / 2) + config.tooltip.arrowHeight, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2));
        } else if(this.x + this.w / 2 > width - 5) {
            fill(this.fill);
            (this.shape)(this.x - ((this.x + this.w / 2) - width) - config.tooltip.arrowHeight, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2), this.w, this.h, this.r);
            fill(colors.white);
            text(this.label, this.x - ((this.x + this.w / 2) - width) - config.tooltip.arrowHeight, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2));
        } else {
            fill(this.fill);
            (this.shape)(this.x, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2), this.w, this.h, this.r);
            fill(colors.white);
            text(this.label, this.x, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2));
        }
        popStyle();
    }
};
inherit(Tooltip, Element);
// }
// Flat Button {
var FlatButton = function(params) {
    this.init = function() {
        params.label = this.label || params.label || "";
        params.shape = params.shape || rect;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        textFont(config.font);
        params.w = params.w || params.r * 2 || config.flatbutton.w;
        params.h = params.h || params.r * 2 || config.flatbutton.h;
        params.r = params.shape === ellipse ? config.flatbutton.w / 2: null;
        params.action = params.action || noop;
        Element.call(this, params);
        this.disabled = this.disabled || params.disabled;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || config.flatbutton.fill);
        this.tooltip = new Tooltip({
            label: this.label,
            x: this.x2,
            y: constrain(this.y3 + 2, 0, height)
        });
        this.toggle = params.toggle || false;
        this.image = params.image || null;
        this.padding = params.padding || config.flatbutton.padding;
    };
    this.init();
};
FlatButton.prototype = {
    draw: function() {
        pushStyle();
        if(this.image) {
            this.image.draw(this.x + this.padding, this.y + this.padding);
        }
        ellipseMode(CORNER);
        rectMode(LEFT);
        noStroke();
        fill(lerpColor(this.fill, colors.black, this.transition / 10));
        (this.shape)(this.x, this.y, this.w, this.h);
        if (this.toggle && this.toggled) {
            fill(lerpColor(this.fill, colors.black, 0.1));
            (this.shape)(this.x, this.y, this.w, this.h);    
        }
        this.animate();
        if (this.mouseOver() && this.label !== "") {
            this.tooltip.draw();   
        }
        popStyle();
    }
};
inherit(FlatButton, Element); 
// }
// Button {
var Button = function(params) {
    this.init = function() {
        params.label = this.label || params.label || "";
        params.shape = rect;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        textFont(config.font);
        params.w = max(textWidth(params.label) + 40, config.button.w);
        params.h = params.h || config.button.h;
        params.r = config.button.r;
        params.action = params.action || noop;
        Element.call(this, params);
        this.disabled = this.disabled || params.disabled;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || config.fill.accent);
    };
    this.init();
};
Button.prototype = {
    draw: function() {
        pushStyle();
        this.drawShadow();
        rectMode(LEFT);
        ellipseMode(CORNER);
        strokeWeight(config.strokeWeight);
        noStroke();
        //stroke(this.disabled ? config.fill.outline : this.fill);
        fill(lerpColor(this.fill, color(colors.white), this.transition / 10));
        (this.shape)(this.x, this.y, this.w, this.h, this.r);
        this.drawGradient();
        fill(colors.white);
        textAlign(CENTER, CENTER);
        textFont(config.font);
        text(this.label, this.x2, this.y2);
        this.animate();
        popStyle();
    }
};
inherit(Button, Element);
// }
// Symbol Button {
var SymbolButton = function(params) {
    this.init = function() {
        params.shape = ellipse;
        params.label = params.label || "";
        params.x = this.x || params.x + config.symbolbutton.r || 0;
        params.y = this.y || params.y + config.symbolbutton.r|| 0;
        params.r = config.symbolbutton.r;
        params.action = params.action || noop;
        Element.call(this, params);
        this.disabled = this.disabled || params.disabled;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || config.fill.accent); 
        this.symbol = params.symbol || "?";
        this.tooltip = new Tooltip({
            label: this.label,
            x: this.x2,
            y: this.y3 + this.r + 2
        });
    };
    this.init();
};
SymbolButton.prototype = {
    draw: function() {
        pushStyle();
        this.drawShadow();
        ellipseMode(CENTER);
        noStroke();
        if(this.transition === 0) {
            strokeWeight(config.strokeWeight);
            stroke(config.fill.disabled);
        }
        fill(lerpColor(color(colors.black, 1), config.fill.accent, this.transition));
        (this.shape)(this.x, this.y, this.r * 2, this.r * 2);
        this.animate();
        if(typeof this.symbol === "string") {
            fill(lerpColor(config.fill.disabled, color(colors.white), this.transition));
            textAlign(CENTER, CENTER);
            textFont(config.font, 15);
            text(this.symbol, this.x2, this.y2);
        } else {
            strokeWeight(config.symbolWeight);
            stroke(lerpColor(config.fill.disabled, color(colors.white), this.transition));
            fill(lerpColor(config.fill.disabled, color(colors.white), this.transition));
            this.symbol(this.x2, this.y2, 1.5);   
        }
        if(this.mouseOver() && this.label !== "") {
            this.tooltip.draw();   
        }
        popStyle();
    }
};
inherit(SymbolButton, Element);
// }
// Textbox {
var Textbox = function(params) {
    this.init = function() {
        params.shape = rect;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        textFont(config.font);
        params.w = params.w || config.textbox.w;
        params.h = params.h || config.textbox.h;
        params.r = config.textbox.r;
        params.action = params.action || noop;
        Element.call(this, params);
        this.disabled = this.disabled || params.disabled;
        this.noCursorChange = true;
        this.live = params.live || config.textbox.live;
        this.inline = params.inline || false;
        this.text = params.text || "";
        this.placeholder = params.placeholder || config.textbox.placeholder;
        this.caret = 0;
        this.max = params.max || config.textbox.max;
        this.obfuscated = params.obfuscate || false;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || config.fill.accent);
    };
    this.init();
};
Textbox.prototype = {
    draw: function() {
        pushStyle();
        if(!this.inline && this.focused) {
            this.drawShadow();
        }
        rectMode(LEFT);
        ellipseMode(CORNER);
        strokeWeight(config.strokeWeight);
        stroke(this.inline ? (this.focused ? config.fill.outline : lerpColor(color(colors.black, 1), config.fill.outline, this.transition / 5)) : this.focused ? this.fill: config.fill.outline);
        fill(this.inline ? color(colors.black, 1) : lerpColor(color(colors.white), config.fill.disabled, this.transition / 10));
        (this.shape)(this.x, this.y, this.w, this.h, this.r);
        if(textWidth(this.text) > this.w - 10) {
            var n = this.text.length;
            var w = 0;
            for(var i = 0; i < this.text.length; i++) {
                w += textWidth(this.text.charAt(i));
                if(w > this.w - 20) {
                    n = i - 1;
                    break;
                }
            }
            this.label = this.obfuscated ? config.textbox.obfuscation.repeat(this.text.length).substring(this.text.length - n) : this.text.substring(this.text.length - n);
        } else {
            this.label = this.obfuscated ? config.textbox.obfuscation.repeat(this.text.length) : this.text;
        }
        fill(this.label === "" ? config.fill.disabled : 0);
        textAlign(LEFT, CENTER);
        textFont(config.font);
        text(this.label === "" && !this.focused? this.placeholder : this.label, this.x + 10, this.y2);
        if(this.mouseOver() && this.text.length > 0 && !keyIsPressed) {
            var caret = this.text.length;
            var complete = false;
            for(var i = 0; i < this.text.length; i++) {
                if(textWidth(this.text.substring(0, i)) - textWidth(this.text.substring(i - 1, i)) / 2 > mouseX - this.x - 10) {
                    caret = i - 1;
                    complete = true;
                    break;
                }
            }
            if(!complete) {
                caret = this.text.length;   
            }
            stroke(colors.black, 100);
            line(this.x + textWidth(this.label.substring(0, caret)) + 10, this.y + 6, this.x + textWidth(this.label.substring(0, caret)) + 10, this.y3 - 6);
        } else {
            stroke(floor((millis() % 500) / 250) === 0 && this.focused ? color(colors.black) : color(colors.black, 5));
            line(this.x + textWidth(this.label.substring(0, this.caret)) + 10, this.y + 6, this.x + textWidth(this.label.substring(0, this.caret)) + 10, this.y3 - 6);
        }
        this.animate();
        if(this.mouseOver()) {
            if(this.cursor !== "TEXT") {
                 this.cursor = "TEXT";
                 cursor(this.cursor);
            }
        } else {
            if(this.cursor !== "DEFAULT") {
                 this.cursor = "DEFAULT";
                 cursor(this.cursor);
            }
        }
        popStyle();
    },
    onkeypress: function() {
        var SPACE = 32;
        if(this.focused) {
            switch(Key.code) {
                case ENTER:
                    if(!this.live) {
                        this.action(); 
                    }
                    break;
                case BACKSPACE:
                    if(this.text.length > 0) {
                        this.text = this.text.substring(0, this.caret - 1) + this.text.substring(this.caret, this.text.length);
                        this.caret--;
                        this.caret = constrain(this.caret, 0, this.text.length);
                    }
                    break;
                case DELETE:
                    this.text = this.text.substring(0, this.caret) + this.text.substring(this.caret + 1, this.text.length);
                    break;
                case LEFT:
                    this.caret--;
                    this.caret = constrain(this.caret, 0, this.text.length);
                    break;
                case RIGHT:
                    this.caret++;
                    this.caret = constrain(this.caret, 0, this.text.length);
                    break;
                case 33:
                case 36:
                    this.caret = 0;
                    break;
                case 34:
                case 35:
                    this.caret = this.text.length;
                    break;
                case SPACE:
                    if(this.text.length < this.max) {
                        this.text = this.text.substring(0, this.caret) + " " + this.text.substring(this.caret, this.text.length);
                        this.caret++;
                    }
                    break;
                default:
                    if(Key.code < 48 || Key.code >= 112 && Key.code < 145 || Key.code >= 91 && Key.code <= 93 || [157, 155].includes(Key.code)) {
                        
                    } else if(this.text.length < this.max) {
                        this.text = this.text.substring(0, this.caret) + key.toString() + this.text.substring(this.caret, this.text.length);
                        this.caret++;   
                    }
            }
        }
        if(this.live) {
            this.action();
        }
    },
    onmouserelease: function() {
        if(this.mouseOver() && this.selected && !this.disabled) {
            this.focused = true;
            try {
                playSound(config.audioFeedback);
            } catch(error) {}
            var complete = false;
            for(var i = 0; i < this.text.length; i++) {
                if(textWidth(this.text.substring(0, i)) - textWidth(this.text.substring(i - 1, i)) / 2 > mouseX - this.x - 5) {
                    this.caret = i - 1;
                    complete = true;
                    break;
                }
            }
            if(!complete) {
                this.caret = this.text.length;   
            }
        }
        this.selected = false;
    }
};
inherit(Textbox, Element);
// }
// Radio Button {
var RadioButton = function(params) {
    this.init = function() {
        params.shape = ellipse;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        params.r = config.radiobutton.r;
        params.action = params.action || noop;
        Element.call(this, params);
        this.disabled = this.disabled || params.disabled;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || config.fill.accent);
    };
    this.init();
};
RadioButton.prototype = {
    draw: function() {
        pushStyle();
        strokeWeight(config.strokeWeight);
        if(this.disabled) {
            stroke(config.fill.outline);
            fill(config.fill.disabled);
        } else if(this.toggled) {
            stroke(this.fill);
            fill(lerpColor(this.fill, color(colors.white), this.transition / 10));
        } else if(!this.toggled) {
            stroke(config.fill.outline);
            fill(lerpColor(color(colors.white), color(colors.black), this.transition / 10));
        }
        ellipseMode(CORNER);
        (this.shape)(this.x, this.y, this.r * 2, this.r * 2);
        if(this.toggled) {
            stroke(this.fill);
            fill(this.disabled ? config.fill.outline : color(colors.white));
            ellipseMode(CENTER);
            (this.shape)(this.x2, this.y2, this.r, this.r);
        }
        this.animate();
        fill(this.disabled ? config.fill.disabled : color(colors.black));
        textAlign(LEFT, CENTER);
        textFont(config.font);
        text(this.label, this.x3 + 5, this.y2);
        popStyle();
    }
};
inherit(RadioButton, Element);
// }
// Checkbox {
var Checkbox = function(params) {
    this.init = function() {
        params.shape = rect;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        params.w = config.checkbox.w;
        params.h = config.checkbox.h;
        params.r = config.checkbox.r;
        params.action = params.action || noop;
        Element.call(this, params);
        this.disabled = this.disabled || params.disabled;
        this.toggled = this.toggled || params.toggled || false;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || config.fill.accent);
    };
    this.init();
};
Checkbox.prototype = {
    draw: function() {
        pushStyle();
        strokeWeight(config.strokeWeight);
        if(this.disabled) {
            stroke(config.fill.outline);
            fill(config.fill.disabled);
        } else if(this.toggled) {
            stroke(this.fill);
            fill(lerpColor(this.fill, color(colors.white), this.transition / 10));
        } else if(!this.toggled) {
            stroke(config.fill.outline);
            fill(lerpColor(color(colors.white), color(colors.black), this.transition / 10));
        }
        (this.shape)(this.x, this.y, this.w, this.h, this.r);
            this.drawGradient();
        if(this.toggled) {
            strokeWeight(config.symbolWeight);
            stroke(this.disabled ? config.fill.outline : color(colors.white));
            symbols.checkmark(this.x2, this.y2, 0.75);
        }
        this.animate();
        fill(this.disabled ? config.fill.disabled : color(colors.black));
        textAlign(LEFT, CENTER);
        textFont(config.font);
        text(this.label, this.x3 + 5, this.y2);
        popStyle();
    }
};
inherit(Checkbox, Element);
// }
// Slider {
var Slider = function(params) {
    this.init = function() {
        params.shape = ellipse;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        params.w = params.w || config.slider.w;
        params.h = config.slider.r * 2;
        params.r = config.slider.r;
        params.action = params.action || noop;
        Element.call(this, params);
        this.disabled = this.disabled || params.disabled;
        this.min = params.min || config.slider.min;
        this.max = params.max || config.slider.max;
        this.value = this.value || params.value || 0;
        this.value = constrain(this.value, this.min, this.max);
        this.thumb = {
            x: map(this.value, this.min, this.max, this.x + this.r, this.x3 - this.r),
            y: this.y + this.r
        };
        this.increment = params.increment || (params.precise && 0.1) || ((Math.log(this.max - this.min) * Math.LOG10E + 1 | 0) <= 1 ? 0.1 : 1);
        this.precise = params.precise || this.increment < 1;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || color(colors.white));
        this.textbox = new Textbox({
            x: this.x3 - 35,
            y: this.y - 25,
            w: 35,
            max: 3,
            inline: false
        });
    };
    this.init();
};
Slider.prototype = {
    draw: function() {
        pushStyle();
        stroke(config.fill.disabled);
        strokeWeight(config.strokeWeight * 2);
        line(this.x + 1, this.y2, this.x3 - 2, this.y2);
        stroke(!this.disabled ? config.fill.accent : config.fill.disabled);
        strokeCap(SQUARE);
        line(this.x, this.y2, this.thumb.x, this.y2);
        this.drawShadow([this.thumb.x - this.r + 3, this.thumb.y - this.r + 3, this.r * 2 - 5, this.r * 2 - 3.5]);
        strokeWeight(config.strokeWeight / 1.5);
        stroke(!this.disabled ? lerpColor(color(colors.white), color(colors.black), 0.1) : config.fill.outline);
        fill(lerpColor(this.fill, color(colors.black), this.transition / 50));
        ellipseMode(CENTER);
        (this.shape)(this.thumb.x, this.thumb.y, this.r * 2 * (this.transition / 10 + 1), this.r * 2 * (this.transition / 10 + 1));
        this.animate();
        fill(this.disabled ? config.fill.disabled : color(colors.black));
        textAlign(LEFT, BOTTOM);
        textFont(config.font);
        text(this.label, this.x, this.y);
        if(this.label && !this.disabled) {
            fill(colors.lightgrey);
            textAlign(RIGHT, BOTTOM);
            //this.textbox.draw();
            text(this.precise ? this.value.toFixed(1) : round(this.value), this.x3, this.y);
        }
        popStyle();
    },
    onmousepress: function() {
        if(this.mouseOver() && !this.disabled) {
            this.selected = true;
        } else {
            this.focused = false; 
        }
        this.textbox.onmousepress();
    },
    onmouserelease: function() {
        if(this.mouseOver() && this.selected && !this.disabled) {
            this.focused = true;
            try {
                this.toggled = this.toggled ? false : true;
            } catch(error) {}
            this.action();
            try {
                playSound(config.audioFeedback);
            } catch(error) {}
        }
        this.selected = false;
        this.textbox.onmouserelease();
    },
    onmousedrag: function() {
        if(this.selected) {
            this.thumb.x = constrain(mouseX, this.x + this.r, this.x3 - this.r);
            this.value = map(this.thumb.x, this.x + this.r, this.x3 - this.r, this.min, this.max);
            this.action();
        }
    },
    onkeypress: function() {
        if(this.focused) {
            if([LEFT, DOWN, 189, 109].includes(Key.code)) {
                this.value = constrain(this.value - this.increment, this.min, this.max);
                this.thumb.x = map(this.value, this.min, this.max, this.x + this.r, this.x3 - this.r);
            } else if([RIGHT, UP, 187, 107].includes(Key.code)) {
                this.value = constrain(this.value + this.increment, this.min, this.max);
                this.thumb.x = map(this.value, this.min, this.max, this.x + this.r, this.x3 - this.r);
            } else if([188, 219].includes(Key.code)) {
                this.value = this.min;
                this.thumb.x = map(this.value, this.min, this.max, this.x + this.r, this.x3 - this.r);
            } else if([190, 221].includes(Key.code)) {
                this.value = this.max;
                this.thumb.x = map(this.value, this.min, this.max, this.x + this.r, this.x3 - this.r);
            } else if(!isNaN(String.fromCharCode(Key.code))) {
                this.value = map(String.fromCharCode(Key.code), 0, 10, this.min, this.max);
                this.thumb.x = map(this.value, this.min, this.max, this.x + this.r, this.x3 - this.r);
            }
        }
        this.textbox.onkeypress();
    }
};
inherit(Slider, Element);
// }
// Radiolist {
var radioOptions;
var Radiolist = function(params) {
    this.init = function() {
        params.shape = rect;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        params.w = 100;
        params.h = params.options * 2 + 5;
        params.action = params.action || noop;
        Element.call(this, params);
        this.options = params.options || {};
        this.optionsLength = Object.keys(this.options).length;
        this.radioButtons = [];
        for(var option in this.options) {
            this.radioButtons.push(new RadioButton({
                label: option.toTitleCase(),
                x: this.x,
                y: this.y,
                toggled: this.options[option]
            }));
        }
        for(var i = 0; i < this.optionsLength; i++) {
            if(this.radioButtons[i].toggled) {
                this.selectedOption = this.radioButtons[i].label;
            }
            this.radioButtons[i].y = this.radioButtons[i].y + (config.radiobutton.r * 2 + 5) * i;
            this.radioButtons[i].init();
        }
    };
    this.init();
};
Radiolist.prototype = {
    draw: function() {
        this.radioButtons.forEach(function(element) {
            element.draw();
        });
    },
    onmousepress: function() {
        this.radioButtons.forEach(function(element) {
            element.onmousepress();
        });
        if(this.mouseOver() && !this.disabled) {
            this.selected = true;
        } else {
            this.focused = false; 
        }
    },
    onmouserelease: function() {
        if(this.mouseOver() && this.selected && !this.disabled) {
            this.focused = true;
        }
        this.selected = false;
        
        var selectedOption = this.selectedOption;
        this.radioButtons.forEach(function(element) {
            element.onmouserelease();
            if(element.mouseOver()) {
                selectedOption = element.label;
            }
        });
        this.radioButtons.forEach(function(element) {
            element.toggled = element.label === selectedOption;
            debug(element);
        });
        this.selectedOption = selectedOption;
    },
    onkeypress: function() {
        if(this.focused) {
            if(Key.code === UP) {
                println(true);
            }
        }
    }
};
inherit(Radiolist, Element);
// }
// Checklist {
var checkBoxOptions;
var Checklist = function(params) {
    this.init = function() {
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        params.action = params.action || noop;
        Element.call(this, params);
        this.options = params.options || {};
        this.optionsLength = Object.keys(this.options).length;
        this.checkboxes = [];
        for(var option in this.options) {
            this.checkboxes.push(new Checkbox({
                label: option.toTitleCase(),
                x: this.x,
                y: this.y,
                toggled: this.options[option]
            }));
        }
        for(var i = 0; i < this.optionsLength; i++) {
            this.checkboxes[i].y = this.y + (config.checkbox.h + 5) * i;
            this.checkboxes[i].init();
        }
    };
    this.init();
};
Checklist.prototype = {
    draw: function() {
        this.checkboxes.forEach(function(element) {
            element.draw();
        });
    },
    onmousepress: function() {
        this.checkboxes.forEach(function(element) {
            element.onmousepress();
        });
    },
    onmouserelease: function() {
        this.checkboxes.forEach(function(element) {
            element.onmouserelease();
        });
        for(var i = 0; i < this.optionsLength; i++) {
            checkBoxOptions[Object.keys(this.options)[i]] = this.checkboxes[i].toggled;
        }
    }
};
inherit(Checklist, Element);
// }
// Pane {
var Pane = function(params) {
    this.init = function() {
        params.shape = rect;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        params.w = params.w || config.pane.w;
        params.h = params.h || config.pane.h;
        params.r = config.pane.r;
        params.action = params.action || noop;
        Element.call(this, params);
        this.fill = this.fill || params.fill || config.fill.accent;
    };
    this.init();
};
Pane.prototype = {
    draw: function() {
        pushStyle();
        this.drawShadow();
        strokeWeight(config.strokeWeight);
        stroke(config.fill.background);
        fill(config.fill.background);
        rect(this.x, this.y, this.w, this.h, this.r);
        this.animate();
        popStyle();
    }
};
inherit(Pane, Element);
// }
// ToggleButton {
var ToggleButton = function(params) {
    this.init = function() {
        params.label = this.label || params.label || "";
        params.shape = rect;
        params.x = this.x || params.x + 1|| 0;
        params.y = this.y || params.y || 0;
        params.w = config.dropdown.w - 1;
        params.h = params.h || config.dropdown.h;
        params.r = config.button.r;
        params.action = params.action || noop;
        Element.call(this, params);
        this.disabled = this.disabled || params.disabled;
        this.noCursorChange = true;
        this.toggled = this.toggled || params.toggled || false;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || config.fill.accent);
    };
    this.init();
};
ToggleButton.prototype = {
    draw: function() {
        pushStyle();
        rectMode(LEFT);
        noStroke();
        fill(this.toggled ? this.fill : lerpColor(color(colors.black, 1), color(colors.black, 75), this.transition / 5));
        (this.shape)(this.x, this.y, this.w, this.h, 50);
        fill(this.toggled ? color(colors.white) : color(colors.black));
        textAlign(LEFT, CENTER);
        textFont(config.font);
        textSize(13.5);
        text(this.label, this.x + 5, this.y2);
        this.animate();
        popStyle();
    }
};
inherit(ToggleButton, Element);
// }
// Dropdown {
var dropOptions;
var Dropdown = function(params) {
    this.init = function() {
        params.label = this.label || params.label || undefined;
        params.shape = rect;
        params.x = this.x || params.x || 0;
        params.y = this.y || params.y || 0;
        textFont(config.font);
        params.w = max(textWidth(params.label) + 40, config.dropdown.w);
        params.h = params.h || config.dropdown.h;
        params.r = config.dropdown.r;
        params.action = params.action || noop;
        Element.call(this, params);
        this.options = params.options || {};
        this.optionsLength = Object.keys(this.options).length;
        this.toggleButtons = [];
        for(var option in this.options) {
            this.toggleButtons.push(new ToggleButton({
                label: option.toTitleCase(),
                x: this.x,
                y: this.y,
                toggled: false
            }));
        }
        for(var i = 0; i < this.optionsLength; i++) {
            this.toggleButtons[i].y = this.y + this.h + config.dropdown.h * i + 1;
            this.toggleButtons[i].init();
        }
        var label;
        this.toggleButtons.forEach(function(element) {
            element.onmouserelease();
            if(element.toggled) {
                label = element.label;
            }
        });
        this.label = label;
        this.disabled = this.disabled || params.disabled;
        this.toggled = false;
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || config.fill.accent);
    };
    this.init();
};
Dropdown.prototype = {
    draw: function() {
        pushStyle();
        this.drawShadow([this.x + 1.5, this.y + 3, this.w - 4, this.h + lerp(0, this.h * this.optionsLength, constrain(this.transition2 * 2, 0, 1)) - 3, 5]);
        strokeWeight(config.strokeWeight);
        stroke(config.fill.outline);
        fill(colors.white);
        rect(this.x, this.y, this.w, this.h + lerp(0, this.h * this.optionsLength, constrain(this.transition2 * 2, 0, 1)), 5);
        noStroke();
        fill(lerpColor(lerpColor(this.fill, color(colors.white), this.transition / 10), color(colors.white), this.transition2));
        rect(this.x3 - 8, this.y + 1, 8, this.h - 1, this.r);
        rect(this.x3 - 25, this.y + 1, 20, this.h - 1);
        this.drawGradient();
        strokeWeight(config.symbolWeight);
        stroke(lerpColor(color(colors.white), config.fill.disabled, this.transition2));
        pushMatrix();
        translate(this.x3 - 12.5, this.y2);
        rotate(lerp(0, 180, this.transition2));
        symbols.arrow(0, 0);
        popMatrix();
        fill((this.label === undefined) ? config.fill.disabled : color(colors.black));
        textFont(config.font);
        textSize(15);
        textAlign(LEFT, CENTER);
        text(!this.label ? "Select..." : this.label, this.x + 7.5, this.y2);
        if(this.selected) {
            strokeWeight(config.strokeWeight);
            stroke(config.fill.background);
            line(this.x + 5, this.y3, this.x3 - 5, this.y3);
            if(this.transition2 !== 1) {
                for(var i = 0; i < this.optionsLength; i++) {
                    this.toggleButtons[i].y = this.y + this.h + lerp(0, config.dropdown.h, constrain(this.transition2 * 2, 0, 1) * i);
                    this.toggleButtons[i].init();
                }
            }
            this.toggleButtons.forEach(function(element) {
                element.draw();
            });
        }
        this.animate();
        popStyle();
    },
    onmousepress: function() {
        if(this.mouseOver() && !this.disabled) {
            this.selected = true;
        }
        if(!this.toggled) {
            return;
        }
        this.toggleButtons.forEach(function(element) {
            element.onmousepress();
        });
    },
    onmouserelease: function() {
        if(this.mouseOver() && this.selected && !this.disabled) {
            try {
                if(this.toggled) {
                    this.selected = false;   
                }
                this.toggled = this.toggled ? false : true;
            } catch(error) {}
            this.action();
            try {
                playSound(config.audioFeedback);
            } catch(error) {}
            if(this.cursor !== "DEFAULT") {
                this.cursor = "DEFAULT";
                cursor(this.cursor);   
            }
        } else {
            this.selected = false;
            this.toggled = false;
            if(this.cursor !== "DEFAULT") {
                this.cursor = "DEFAULT";
                cursor(this.cursor);   
            }
        }
        //This is a mess
        var toUnselect;
        for(var i = 0; i < this.optionsLength; i++) {
            if(this.toggleButtons[i].selected && this.toggleButtons[i].mouseOver()) {
                toUnselect = this.toggleButtons.except(this.toggleButtons[i]);
            }
        }
        var toUnselectLength = -1;
        for(var element in toUnselect) {
            toUnselectLength++;
        }
        if(toUnselect !== this.toggleButtons && toUnselectLength !== this.optionsLength && toUnselectLength > 0) {
            for(var i = 0; i < this.optionsLength; i++) {
                this.toggleButtons[i].toggled = false;
            }
        }
        var label;
        this.toggleButtons.forEach(function(element) {
            element.onmouserelease();
            if(element.toggled) {
                label = element.label;
            }
        });
        this.label = label;
        for(var i = 0; i < this.optionsLength; i++) {
            dropOptions[Object.keys(this.options)[i]] = this.toggleButtons[i].toggled;
        }
    }
};
inherit(Dropdown, Element);
// }
// }
// Icon object {
    var Icon = function (name, sprite) {
        /*
        Icon object to be used whenever displaying icons, wether that be using KA's images or using shapes. Icons are to be stored in the `system.icons` array.
        
        Usage:
        
            var icon = new Icon("Icon Name", function() {
                // Load code
            }, function() {
                // Draw code
            });
            // Icon loads in boot
            draw = function() {
                icon.draw(x, y);
            };
            
        */
        this.name = name;
        this.sprite = sprite;
        this.load = function() {
            (background)(0, 0);
            // No error check is needed for `load` since it is already done in the `boot` function
            this.sprite();
            this.icon = get(0, 0, width, height);
        };
        this.draw = function(x, y) {
            try {
                image(this.icon, x, y);
            } catch(error) {
                println("\nError displaying image(this.icon) \n" + error);
            }
        };
    };
// }
// Icons {
var placeholderIcon = new Icon("Placeholder", function() {
    noStroke();
    fill(colors.lightgrey);
    ellipseMode(CORNER);
    ellipse(0, 0, 45, 45);
    stroke(colors.grey);
    strokeWeight(1);
    noFill();
    line(22.5, 0, 22.5, 44);
    line(0, 22.5, 44, 22.5);
    ellipseMode(CENTER);
    ellipse(23, 23, 30, 30);
});
var eclipseLogo = new Icon("Eclipse Logo", function() {
    scale(1.25);
    noStroke();
    fill(colors.yellow);
    ellipseMode(CORNER);
    ellipse(0, 0, 25, 25);
    fill(colors.black);
    arc(6, 0, 13, 25, 90, 270);
    arc(-1, 0, 26, 25, 270, 450);
    ellipseMode(CENTER);
});
var materialBackground1 = new Icon("Material Background 1", function() {
    noStroke();
    fill(colors.theme);
    triangle(0, 0, 301, 100, 200, 300);
    fill(lerpColor(colors.theme, colors.black, 0.3));
    triangle(566, 0, 300, 100, 200, 299);
    fill(lerpColor(colors.theme, colors.black, 0.2));
    triangle(572, 0, 0, 0, 299, 101);
    fill(lerpColor(colors.theme, colors.black, 0.1));
    triangle(0, 0, 0, 600, 201, 299);
    fill(lerpColor(colors.yellow, colors.red, 0.2));
    triangle(925, 601, -2, 600, 200, 299);
    fill(lerpColor(colors.yellow, colors.red, 0.3));
    triangle(1424, 601, 441, 600, 200, 299);
    fill(lerpColor(colors.yellow, colors.red, 0.4));
    triangle(925, 600, 600, 451, 200, 299);
    fill(lerpColor(colors.yellow, colors.red, 0.3));
    triangle(607, 887, 600, 451, 200, 299);
    fill(colors.yellow);
    triangle(60, 600, 40, 451, 200, 299);
    fill(lerpColor(colors.yellow, colors.red, 0.4));
    triangle(65, 600, 217, 500, 200, 299);
    fill(colors.theme);
    triangle(564, 0, 600, 0, 300, 299);
    fill(lerpColor(colors.theme, colors.black, 0.1));
    triangle(561, 4, 197, 300, 300, 302);
    fill(lerpColor(colors.theme, colors.black, 0.2));
    triangle(610, 401, 197, 299, 300, 300);
    fill(lerpColor(colors.theme, colors.white, 0.2));
    triangle(600, 0, 492, 363, 295, 299);
    fill(lerpColor(colors.theme, colors.black, 0.3));
    triangle(600, 0, 491, 364, 602, 399);
});
var materialBackground2 = new Icon("Material Background 2", function() {
    background(colors.theme);
	for (var i = 1; i < 16; i++) {
		strokeWeight(1.1 * i);
		stroke(colors.black, 7.5);
		triangle(0, -70, 300, 0, 250, 125);
		triangle(0, -100, 325, 195, 0, 425);
	}
	noStroke();
	fill(colors.yellow);
	triangle(0, -100, 325, 195, 0, 425);
	triangle(0, -70, 300, 0, 250, 126);
	for (var i = 1; i < 16; i++) {
		//strokeCap(SQUARE);
		stroke(colors.black, 25);
		strokeWeight(4 * i);
		line(750, -10, 250, 425);
		stroke(194, 0, 0, 50);
		strokeWeight(50);
		stroke(120, 0, 0);
		line(750, -10, 250, 425);
		strokeWeight(1.1 * i);
		stroke(colors.black, 50);
		line(750, -10, 250, 425);
		strokeWeight(10);
		stroke(colors.yellow);
		line(750, -10, 250, 425);
		stroke(colors.black, 1.5);
		strokeWeight(0.3 * i);
		line(90, -3, 330, 195);
	}
});
var navigationBack = new Icon("Nav. Back", function() {
    noStroke();
    fill(colors.darkgrey);
    triangle(2, 7.5, 15, 0, 15, 15);
});
var navigationHomeIcon = new Icon("Nav. Home", function() {
    noStroke();
    fill(colors.darkgrey);
    rect(0, 0, 15, 15, 2.5);
});
var dockExpandIcon = new Icon("Dock Expand", function() {
    var weight = 5;
    translate(weight / 2, weight / 2);
    stroke(colors.darkgrey);
    strokeWeight(weight);
    line(0, 10, 12, 0);
    line(12, 0, 24, 10); 
});
system.icons = [placeholderIcon, eclipseLogo, materialBackground1, materialBackground2, navigationBack, navigationHomeIcon, dockExpandIcon];
// }
// App object {
var App = function(name, load, draw) {
    /*
    App object to be used whenever making an application, widget or scene. Apps are to be stored in the `system.apps` array.
    
    Usage:
    
        var appName = new App("App Name", function() {
            // Load code
        }, function() {
            // Draw code
        });
        // App loads in boot
        draw = function() {
            app.draw();
        };
        
    */
    this.name = name;
    // No error check is needed for the `load` method since it is already done in the `boot` function
    this.load = load;
    // No error check is needed for the `draw` method since it is already done in the `draw` function
    this.draw = draw;
};
// }
// Apps {
// Taskbar app {
var taskbar = new App("Taskbar", function() {
    // Width and height of taskbar normaly
    var normalW = 400;
    var normalH = 60;
    // Height of taskbar on mouse over
    var hoverH = 80;
    // Height of taskbar when tranformed to app drawer
    var expandW = 500;
    var expandH = 300;
    // Minimum distance between canvas edge and tasskbar
    this.margin = 10;
    // Minimum distance between taskbar edge and apps
    this.padding = 5;
    this.w = normalW;
    this.h = normalH;
    /*
    x and y-coordinates stored as seperate variables as `this.x` and `this.y` properties will change during animations
    */
    var normalX = width / 2 - this.w / 2;
    var normalY = height - this.h - this.margin;
    this.x = normalX;
    this.y = normalY;
    // Calculate how much the taskbar has to move up to accomodate for height increase
    var hoverY = normalY - (hoverH - normalH);
    this.elements = [];
    // For demo purposes
    for(var i = 0; i < 7; i++) {
        this.elements.push(new FlatButton({
            shape: ellipse,
            x: (this.x + 27.5) + 50 * i,
            y: height - (taskbar.h + 2.5),
            r: 22.5,
            image: placeholderIcon
        }));
    }
    var backButton = new FlatButton({
        x: this.x + this.padding,
        y: this.y + this.padding,
        w: 20,
        h: 20,
        image: navigationBack,
        padding: 2
    });
    var homeButton = new FlatButton({
        x: this.x + this.padding + 20,
        y: this.y + this.padding,
        w: 20,
        h: 20,
        image: navigationHomeIcon,
        padding: 2
    });
    var expandButton = new FlatButton({
        x: this.x + this.w / 2 - 16,
        y: this.y + this.padding,
        w: 32,
        h: 20,
        image: dockExpandIcon,
        padding: 2,
        action: function() {
            taskbar.onexpand();
        }
    });
    this.navigationElements = [backButton, homeButton, expandButton];
    // for(var i in this.navigationElements) {
    //     this.navigationElements[i].x = this.x + this.padding + i * 17;   
    //     this.navigationElements[i].init();
    // }
    this.appDrawerElements = [];
    // For demo purposes
    for(var i = 1; i <= 2; i++) {
        for(var j = 0; j < 7; j++) {
            this.appDrawerElements.push(new FlatButton({
                shape: ellipse,
                x: (expandW - normalW - 10) + 60 * j,
                y: 90 + 80 * i,
                r: 22.5,
                image: placeholderIcon
            }));
        }
    }
    this.mouseOver = function() {
        return (mouseX > this.x && mouseY > this.y && mouseX < this.x + this.w && mouseY < this.y + this.h);
    };
    // For animations guide see https://github.com/athaun/Eclipse-OS/wiki/Animations-within-Applications
    this.animations = [];
    this.hovered = false;
    this.onmouseover = function() {
		this.hovered = true;
        var transition = 0;
        this.animations.push(function() {
            transition += 0.1;
            transition = constrain(transition, 0, 1);
            this.h = lerp(normalH, hoverH, transition);
            this.y = lerp(normalY, hoverY, transition);
            return transition >= 1;
        });
    };
    this.onmouseout = function() {
		this.hovered = false;
        var transition = 0;
        this.animations.push(function() {
            transition += 0.1;
            transition = constrain(transition, 0, 1);
            this.h = lerp(hoverH, normalH, transition);
            this.y = lerp(hoverY, normalY, transition);
            return transition >= 1;
        });
    };
    this.expanded = false;
    this.onexpand = function() {
        this.expanded = true;
        var transition = 0;
        this.animations.push(function() {
            transition += 0.1;
            transition = constrain(transition, 0, 1);
            this.x = lerp(expandW - normalW, (expandW - normalW) / 2, transition);
            this.w = lerp(normalW, expandW, transition);
            this.y = lerp(hoverY, 50, transition);
            this.h = lerp(hoverH, expandH, transition);
            for(var i = 0; i < this.elements.length; i++) {
                this.elements[i].setX((this.x + 40) + 60 * i);
                this.elements[i].setY(this.y + 40);
            }
            return transition >= 1;
        });
    };
    this.onshrink = function() {
        this.expanded = false;
		this.hovered = false;
        var transition = 0;
        this.animations.push(function() {
            transition += 0.1;
            transition = constrain(transition, 0, 1);
            this.x = lerp((expandW - normalW) / 2, expandW - normalW, transition);
            this.w = lerp(expandW, normalW, transition);
            this.y = lerp(50, normalY, transition);
            this.h = lerp(expandH, normalH, transition);
            for(var i = 0; i < this.elements.length; i++) {
                this.elements[i].setX((this.x + 27.5) + 50 * i);
                this.elements[i].setY(height - (this.h + 2.5));
            }
            return transition >= 1;
        });
    };
}, function() {
    // For animations guide see https://github.com/athaun/Eclipse-OS/wiki/Animations-within-Applications
    for(var i = this.animations.length; i--;) {
        if (this.animations[i].call(this)){
            // Remove that animation, stopping it
            this.animations.splice(i, 1);
        }
    }
    if (!this.expanded) {
        if (this.mouseOver() && !this.hovered) {
            this.onmouseover();
        } else if (!this.mouseOver() && this.hovered) {
            this.onmouseout();
        }
        if (this.hovered) {
            // Draw navigation elements when mouse is over taskbar
            for(var i = 0; i < this.navigationElements.length; i++) {
                this.navigationElements[i].y = this.y + this.padding;
                this.navigationElements[i].draw();
            }
            if(Mouse.pressed) {
                this.navigationElements.forEach(function(element) {
                    element.onmousepress();
                });
            }
            if(Mouse.released) {
                this.navigationElements.forEach(function(element) {
                    element.onmouserelease();
                });
            }
            fill(colors.darkgrey);
            textAlign(RIGHT, CENTER);
            textFont(system.font, 12);
            text(system.time.formatted, this.x + this.w - this.padding * 2, this.y + 30 / 2);
        }
    } else {
        this.appDrawerElements.forEach(function(element) {
            element.draw();
        });
        if(Mouse.pressed) {
        this.appDrawerElements.forEach(function(element) {
            element.onmousepress();
        });
        }
        if(Mouse.released) {
            this.appDrawerElements.forEach(function(element) {
                element.onmouserelease();
            });
        }
        if (Mouse.released) {
            this.onshrink();
        }
    }
    noStroke();
    // blur(this.x, this.maxY, this.w, this.minH, 25);
    fill(colors.white, 125);
    rect(this.x, this.y, this.w, this.h, 10);
    this.elements.forEach(function(element) {
        element.draw();
    });
    if(Mouse.pressed) {
        this.elements.forEach(function(element) {
            element.onmousepress();
        });
    }
    if(Mouse.released) {
        this.elements.forEach(function(element) {
            element.onmouserelease();
        });
    }
});
system.apps = [taskbar];
// }
// }
// Window Manager {
    // scrollbar{
        var scrollBoundsWidth = 1,
            scrollBoundsHeight = 1,
            scrollBoundsX = 0,
            scrollBoundsY = 0;
        var canScroll = true;
        var isScrolling = false;
        if (scrollBoundsWidth < 0.5) {
            scrollBoundsWidth = 0.5;
        }
        if (scrollBoundsHeight < 0.5) {
            scrollBoundsHeight = 0.5;
        }
        var Scrollbar = function(paramX, paramY, windowWidth, windowHeight, textLength, isListening) {
            this.grip_size = 4;
            this.x = paramX;
            this.y = paramY;
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
            this.textLength = textLength;
            this.position = 0;
            this.gripHeight = null;
            this.scrollSpeed = 10;
            this.isListening = isListening; // is the parent window active?
            
            Scrollbar.prototype.draw = function() {
                
                this.gripHeight = (this.windowHeight / this.textLength) * this.grip_size;
                
                pushMatrix();
                translate(this.x, this.y);
                rectMode(CORNER);
                fill(204, 204, 204);
                rect(this.windowWidth - 15, 0, 15, this.windowHeight);
                fill(158, 158, 158);
                rect(this.windowWidth - 11, this.position, 7, this.gripHeight, 10);
            
                popMatrix();
                
                if(mouseX > ((this.windowWidth + this.x) - 15) && mouseX < (this.windowWidth + this.x) && canScroll && this.isListening) {
                    cursor("pointer");
                    if(mouseIsPressed) {
                        if( (mouseY - this.y) < this.position - 3 ||
                            (mouseY - this.y) > this.position + this.gripHeight + 3) {
                            isScrolling = true;
                            if((mouseY - this.y) < this.position) {
                                this.position -= this.scrollSpeed;
                            } else {
                                this.position += this.scrollSpeed;
                            }   
                        }
                    } else {
                        isScrolling = false;
                    }
                }
            
            };
            
            Scrollbar.prototype.currentPosition = function() {
                return this.position;
            };
            Scrollbar.prototype.currentYposition = function() {
                return this.y;
            };
            
        };
        
        var scrollbarOne = new Scrollbar(scrollBoundsX, scrollBoundsY, scrollBoundsWidth * 400, scrollBoundsHeight * 400, 31);
        var scrollbarAbout = new Scrollbar(scrollBoundsX, scrollBoundsY, scrollBoundsWidth * 400, scrollBoundsHeight * 400, 31);
        // possibly pass scollbounds parameters in as one object, or bypass adding as parameter alltogethor
    // }
    var w = [];
    var autoresize = false;
    var createWindow = function(type, x, y, wi, h, windowName) {
        var D = {};
        if (type === 0) {
            D = {
                x: 0,
                y: 0
            };
        }
        w.push({
            lastclick: w.length,
            type: type,
            img: 0,
            x: x,
            y: y,
            w: wi,
            h: h,
            minw: 150,
            minh: 150,
            d: D,
            id: w.length,
            windowName: windowName,
            open: true,
            active: false
        });
    };
    var moving = -1;
    var resizing = -1;
    var inside = -1;
    var latestimg = 0;
    var toggleMaximize = false;// has a specific windows maximize button been clicked?
    var toggleMaximizeDown = false;
    var maximizeId = null;
    var maximized = null;
    var minimize = false;
    var minimizeId = null;
    var minimizedWindows = [];
    var windowID;// each windows specific ID (can only be used inside of the for() that creates and updates each window this is a immutable value, do not change)
    
    var Window = function(x, y, w, h, t, d, windowdata) {
        var D = d;
        if (t === 0) {
        scrollbarAbout.x = x;
        scrollbarAbout.y = y;
        scrollbarAbout.windowWidth = w;
        scrollbarAbout.windowHeight = h;
        background(255, 255, 255);
        pushMatrix();
        translate(0, 0 - scrollbarAbout.currentPosition());
            eclipseLogo.draw(x + 10, y + 10);
            fill(40);
            textSize(20);
            text("Eclipse OS", x + 41, y + 26);
            textSize(13);
            text("Release " + system.version + "\n\nCopyright 2018-2019, MIT License\nAll rights reserved. Credit all code taken from this project to the Eclipse OS develompent team. ", x + 10, y + 53, windowdata.w - 20, windowdata.h - 20);
            // text("WindowData " + windowdata.id + "\nResolution " + width + " by " + height + "\nCurrent FPS: " + FPS, x + 10, y + 105);
            
        popMatrix();
        // scrollbarAbout.draw();   
            
            
        }
        if (t === 1) {
            
            scrollbarOne.x = x;
            scrollbarOne.y = y;
            scrollbarOne.windowWidth = w;
            scrollbarOne.windowHeight = h;
    
            background(31, 31, 31);
            noStroke();
    
            pushMatrix();
            translate(0, 0 - scrollbarOne.currentPosition());
            // scale(l, 1);
            noStroke();
            textSize(14);
            fill(255, 213, 0);
            text("User@Eclipse-OS #", x + 5, y + 18);
            popMatrix();
            scrollbarOne.draw();
            scrollbarOne.isListening = windowdata.active;
            
            // println("mouseY: " + (mouseY - scrollbar.currentYposition()) + " || pos: " + scrollbar.currentPosition());
        }
        if (t === 3) {
        // EXAMPLE APP
            // scrollbarName.x = x;
            // scrollbarName.y = y;
            // scrollbarName.windowWidth = w;
            // scrollbarName.windowHeight = h;
            
            pushMatrix();
            background(255, 255, 255);
            eclipseLogo.draw(x + 10, y + 10);
            
            fill(40);
            textSize(20);
            text("Welcome to Eclipse OS!", x + 45, y + 33);
            textSize(13);
            text("Eclipse OS began as a concept, basically just a graphic. At 286 lines, it had almost no interactive features. Slowly, both the codebase and our amazing development team grew. We released three major versions, our lines of code numbered in the thousands. At that point, we realized\n. . .\nit was time for change. \nINTRODUCING! Eclipse OS Nighthawk!\n• A brand new codebase! Written with efficiency in mind.\n• An all new window manager!\n• A Whole new suite of apps!\n• Vocal is back, and better than ever!", x + 10, y + 53, windowdata.w - 20, windowdata.h - 20);
                
            popMatrix();
            // scrollbarName.draw();   
        }
        latestimg = get(x, y, w, h);
    };
    var resortWindows = function() {
        w.sort(function(a, b) {
            return a.lastclick - b.lastclick;
        });
    };
    
    createWindow(0, 100, 100, 250, 200, "about");
    createWindow(1, 150, 150, 250, 200, "Terminal");
    createWindow(3, 150, 100, 300, 300, "Welcome!");
    
    var handleWindows = function () {
        textAlign("top", "left");
        for (var i = 0; i < w.length; i++) {
            var W = w[i];
            Window(W.x, W.y, W.w, W.h, W.type, w[i].d, W);
            W.img = latestimg;
        }
        // anything drawn behind the windows (ie the desktop and dock) need to be called here, 
        materialBackground1.draw();
        
        textAlign("top", "left");
        for (var i = 0; i < w.length; i++) {
            // windowId is used only in some cases, while othertimes just 'w[i]' is used, this is because w[i] is dynamic, and changes whenever the user clicks inside the window, windowId is not.
            var windowId = w[i].id;
            {
                fill(189, 47, 47);
                image(w[i].img, w[i].x, w[i].y, w[i].w, w[i].h);//window
                
                fill(168, 168, 168, 150);
                rect(w[i].x, w[i].y - 20, w[i].w, 22);//shadow
                
                fill(255);
                rect(w[i].x, w[i].y - 20, w[i].w, 20, 5);//title
                rect(w[i].x, w[i].y - 10, w[i].w, 10);//title
                
                fill(0);
                textSize(12);
                text(w[i].windowName, w[i].x + 5, w[i].y - 5);// title bar text (window's name)
            } // draws window
            
            {   
                fill(255, 0, 0);
                if(dist(mouseX, mouseY, w[windowId].x + w[windowId].w - 12, w[windowId].y - 14) < 6) {
                    fill(255, 100, 100);
                    canScroll = false;// diables scroling in an attempt to keep the scrollbar from moving when the user closes the window (this is a dirty fix, and a permanent one should be applied within the scollbar class)
                    cursor("pointer");
                    if(clicked) {
                        w[windowId].open = false;
                        w[windowId].y = height + 100;
                    }
                } else {
                    canScroll = true;
                    // re-enable scrolling after mouse has moved away from button or window has closed
                }// checks if mouse is within minimize button radius
                
                ellipse(w[i].x + w[i].w - 12, w[i].y - 14, 8, 8);// close button
            } // close button
            
            {
                /** 
                    restore = toggle maximize
                */
                fill(148);
                if(dist(mouseX, mouseY, w[windowId].x + w[windowId].w - 24, w[windowId].y - 14) < 6) {
                    fill(189);
                    cursor("pointer");
                    if(clicked) {
                        toggleMaximize = true;
                        maximizeId = windowId;
                    }
                }// checks if mouse is within restore button radius
                
                ellipse(w[i].x + w[i].w - 24, w[i].y - 14, 8, 8);// maximize button
                
                if (toggleMaximize) {
                    var done = [false, false, false, false];
                    var movementSpeed = 15;
                    w[maximizeId].x -= movementSpeed;
                    w[maximizeId].y -= movementSpeed;
                    w[maximizeId].w += movementSpeed + 5;
                    w[maximizeId].h += movementSpeed + 5;
                    
                    if (w[maximizeId].x <= 0) {
                        w[maximizeId].x = 0;
                        done[0] = true;
                    }
                    
                    if (w[maximizeId].y <= 20) {
                        w[maximizeId].y = 20;
                        done[1] = true;
                    }
                    
                    if (w[maximizeId].w >= width) {
                        w[maximizeId].w = width;
                        done[2] = true;
                    }
                    
                    if (w[maximizeId].h >= height) {
                        w[maximizeId].h = height;
                        done[3] = true;
                    }
                    
                    if (done[0] && done[1] && done[2] && done[3]) {
                        toggleMaximize = false;
                        done = [false, false, false, false];
                        maximized = maximizeId; // the currently maximized window
                        maximizeId = -1;
                    }
                    
                    if(dist(mouseX, mouseY, w[windowId].x + w[windowId].w - 23, w[windowId].y - 10) < 6) {
                        fill(189);
                        cursor("pointer");
                        if(clicked) {
                            toggleMaximizeDown = true;
                            maximizeId = windowId;
                            // println("restore");
                        }
                    }// checks if mouse is within restore button radius
                } else {
                    fill(148);
                    
                    if (toggleMaximizeDown) {
                        var done = [false, false, false, false];
                        var movementSpeed = 15;
                        w[maximizeId].x += movementSpeed;
                        w[maximizeId].y += movementSpeed;
                        w[maximizeId].w -= movementSpeed * 2;
                        w[maximizeId].h -= movementSpeed * 2;
                        
                        if (w[maximizeId].x >= width/2 - w[maximizeId].w/2) {
                            w[maximizeId].x = width/2 - w[maximizeId].w/2;
                            done[0] = true;
                        }
                        
                        if (w[maximizeId].y >= height/2 - w[maximizeId].h/2) {
                            w[maximizeId].y = height/2 - w[maximizeId].h/2;
                            done[1] = true;
                        }
                        
                        if (w[maximizeId].w <= w[maximizeId].minw + 100) {
                            w[maximizeId].w = w[maximizeId].minw + 100;
                            done[2] = true;
                        }
                        
                        if (w[maximizeId].h <= w[maximizeId].minh + 50) {
                            w[maximizeId].h = w[maximizeId].minh + 50;
                            done[3] = true;
                        }
                        
                        if (done[0] && done[1] && done[2] && done[3]) {
                            toggleMaximizeDown = false;
                            done = [false, false, false, false];
                            maximizeId = -1;
                        }
                    } 
                }
            } // minimize/maximize button    
        
            {
                fill(158);
                if(dist(mouseX, mouseY, w[windowId].x + w[windowId].w - 36, w[windowId].y - 14) < 6) {
                    fill(189);
                    cursor("pointer");
                    if(clicked) {
                        minimize = true;
                        minimizeId = windowId;
                    }
                } // checks if mouse is within minimize button radius
                ellipse(w[i].x + w[i].w - 36, w[i].y - 14, 8, 8);// minimize button
                
                if (minimize) {
                    
                    w[minimizeId].y += 25;
                    if (w[minimizeId].y > height + 100) {
                        w[minimizeId].y = height + 100;
                        minimize = false;
                        minimizeId = -1;
                        minimizedWindows.push(minimizeId);
                    }
                }
    
            } // minimize 
    
            {
                // When the user is over the window
                if (mouseX > w[i].x && mouseX < w[i].x + w[i].w && mouseY > w[i].y - 20 && mouseY < w[i].y && moving !== i) {
                    cursor("arrow");
                    canScroll = true;
                } else {
                    canScroll = false;
                }
        
                // When the user is moving the window, change the position by the change of x and y.
                if (moving === i && !isScrolling) {
                    w[i].x += mouseX - pmouseX;
                    w[i].y += mouseY - pmouseY;
                    resizing = -1;
                    cursor("grab");
                    maximized = false;// if the window is moved and maximized, this wil turn maximized off, otherwise the window will jump back to the top as soon as the mous is released
                    toggleMaximize = false;// this is related to maximized, set to false for the same reasons
                    canScroll = false;// disable scrolling of all windows when moving any window
                    
                } else {
                    canScroll = true;// re-enable scolling after user is done moving windows 
                }
                if (resizing === i) {
                    w[i].w += mouseX - pmouseX;
                    w[i].h += mouseY - pmouseY;
                    moving = -1;
                    w[i].w = constrain(w[i].w, 200, width);
                    w[i].h = constrain(w[i].h, 200, height);
                    cursor("nwse-resize");
                    canScroll = false; // prevents scrolling in any window while a window is moving
                }
                if (resizing !== i && moving !== i && !maximized && !toggleMaximize) {
                    w[i].y = constrain(w[i].y, 20, height + 100);
                    if (mouseX > w[i].x + w[i].w && mouseX < w[i].x + w[i].w + 10 && mouseY > w[i].y + w[i].h && mouseY < w[i].y + w[i].h + 10) {
                        cursor("nwse-resize");
                    }
                }
            } // window handler
            
        }
        w[0].y = 600; // hide the about page
        w[1].y = 600; // hide the terminal
        taskbar.draw();
    };
    // usage: createWindow(windowID, x, y, width, height, "name");
// }

// Boot {
var loading = {
    // Which asset is being loading in the `assets` array
    index: 0,
    // Loading progress, 0 to 100
    progress: 0,
    complete: false
};
var boot = function() {
    // Animation is based on frame count, won't replay when program is editted
    var animation = constrain(frameCount, 0, 360);
    // Skip animation if `developerMode` is true
    if(developerMode) {
        animation = 360;
    }
    // Merge `system.icons` and `system.apps`
    var assets = system.icons.concat(system.apps);
    if(loading.index < assets.length) {
        try {
            pushMatrix();
            pushStyle();
            assets[loading.index].load();
            popStyle();
            popMatrix();
        } catch(error) {
            println(error);
        }
        loading.index++;
        loading.progress = constrain(map(loading.index, 0, assets.length, 0, 100), 0, 100);
    }
    // Boot animation
    background(colors.black);
    pushMatrix();
    // Rotate from 30 to 0 degrees
    rotate(map(animation, 0, 360, 30, 0));
    // Make it appear as if the sun is moving around
    translate(map(sin(animation), -1, 1, -100, 100), map(sin(animation), -1, 1, -25, 25));
    noStroke();
    fill(lerpColor(color(colors.yellow, 0), colors.yellow, constrain(animation / 100, 0, 1)));
    // Sun
    ellipse(width / 2, height / 2.5, animation / 1.5, animation / 1.5);
    fill(colors.black);
    // Planets passing by
    ellipse(width - animation * 2, animation, 100, 100);
    ellipse(width + 400 - animation * 3, animation + 50, 50, 50);
    // Planet that eclipses sun
    ellipse(map(animation, 0, 360, width * 2, width - 175), height / 2.5, animation, animation);
    // Glow of sun after being eclipsed, not shown until animation is over
    // Starts to increase at frame 380
    var glow = constrain(map(frameCount, 380, 400, 0, 2.5), 0, 4);
    stroke(255, 242, 0);
    noFill();
    if(animation === 360 || developerMode) {
        // No glow if frame count is not more than 380
        if(glow === 0) {
            noStroke();
        }
        if(frameCount < 400) {
            strokeWeight(glow);
        } else {
            // Make glow pulse after shown
            strokeWeight(map(sin(frameCount * 2), -1, 1, 2, 4));
        }
        // Ellipse drawn over eclipse, with no fill. Used to show glow as stroke
        ellipse(width / 2, height / 2.5, animation / 1.5, animation / 1.5);
        if(!loading.complete) {
            // Loading spinner
            strokeWeight(constrain(map(frameCount, 380, 400, 0, 2.5), 0, 2.5));
            arc(width / 2, 425, 25, 25, 0 + frameCount * 8, 75 + sin(frameCount * 5) * 75 + frameCount * 8);
        }
        // Show percentage if frame count is greater than 400 or developer mode
        if((frameCount > 400 && loading.progress < 100) || developerMode) {
            fill(colors.white);
            textAlign(CENTER);
            text(round(loading.progress) + "%", width / 2, 475);
        }
    }
    popMatrix();
    // Change scenes after animation and loading is complete or developer mode 
    if((frameCount > 500 || developerMode) && loading.progress === 100) {
        loading.complete = true;
        system.scene = "login";
    }
};
// }
// Drawing {
var draw = function() {
    updateTime();
    cursor(ARROW);
    background(colors.white);
    textAlign(LEFT);
    try {
        switch(system.scene) {
            case "boot":
                boot();
                break;
            case "login":
                system.scene = "desktop";
                break;
            case "desktop":
                handleWindows();
                break;
            default:
                println("Unknown scene \"" + system.scene + "\".");
        }
    } catch(error) {
        println(error);   
    }
    // Update the time in the `system` object every frame, should be at beginning of the `draw` loop
    system.time.update();
    
    
    
    /* 
        Set the `released` value of `Mouse` to `false` so `released` is only true for one frame after Mouse is released || `key.pressed` is set to `false` for the same reason as `Mouse.released`.
        these must be placed at the very bottom of the draw
    */

    if (!mouseIsPressed) {
        moving = -1;
        resizing = -1;
    }
    clicked = false;
    // Update the time in the `system` object every frame, should be at beginning of the `draw` loop
    system.time.update();
    /* 
        Set the `released` value of `Mouse` to `false` so `released` is only true for one frame after         Mouse is released || `key.pressed` is set to `false` for the same reason as `Mouse.released`.
        these must be placed at the very bottom of the draw
    */
    Mouse.released = false;
    Key.pressed = false;
};
// }
// Event Handling {

mousePressed = function() {
    Mouse.pressed = true;
    for (var i = w.length - 1; i >= 0; i--) {
        var W = w[i];
        if (mouseX > W.x - 5 && mouseX < W.x + W.w + 10 && mouseY > W.y - 20 && mouseY < W.y + W.h + 25) {
            W.lastclick = millis();
            W.active = true;
            resortWindows();
            return;
        } else {
            W.active = false;
        }
    }
    scrollbarOne.mousePressed();
    scrollbarAbout.mousePressed();
};
mouseReleased = function() {
    Mouse.pressed = false;
    Mouse.dragged = false;
    Mouse.released = true;
};
mouseDragged = function() {
    Mouse.dragged = true;
    for (var i = w.length - 1; i >= 0; i--) {
        var W = w[i];
        if (resizing !== i && moving !== i) {
            if (mouseX > W.x + W.w && mouseX < W.x + W.w + 10 && mouseY > W.y + W.h && mouseY < W.y + W.h + 10 && moving === -1 && resizing === -1) {
                resizing = i;
            }
            if (mouseX > W.x - 5 && mouseX < W.x + W.w + 5 && mouseY > W.y - 20 && mouseY < W.y && moving === -1 && resizing === -1) {
                moving = i;
            }
        }
    }
    scrollbarAbout.mouseScrolled();
    scrollbarOne.mouseScrolled();// must be applied to each scollbar individually, maybe a possible feature update later to update all at once??
};
mouseOut = function() {
    Mouse.pressed = false;
    Mouse.dragged = false;
};


keyPressed = function() {
    Key.pressed = true;
    Key.code = keyCode;
};

mouseClicked = function() {
    clicked = true;
};
// }
