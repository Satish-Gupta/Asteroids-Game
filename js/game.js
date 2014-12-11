'use strict';

function AsteroidGame() {

    var gameWrapper;
    var keys = {
        left: 37,
        right: 39,
        up: 38,
        space: 32,
    };

    var spaceEl;            // element representing space for the spaceship and asteroid
    var spaceWidth = 900;
    var spaceHeight = 600;
    var spaceCenter;

    var shipEl;
    var ship;
    var shipWidth = 70;
    var shipHeight = 70;
    var shipInitAngle = 270;

    var images = {
        ship: 'ship.png',
        space: 'space.png',
        asteroids: 'asteroid.png',
        bullet: 'bullet.png',
        debris: 'debris.png'
    };

    var bulletProperties = {
        width: 10,
        height: 10,
        life: 150,
        angle: 0,
        deltaAngle: 0,
        image: images.bullet
    };

    var rockPorperties = {
        width: '60',
        height: '60',
        deltaAngle: 0.5,
        posCenter: [],
        // should be more that 1 to have a change in position since it will be multiplied by unit vector
        movementStep: 2
    };
    var asteroidGenerationDelayCounter = 0;
    var asteroidsInSpace = [];
    var isCollisionDisabled = false;
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
        createShip();
        var asteroid = createAsteroid();
        asteroidsInSpace.push(asteroid);
        ship.showShipInfo();

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

        spaceEl = document.createElement('div');
        spaceEl.style.width = spaceWidth + 'px';
        spaceEl.style.height = spaceHeight + 'px';
        spaceEl.style.background = 'url(images/' + images.space + ')';
        spaceEl.style.position = 'relative';
        gameWrapper.appendChild(spaceEl);

        spaceCenter = helper.getCenter({ width: spaceWidth, height: spaceHeight});
    };

    var createShip = function () {

        shipEl = document.createElement('div');
        shipEl.style.width = shipWidth + 'px';
        shipEl.style.height = shipHeight + 'px';
        shipEl.style.position = 'absolute';
        shipEl.style.background = 'url(images/' + images.ship + ')';
        spaceEl.appendChild(shipEl);

        ship = new Ship();
        ship.init(shipEl, shipWidth, shipHeight, spaceCenter, 0, shipInitAngle, helper);

    };

    var createAsteroid = function () {
//        console.log('inside createAsteroid');
        var rotationDirection = [true, false];
        var width = rockPorperties.width;

        // used while generating random number from 0-90 and 270-360
        var temp = [1, 3];

        // space left,right,top,bottom boundry co-ordinates respectively
        var spaceBoundries = [
            [-width / 2 , Math.random() * spaceHeight],
            [spaceWidth + width / 2, Math.random() * spaceHeight],
            [Math.random() * spaceWidth, -width / 2],
            [ Math.random() * spaceWidth, spaceHeight + width / 2]
        ];

        //get appropriate direction for corresponding boundaries for asteroid to move into the space
        var angleForBoundaries = [ Math.random() * 90 * temp[Math.round(Math.random())],
                Math.random() * 180 + 90,
                Math.random() * 180,
                Math.random() * 180 + 180
        ];

        var selectedBoundary = Math.round(Math.random() * 3);
        rockPorperties.posCenter = spaceBoundries[selectedBoundary];
        rockPorperties.angle = angleForBoundaries[selectedBoundary];

//        rockPorperties.posCenter = [Math.random() * spaceWidth, Math.random() * spaceHeight ];
//        rockPorperties.angle = Math.round(Math.random() * 360);
        rockPorperties.posUnitVector = helper.angleToVector(rockPorperties.angle);
        rockPorperties.clockWiseRotation = rotationDirection[Math.round(Math.random())];

//        console.log(rockPorperties.posCenter[0],rockPorperties.posCenter[1]);
        var asteroid = new Asteroid();
        asteroid.init(null, rockPorperties, helper);
        helper.createAndAppendElement(asteroid, spaceEl, images.asteroids);
        helper.placeElement(asteroid);
        asteroidsInSpace.push(asteroid);

    };


    var gameloop = function () {
        counter++;

        showDebugInfo(that, ship, asteroidsInSpace, ship.firedBulletsInSpace);
//        console.log('inside game loop');
//        console.log(ship.firedBulletsInSpace.length,asteroidsInSpace.length);
        if (asteroidGenerationDelayCounter % 50 == 0) {
            createAsteroid();
            asteroidGenerationDelayCounter %= 1000;
        }

        asteroidGenerationDelayCounter++;

        handleKeyPresses();
        handleBulletMovementandCollision();
        handleAsteroidMovementAndCollision();

    };

    var handleKeyPresses = function() {
        if (pressedKeys.isPressed(keys.left)) {

            ship.rotateShip(false);     // rotate ship in counter clockwise direction

        }
        if (pressedKeys.isPressed(keys.right)) {

            ship.rotateShip(true);      // rotate ship in clockwise direction

        }
        if (pressedKeys.isPressed(keys.up)) {
            if(isObjectInSpace(ship, 0)) {
                ship.moveForward();
            } else {
                getShipBackToSpace();
                ship.moveForward();
            }
        }

        if (pressedKeys.isPressed(keys.space)) {
            var bullet = new Bullet();
            ship.fireBullet(bullet, bulletProperties);
//            console.log('space pressed',pressedKeys.pressedKeyCodes);

            helper.createAndAppendElement(bullet, spaceEl, images.bullet);
            helper.placeElement(bullet);

            // remove the keySpace from pressed keys here instead relying in keyup handler since keyup
            // handler may run after multiple passes of gameloop resulting in multiple bullet creation
            // for a single Space bar press.
            pressedKeys.removeKey(keys.space);

        }
    };
    var getShipBackToSpace = function() {
        var shipPosX = ship.posCenter[0];
        var shipPosY = ship.posCenter[1];
        var shipWidthHalf = ship.width / 2;
        var shipHeightHalf = ship.height / 2;
        if(shipPosX + shipWidthHalf > spaceWidth || shipPosX - shipWidthHalf < 0) {
            ship.posCenter[0] = spaceWidth - shipPosX;
            ship.posCenter[1] = spaceHeight - ship.posCenter[1];
        } else {
            ship.posCenter[1] = spaceHeight - shipPosY;
            ship.posCenter[0] = spaceWidth - ship.posCenter[0];
        }
//        if(ship.posCenter[0] < 0) {
//            ship.posCenter[0] = spaceWidth + ship.width / 2;
//            ship.posCenter[1] = spaceHeight - ship.posCenter[1];
//        } else if (ship.posCenter[1] < 0) {
//            ship.posCenter[1] = spaceHeight + ship.width / 2;
//            ship.posCenter[0] = spaceWidth - ship.posCenter[0];
//        } else {
//            ship.posCenter[0] %= spaceWidth;
//            ship.posCenter[1] %= spaceHeight;
//        }
    };
    var handleBulletMovementandCollision = function(asteroid) {
        for(var j = 0; j < asteroidsInSpace.length;j++) {
            var currAsteroid = asteroidsInSpace[j];

            for (var i = 0; i < ship.firedBulletsInSpace.length; i++) {

                var currBullet = ship.firedBulletsInSpace[i];

                if (currBullet != undefined) {
                    if (currBullet.age < currBullet.life) {

                        currBullet.moveForward();

                        if (currAsteroid != undefined) {
                            var isCollision = checkCollision(currBullet, currAsteroid);         // check bullet coollision with asteroid
                            console.log(isCollision);
                            if (isCollision) {
                                helper.removeElement(currBullet, spaceEl);
                                ship.firedBulletsInSpace.splice(i, 1);
                                console.log(isCollision, 1);
                                if (currAsteroid.width > rockPorperties.width / 4) {
                                    var debris = currAsteroid.split(spaceEl, images);

                                    for (var k = 0; k < debris.length; k++) {
                                        asteroidsInSpace.push(debris[k]);
                                    }

                                    console.log(isCollision, 2);
                                }
                                console.log(isCollision, 3);
                                helper.removeElement(currAsteroid, spaceEl);
                                asteroidsInSpace.splice(j, 1);
                            }
                        }
                    } else {

                        helper.removeElement(currBullet, spaceEl);
                        ship.firedBulletsInSpace.splice(i, 1);
                    }
                }

            }
        }
    };

    var handleAsteroidMovementAndCollision = function() {
        for(var j = 0; j < asteroidsInSpace.length;j++) {
            var currAsteroid = asteroidsInSpace[j];

            if (currAsteroid != null) {

                currAsteroid.rotateAsteroid();
                currAsteroid.moveForward();
//                isCollision = false;
//                if (!isCollisionDisabled) {
                var isCollision = checkCollision(ship, currAsteroid);
                if (isCollision) {
//                    helper.removeElement(asteroid, spaceEl);
//                    asteroidsInSpace.splice(i, 1);
//                        isCollisionDisabled = true;
                    if (currAsteroid.width > rockPorperties.width / 4) {
                        var debris = currAsteroid.split(spaceEl, images);
                        for (var k = 0; k < debris.length; k++) {
                            asteroidsInSpace.push(debris[k])
                        }
                    }
                    helper.removeElement(currAsteroid, spaceEl);
                    asteroidsInSpace.splice(j, 1);

                    // to re enable collision after specified delay
                    setTimeout(function (isCollisionDisabled) {
                        isCollisionDisabled = false;
                    }, 20);

//                        ship.posCenter = [spaceWidth / 2, spaceHeight / 2];
//                        helper.placeElement(ship);
//                    console.log('djlfjl', ship.posCenter);
                }
//                }
                if (!isObjectInSpace(currAsteroid, currAsteroid.width / 2)) {

                    asteroidsInSpace.splice(j, 1);
                    helper.removeElement(currAsteroid, spaceEl);

                }

//            }
            }
        }
    };
    var isObjectInSpace = function (object, offset) {

        var objectLeftEndPos = object.posCenter[0] - object.width / 2;
        var objectRightEndPos = object.posCenter[0] + object.width / 2;
        var objectTopEndPos = object.posCenter[1] - object.height / 2;
        var objectBottomEndPos = object.posCenter[1] + object.height / 2;

        // check if object is totally gone out of space
        if (objectLeftEndPos > spaceWidth + offset || objectRightEndPos < -offset ||
            objectTopEndPos > spaceHeight + offset || objectBottomEndPos < -offset) {

            return false;

        }
        return true;
    };

    var checkCollision = function (obj1, obj2) {

            var obj1Radius = obj1.width / 2;
            var obj2Radius = obj2.width / 2;
            if (obj1 != undefined && obj2 != undefined) {

                if (helper.calculateDistance(obj1.posCenter, obj2.posCenter) <= (obj1Radius + obj2Radius)) {
                    return true;
                } else {
                    return false;
                }
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