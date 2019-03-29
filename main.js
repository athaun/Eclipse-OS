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

// Event Handling {
var Mouse = {
    pressed: false,
    released: false,
    dragged: false
};
mousePressed = function() {
    Mouse.pressed = true;
};
mouseReleased = function() {
    Mouse.pressed = false;
    Mouse.dragged = false;
    Mouse.released = true;
};
mouseDragged = function() {
    Mouse.dragged = true;  
};
mouseOut = function() {
    Mouse.pressed = false;
    Mouse.dragged = false;
};
var Key = {
    pressed: false,
    code: null
};
keyPressed = function() {
    Key.pressed = true;
    Key.code = keyCode;
};
//}

// GUI {
/*
See https://github.com/athaun/Eclipse-OS/wiki/GUI-Elements
*/
//Config {
var config = {
    audioFeedback: null,
    animationStep: 0.2,
    font: createFont("sans-serif", 16),
    strokeWeight: 1,
    symbolWeight: 3,
    fill: {
        accent: color(184, 0, 0),
        outline: color(200),
        background: color(240),
        disabled: color(175),
        gradient: true
    },
    shadow: {
        min: 25,
        max: 27.5,
        fill: color(0, 0, 0, 2.5)
    },
    gradient: {
        startColor: color(255, 255, 255, 50),
        stopColor: color(255, 255, 255, 0),
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
config.button = {
    w: 75,
    h: 30,
    r: 50
};
config.symbolbutton = {
    r: 15
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
//}
//Functions {
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
//}
//Symbols {
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
//}
// GUI Element functions {
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
//}

//Tooltip {
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
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || color(194, 194, 194, 200));
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
            fill(255);
            text(this.label, this.x - (this.x - this.w / 2) + config.tooltip.arrowHeight, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2));
        } else if(this.x + this.w / 2 > width - 5) {
            fill(this.fill);
            (this.shape)(this.x - ((this.x + this.w / 2) - width) - config.tooltip.arrowHeight, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2), this.w, this.h, this.r);
            fill(255);
            text(this.label, this.x - ((this.x + this.w / 2) - width) - config.tooltip.arrowHeight, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2));
        } else {
            fill(this.fill);
            (this.shape)(this.x, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2), this.w, this.h, this.r);
            fill(255);
            text(this.label, this.x, this.y + (this.h / 2) + config.tooltip.arrowHeight - (this.bottom && this.h + config.tooltip.arrowHeight * 2));
        }
        popStyle();
    }
};
inherit(Tooltip, Element);
//}
//Button {
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
        fill(lerpColor(this.fill, color(255), this.transition / 10));
        (this.shape)(this.x, this.y, this.w, this.h, this.r);
        this.drawGradient();
        fill(255);
        textAlign(CENTER, CENTER);
        textFont(config.font);
        text(this.label, this.x2, this.y2);
        this.animate();
        popStyle();
    }
};
inherit(Button, Element);
//}
//Symbol Button {
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
        fill(lerpColor(color(0, 0, 0, 1), config.fill.accent, this.transition));
        (this.shape)(this.x, this.y, this.r * 2, this.r * 2);
        this.animate();
        if(typeof this.symbol === "string") {
            fill(lerpColor(config.fill.disabled, color(255), this.transition));
            textAlign(CENTER, CENTER);
            textFont(config.font, 15);
            text(this.symbol, this.x2, this.y2);
        } else {
            strokeWeight(config.symbolWeight);
            stroke(lerpColor(config.fill.disabled, color(255), this.transition));
            fill(lerpColor(config.fill.disabled, color(255), this.transition));
            this.symbol(this.x2, this.y2, 1);   
        }
        if(this.mouseOver() && this.label !== "") {
            this.tooltip.draw();   
        }
        popStyle();
    }
};
inherit(SymbolButton, Element);
//}
//Textbox {
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
        this.obfusticated = params.obfusticate || false;
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
        stroke(this.inline ? (this.focused ? config.fill.outline : lerpColor(color(0, 0, 0, 1), config.fill.outline, this.transition / 5)) : this.focused ? this.fill: config.fill.outline);
        fill(this.inline ? color(0, 0, 0, 1) : lerpColor(color(255), config.fill.disabled, this.transition / 10));
        (this.shape)(this.x, this.y, this.w, this.h, this.r);
        if(textWidth(this.text) > this.w - 5) {
            var n = this.text.length;
            var w = 0;
            for(var i = 0; i < this.text.length; i++) {
                w += textWidth(this.text.charAt(i));
                if(w > this.w - 20) {
                    n = i - 1;
                    break;
                }
            }
            this.label = this.obfusticated ? config.textbox.obfuscation.repeat(this.text.length).substring(this.text.length - n) : this.text.substring(this.text.length - n);
        } else {
            this.label = this.obfusticated ? config.textbox.obfuscation.repeat(this.text.length) : this.text;
        }
        fill(this.label === "" ? config.fill.disabled : 0);
        textAlign(LEFT, CENTER);
        textFont(config.font);
        text(this.label === "" && !this.focused? this.placeholder : this.label, this.x + 5, this.y2);
        if(this.mouseOver() && this.text.length > 0 && !keyIsPressed) {
            var caret = this.text.length;
            var complete = false;
            for(var i = 0; i < this.text.length; i++) {
                if(textWidth(this.text.substring(0, i)) - textWidth(this.text.substring(i - 1, i)) / 2 > mouseX - this.x - 5) {
                    caret = i - 1;
                    complete = true;
                    break;
                }
            }
            if(!complete) {
                caret = this.text.length;   
            }
            stroke(0, 0, 0, 100);
            line(this.x + textWidth(this.label.substring(0, caret)) + 5, this.y + 6, this.x + textWidth(this.label.substring(0, caret)) + 5, this.y3 - 6);
        } else {
            stroke(floor((millis() % 500) / 250) === 0 && this.focused ? color(0) : color(0, 0, 0, 5));
            line(this.x + textWidth(this.label.substring(0, this.caret)) + 5, this.y + 6, this.x + textWidth(this.label.substring(0, this.caret)) + 5, this.y3 - 6);
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
//}
//Radio Button {
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
            fill(lerpColor(this.fill, color(255), this.transition / 10));
        } else if(!this.toggled) {
            stroke(config.fill.outline);
            fill(lerpColor(color(255), color(0), this.transition / 10));
        }
        ellipseMode(CORNER);
        (this.shape)(this.x, this.y, this.r * 2, this.r * 2);
        if(this.toggled) {
            stroke(this.fill);
            fill(this.disabled ? config.fill.outline : color(255));
            ellipseMode(CENTER);
            (this.shape)(this.x2, this.y2, this.r, this.r);
        }
        this.animate();
        fill(this.disabled ? config.fill.disabled : color(0));
        textAlign(LEFT, CENTER);
        textFont(config.font);
        text(this.label, this.x3 + 5, this.y2);
        popStyle();
    }
};
inherit(RadioButton, Element);
//}
//Checkbox {
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
            fill(lerpColor(this.fill, color(255), this.transition / 10));
        } else if(!this.toggled) {
            stroke(config.fill.outline);
            fill(lerpColor(color(255), color(0), this.transition / 10));
        }
        (this.shape)(this.x, this.y, this.w, this.h, this.r);
            this.drawGradient();
        if(this.toggled) {
            strokeWeight(config.symbolWeight);
            stroke(this.disabled ? config.fill.outline : color(255));
            symbols.checkmark(this.x2, this.y2, 0.75);
        }
        this.animate();
        fill(this.disabled ? config.fill.disabled : color(0));
        textAlign(LEFT, CENTER);
        textFont(config.font);
        text(this.label, this.x3 + 5, this.y2);
        popStyle();
    }
};
inherit(Checkbox, Element);
//}
//Slider {
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
        this.fill = this.disabled ? config.fill.disabled : (this.fill || params.fill || color(255));
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
        stroke(!this.disabled ? lerpColor(color(255), color(0), 0.1) : config.fill.outline);
        fill(lerpColor(this.fill, color(0), this.transition / 50));
        ellipseMode(CENTER);
        (this.shape)(this.thumb.x, this.thumb.y, this.r * 2 * (this.transition / 10 + 1), this.r * 2 * (this.transition / 10 + 1));
        this.animate();
        fill(this.disabled ? config.fill.disabled : color(0));
        textAlign(LEFT, BOTTOM);
        textFont(config.font);
        text(this.label, this.x, this.y);
        if(this.label && !this.disabled) {
            fill(100);
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
//}
//Radiolist {
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
//}
//Checklist {
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
//}
//Pane {
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
//}
//ToggleButton {
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
        fill(this.toggled ? this.fill : lerpColor(color(0, 0, 0, 1), color(0, 0, 0, 75), this.transition / 5));
        (this.shape)(this.x, this.y, this.w, this.h, 50);
        fill(this.toggled ? color(255) : color(0));
        textAlign(LEFT, CENTER);
        textFont(config.font);
        textSize(13.5);
        text(this.label, this.x + 5, this.y2);
        this.animate();
        popStyle();
    }
};
inherit(ToggleButton, Element);
//}
//Dropdown {
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
        fill(255);
        rect(this.x, this.y, this.w, this.h + lerp(0, this.h * this.optionsLength, constrain(this.transition2 * 2, 0, 1)), 5);
        noStroke();
        fill(lerpColor(lerpColor(this.fill, color(255), this.transition / 10), color(255), this.transition2));
        rect(this.x3 - 8, this.y + 1, 8, this.h - 1, this.r);
        rect(this.x3 - 25, this.y + 1, 20, this.h - 1);
        this.drawGradient();
        strokeWeight(config.symbolWeight);
        stroke(lerpColor(color(255), config.fill.disabled, this.transition2));
        pushMatrix();
        translate(this.x3 - 12.5, this.y2);
        rotate(lerp(0, 180, this.transition2));
        symbols.arrow(0, 0);
        popMatrix();
        fill((this.label === undefined) ? config.fill.disabled : color(0));
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
//}
//}
// icons and icon loading {
    var Icon = function (name, sprite) {
        /*
        Icon object to be used whenever displaying icons, wether that be using KA's images or using shapes.
        Usage:

            var icon = new Icon("Icon Name", function() {
                // Load code
            }, function() {
                // Draw code
            });
            icon.load();
            draw = function() {
                icon.draw();
            };

        */
        this.name = name;
        this.sprite = sprite;
        this.load = function() {
            (background)(0, 0);
            try {
                this.sprite();
            } catch(error) {
                // Prints out error if `this.sprite` is not a function
                println(error);
            }
            this.icon = get(0, 0, width, height);
        };
        this.draw = function(x, y) {
            try {
                image(this.icon, x, y);
            } catch(error) {
                println(error);
            }
        };
    };

}
var App = function(name, load, draw) {
    /*
    App object to be used whenever making an application, widget or scene.
    Usage:
    
        var app = new App("App Name", function() {
            // Load code
        }, function() {
            // Draw code
        });
        app.load();
        draw = function() {
            app.draw();
        };
        
    */
    this.name = name;
    this.load = load;
    this.draw = draw;
};

var iconOne = new Icon("One", function() {
    noStroke();
    fill(colors.theme);
    ellipse(200, 200, 100, 100);
});
var appOne = new App("One", function() {
    this.textbox = new Textbox({
        placeholder: "Testbox... get it?",
        x: (width / 2) - config.textbox.w / 2,
        y: 25
    });
}, function() {
    this.textbox.draw();
    // Event handling for textbox
    if(Mouse.pressed) {
        this.textbox.onmousepress();
    }
    if(Mouse.released) {
        this.textbox.onmouserelease();
    }
    if(Key.pressed) {
        this.textbox.onkeypress();
    }
});
iconOne.load();
appOne.load();

var draw = function() {
    background(colors.white);
    // Draw icon and app
    iconOne.draw();
    appOne.draw();
    // Update the time in the `system` object every frame
    system.time.update();
    // Set the `released` value of `Mouse` to false so `released` is only true for one frame after Mouse is released
    Mouse.released = false;
    // Same reason as `Mouse.released`
    Key.pressed = false;
};
