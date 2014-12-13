'use strict';

function AsteroidGame() {

    var gameWrapper;
    var keys = {
        left: 37,
        right: 39,
        up: 38,
        space: 32,
    };
    var images = {
        ship: 'ship.png',
        space: 'space.png',
        asteroid: 'asteroid.png',
        bullet: 'bullet.png',
        debris: 'debris.png'
    };

    var space;
    var spaceProperties = {
        width: 900,
        height: 600,
        image: images.space
    };
    var shipProperties = {
        width: 70,
        height: 70,
        initAngle: 270,
        image: images.ship,
        movementStep : 4
    };
    var bulletProperties = {
        width: 10,
        height: 10,
        life: 150,
        angle: 0,
        deltaAngle: 0,
        image: images.bullet
    };
    var asteroidProperties = {
        width: '60',
        height: '60',
        deltaAngle: 0.5,
        posCenter: [],
        // should be more that 1 to have a change in position since it will be multiplied by unit vector
        movementStep: 2,
        image: images.asteroid
    };
    var asteroidGenerationDelayCounter = 0;
    var helper;             // to hold the helper class instance
    var that = this;

    // object to track the pressed keys to allow multiple key presses to work together
    // which is in turn required for the forward movement and rotation to work simultaneously
    var pressedKeys = {
        pressedKeyCodes: [],

        addKey: function (keyCode) {

            this.pressedKeyCodes[this.pressedKeyCodes.length] = keyCode;

        },
        removeKey: function (keyCode) {

            this.pressedKeyCodes.splice(this.pressedKeyCodes.indexOf(keyCode), 1)

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
        setWrapperProperties(wrapperWidth, wrapperHeight);

        helper = new Helper();

        createSpace();
        space.createShip(shipProperties, images);
        space.ship.showShipInfo();

        // register Event listeners
        document.addEventListener('keydown', keydownEventHandler);
        document.addEventListener('keyup', keyupEventHandler);
        setInterval(gameloop, 20)

    };

    var setWrapperProperties = function (width, height) {

        gameWrapper.style.width = width;
        gameWrapper.style.height = height;
        gameWrapper.style.position = 'relative';
        gameWrapper.style.margin = '0 auto';

    };
    var createSpace = function () {
        var spaceEl;
        spaceEl = document.createElement('div');
        spaceEl.style.width = spaceProperties.width + 'px';
        spaceEl.style.height = spaceProperties.height + 'px';
        spaceEl.style.background = 'url(images/' + images.space + ')';
        spaceEl.style.position = 'relative';
        gameWrapper.appendChild(spaceEl);
        spaceProperties.element = spaceEl;
        space = new Space();
        space.init(spaceProperties, helper);

    };

    var gameloop = function () {
        counter++;

        showDebugInfo(that, space.ship, space.asteroidsInSpace, space.firedBulletsInSpace);

        if (asteroidGenerationDelayCounter % 50 == 0) {

            space.createAsteroid(asteroidProperties);
            asteroidGenerationDelayCounter %= 1000;

        }

        asteroidGenerationDelayCounter++;

        handleKeyPresses();
        space.handleBulletMovementandCollision(asteroidProperties, images);
        space.handleAsteroidMovementAndCollision(asteroidProperties, images);

    };

    var handleKeyPresses = function() {
        if (pressedKeys.isPressed(keys.left)) {

            space.ship.rotateShip(false);     // rotate ship in counter clockwise direction

        }
        if (pressedKeys.isPressed(keys.right)) {

            space.ship.rotateShip(true);      // rotate ship in clockwise direction

        }
        if (pressedKeys.isPressed(keys.up)) {
            if(space.isObjectInSpace(space.ship, 0)) {
                space.ship.moveForward();
            } else {
                space.getShipBackToSpace();
                space.ship.moveForward();
            }
        }

        if (pressedKeys.isPressed(keys.space)) {
            var bullet = new Bullet();
            space.ship.fireBullet(bullet, bulletProperties);
            space.firedBulletsInSpace.push(bullet);
//            console.log('space pressed',pressedKeys.pressedKeyCodes);
            console.log(space.element);
            helper.createAndAppendElement(bullet, space.element, images.bullet);
            helper.placeElement(bullet);

            // remove the keySpace from pressed keys here instead relying in keyup handler since keyup
            // handler may run after multiple passes of gameloop resulting in multiple bullet creation
            // for a single Space bar press.
            pressedKeys.removeKey(keys.space);

        }
    };

    var keyupEventHandler = function (event) {

//        console.log('inside keyupEventHandler', event.keyCode);
        // do not remove if key is space since gameloop is handling the removal
        if (event.keyCode != keys.space) {
            pressedKeys.removeKey(event.keyCode);
        }
    };

    var keydownEventHandler = function (event) {

//        console.log('inside keydownEventHandler');
        var keyPressed = event.keyCode;
//        console.log(pressedKeys.pressedKeyCodes);

        if (!pressedKeys.isPressed(keyPressed)) {

            pressedKeys.addKey(keyPressed);

        }
    };

}

var mainWrapper = document.getElementsByClassName('main-wrapper');
var gameWrapper = document.createElement('div');
mainWrapper[0].appendChild(gameWrapper);

var game = new AsteroidGame();
game.init(gameWrapper, 900, 600);
setInterval(function() {
    console.log(counter);
    fps = counter;
    counter = 0;
},1000);