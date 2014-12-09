'use strict';

function AsteroidGame() {
    var gameWrapper;

    var keys = {
        left : 37,
        right : 39,
        up : 38,
        space : 32,
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
    };

    var bulletProperties = {
        width: 10,
        height: 10,
        life: 40,
        angle: 0,
        deltaAngle: 0,
        image : images.bullet
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
    var maxAsteroidInSpaceCount = 10;
    var asteroidsInSpace = [];
    var helper;             // to hold the helper class instance
    var that = this;

    // object to track the pressed keys to allow multiple key presses to work together
    // which is required for the forward movement and rotation to work together
    var pressedKeys = {
        pressedKeyCodes: [],

        addKey: function (keyCode) {

            this.pressedKeyCodes[this.pressedKeyCodes.length] = keyCode;

        },
        removeKey: function (keyCode) {

            this.pressedKeyCodes.splice(this.pressedKeyCodes.indexOf(keyCode),1)

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
//        createAsteroid();
        ship.showShipInfo();

        // register Event listeners
        document.addEventListener('keydown', keydownEventHandler);
        document.addEventListener('keyup', keyupEventHandler);
        setInterval(gameloop,20)

    };

    var setWrapperProperties = function(width, height) {

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

    var createAsteroid = function() {
        console.log('inside createAsteroid');
        var rotationDirection = [true, false];
        var width = rockPorperties.width;
        // used while generating random number from 0-90 and 270-360
        var temp = [1,3];
        // space left,right,top,bottom boundry co-ordinates
        var spaceBoundries = [[-width/2 ,Math.random() * spaceHeight],[spaceWidth + width / 2,Math.random() * spaceHeight],
                            [Math.random() * spaceWidth, -width / 2],[ Math.random() * spaceWidth, spaceHeight + width / 2]];

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

        console.log(rockPorperties.posCenter[0],rockPorperties.posCenter[1]);
        var asteroid = new Asteroid();
        asteroid.init(null,rockPorperties,helper);
        helper.createAndAppendElement(asteroid, spaceEl, images.asteroids);
        helper.placeElement(asteroid);
        asteroidsInSpace.push(asteroid);

    };


    var gameloop = function() {
//        console.log('inside game loop');
        console.log(ship.firedBulletsInSpace.length,asteroidsInSpace.length);
        if(asteroidGenerationDelayCounter % 50 == 0) {
            createAsteroid();
            asteroidGenerationDelayCounter %= 1000;
        }

        asteroidGenerationDelayCounter++;

        if (pressedKeys.isPressed(keys.left)) {

            ship.rotateShip(false);     // rotate ship in counter clockwise direction

        }
        if (pressedKeys.isPressed(keys.right)) {

            ship.rotateShip(true);      // rotate ship in clockwise direction

        }
        if (pressedKeys.isPressed(keys.up)) {
            ship.moveForward();
        }

        if (pressedKeys.isPressed(keys.space)) {
            var bullet = new Bullet();
            ship.fireBullet(bullet, bulletProperties);
            console.log('space pressed',pressedKeys.pressedKeyCodes);

            helper.createAndAppendElement(bullet, spaceEl, images.bullet);
            helper.placeElement(bullet);

            // remove the keySpace from pressed keys here instead relying in keyup handler since keyup
            // handler may run after multiple passes of gameloop resulting in multiple bullet creation
            // for a single Space bar press.
            pressedKeys.removeKey(keys.space);

        }

        for(var i = 0;i < ship.firedBulletsInSpace.length;i++) {

            var currBullet = ship.firedBulletsInSpace[i];
            if(currBullet) {
                if (currBullet.age < currBullet.life) {

                    currBullet.moveForward();
                    var isCollsion = checkCollision(currBullet, asteroidsInSpace, true);         // check bullet coollision with rocks
                    if(isCollsion) {
                        helper.removeElement(currBullet, spaceEl);
                        ship.firedBulletsInSpace.splice(i, 1);
                    }
                } else {

                    helper.removeElement(currBullet, spaceEl);
                    ship.firedBulletsInSpace.splice(i,1);

                }
            }
        }
        for(var i = 0;i < asteroidsInSpace.length;i++) {


            var asteroid = asteroidsInSpace[i];
            if (asteroidGenerationDelayCounter % 50) {

                asteroid.rotateAsteroid();
                asteroid.moveForward();
                var isCollision = checkCollision(asteroid, [ship], false);
                if(isCollision) {
                    helper.removeElement(asteroid, spaceEl);
                    asteroidsInSpace.splice(i, 1);
                }

            }
            if(asteroid) {
                if(!isObjectInSpace(asteroid)) {

                    asteroidsInSpace.splice(i, 1);
                    helper.removeElement(asteroid, spaceEl);
                }
            }
        }


    };

    var isObjectInSpace = function(object) {

        var objectLeftEndPos = object.posCenter[0] - object.width / 2;
        var objectRightEndPos = object.posCenter[0] + object.width / 2;
        var objectTopEndPos = object.posCenter[1] - object.height / 2;
        var objectBottomEndPos = object.posCenter[1] + object.height / 2;

        //
        if(objectLeftEndPos > spaceWidth + object.width || objectRightEndPos < -object.width ||
            objectTopEndPos > spaceHeight + object.width || objectBottomEndPos < -object.width) {

            return false;

        }

        return true;

    };
    // check collision between a given object and each object of another collection
    var checkCollision = function(obj, objects, isdelete) {

            for (var j = 0; j < objects.length; j++) {
                var obj2 = objects[j];

                if(obj2 != null && obj!= null) {
//                    console.log('inside collision detection',obj.pos, obj2.pos);
//                    console.log(helper.calculateDistance(obj.posCenter, obj2.posCenter), (obj2.width / 2 + obj.width / 2))

                    if (helper.calculateDistance(obj.posCenter, obj2.posCenter) <= (obj.width / 2 + obj2.width / 2)) {

                        if(isdelete) {
                            helper.removeElement(obj2, spaceEl);
                            objects.splice(j, 1);
                        }
                        return true;
                    }
                }
            }
        return false;
    };

    var keyupEventHandler = function (event) {

        console.log('inside keyupEventHandler',event.keyCode);
        // do not remove if key is space since gameloop is handling the removal
        if(event.keyCode != keys.space) {
            pressedKeys.removeKey(event.keyCode);
        }
    };

    var keydownEventHandler = function (event) {

        console.log('inside keydownEventHandler');
        var keyPressed = event.keyCode;
        console.log(pressedKeys.pressedKeyCodes);

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