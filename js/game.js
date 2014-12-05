'use strict';

function AsteroidGame() {
    var gameWrapper;
    var keyLeft = 37;
    var keyRight = 39;
    var keyUp = 38;

    var spaceEl;            // element representing space for the spaceship and asteroid
    var spaceWidth = 800;
    var spaceHeight = 600;
    var shipInitAngle = 270;
    var spaceCenter;

    var shipEl;
    var ship;
    var shipWidth = 90;
    var shipHeight = 90;
    var shipAngle;

    var helper;             // to hold the helper class instance

    var that = this;

    var images = {
        ship: 'ship.png',
        space: '',
        asteroids: '',
        bullet: '',
    };

    // tracks the pressed keys to allow multiple key presses to work together
    // which is required for the forward movement and rotation to work together
    var pressedKeys = {
        pressedKeyCodes: [],

        addKey: function (keyCode) {

            this.pressedKeyCodes[this.pressedKeyCodes.length] = keyCode;

        },
        removeKey: function (keyCode) {

            delete this.pressedKeyCodes[this.pressedKeyCodes.indexOf(keyCode)];

        },
        isPressed: function (keyCode) {

            for (var i = 0; i < this.pressedKeyCodes.length; i++) {
                if (this.pressedKeyCodes[i] == keyCode) {
                    return true;
                }
            }

            return false;
        }
    };

    // game initialization
    this.init = function (mainWrapper, wrapperWidth, wrapperHeight) {

        gameWrapper = mainWrapper;
        gameWrapper.style.width = wrapperWidth;
        gameWrapper.style.height = wrapperHeight;
        gameWrapper.style.position = 'relative';
        gameWrapper.style.margin = "0 auto";

        helper = new Helper();
        createSpace();
        spaceCenter = helper.getCenter({ width: spaceWidth, height: spaceHeight});

        createShip();
        ship.showShipInfo();

        document.addEventListener("keydown", keydownEventHandler);
        document.addEventListener("keyup", keyupEventHandler);

    };

    var createSpace = function () {
        spaceEl = document.createElement('div');
        spaceEl.style.width = spaceWidth + "px";
        spaceEl.style.height = spaceHeight + "px";
        spaceEl.style.background = "gray";
        spaceEl.style.position = "relative";
        gameWrapper.appendChild(spaceEl);
    };

    var createShip = function () {
        shipEl = document.createElement('div');
        shipEl.style.width = shipWidth + "px";
        shipEl.style.height = shipHeight + "px";
        shipEl.style.position = "absolute";
        shipEl.style.background = 'url(images/' + images.ship + ')';
        spaceEl.appendChild(shipEl);
        ship = new Ship();
        ship.init(shipEl, shipWidth, shipHeight, spaceCenter, 0, shipInitAngle, helper);
    };

    var keyupEventHandler = function (event) {

        console.log("inside keyupEventHandler");
        pressedKeys.removeKey(event.keyCode);

    };

    var keydownEventHandler = function (event) {

        var timers = {};
        console.log("inside keydownEventHandler");
        var keyPressed = event.keyCode;
        console.log(pressedKeys.pressedKeyCodes);

        if (!pressedKeys.isPressed(keyPressed)) {

            pressedKeys.addKey(keyPressed);

        }
        if (pressedKeys.isPressed(keyLeft)) {

            ship.rotateShip(false);     // rotate ship in counter clockwise direction

        }
        if (pressedKeys.isPressed(keyRight)) {

            ship.rotateShip(true);      // rotate ship in clockwise direction

        }
        if (pressedKeys.isPressed(keyUp)) {
            ship.moveForward();
        }
    };
}

var mainWrapper = document.getElementsByClassName('main-wrapper');
var gameWrapper = document.createElement('div');
mainWrapper[0].appendChild(gameWrapper);

var game = new AsteroidGame();
game.init(gameWrapper, 700, 600);