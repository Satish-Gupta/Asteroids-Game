/**
 * Created by sg_2 on 11-12-2014.
 */

function Space(game) {
    var width = 0;
    var height = 0;
    var spaceCenter;
    this.ship;
    this.element;
    this.game = game;

    this.asteroidsInSpace = [];
    this.firedBulletsInSpace = [];

    var that = this;
    this.init = function (spaceProperties, mHelper) {

        width = spaceProperties.width;
        height = spaceProperties.height;
        spaceCenter = [width / 2, height / 2];
        that.element = spaceProperties.element;
        helper = mHelper;
    };

    this.createShip = function (shipProperties, images) {
        var shipEl;
        shipEl = document.createElement('div');
        shipEl.style.width = shipProperties.width + 'px';
        shipEl.style.height = shipProperties.height + 'px';
        shipEl.style.position = 'absolute';
        shipEl.style.background = 'url(images/' + images.ship + ')';
        that.element.appendChild(shipEl);

        shipProperties.posCenter = spaceCenter;
        shipProperties.element = shipEl;
        that.ship = new Ship();
        that.ship.init(shipProperties, helper);

    };

    this.createAsteroid = function (asteroidProperties) {
//        console.log('inside createAsteroid');
        var rotationDirection = [true, false];
        var asterodWidth = asteroidProperties.width;

        // used while generating random number from 0-90 and 270-360
        var temp = [1, 3];

        // space left,right,top,bottom boundry co-ordinates respectively
        var spaceBoundries = [
            [-asterodWidth / 2 , Math.random() * height],
            [height + width / 2, Math.random() * height],
            [Math.random() * width, -asterodWidth / 2],
            [ Math.random() * width, height + asterodWidth / 2]
        ];

        //get appropriate direction for corresponding boundaries for asteroid to move into the space
        var angleForBoundaries = [ Math.random() * 90 * temp[Math.round(Math.random())],
                Math.random() * 180 + 90,
                Math.random() * 180,
                Math.random() * 180 + 180
        ];

        var selectedBoundary = Math.round(Math.random() * 3);
        asteroidProperties.posCenter = spaceBoundries[selectedBoundary];
        asteroidProperties.angle = angleForBoundaries[selectedBoundary];

//        rockPorperties.posCenter = [Math.random() * spaceWidth, Math.random() * spaceHeight ];
//        rockPorperties.angle = Math.round(Math.random() * 360);
        asteroidProperties.posUnitVector = helper.angleToVector(asteroidProperties.angle);
        asteroidProperties.clockWiseRotation = rotationDirection[Math.round(Math.random())];

//        console.log(rockPorperties.posCenter[0],rockPorperties.posCenter[1]);
        var asteroid = new Asteroid();
        asteroid.init(null, asteroidProperties, helper);
        helper.createAndAppendElement(asteroid, that.element, asteroidProperties.image);
        helper.placeElement(asteroid);
        that.asteroidsInSpace.push(asteroid);

    };

    this.getShipBackToSpace = function () {
        var ship = that.ship;
        var shipPosX = ship.posCenter[0];
        var shipPosY = ship.posCenter[1];
        var shipWidthHalf = ship.width / 2;
        var shipHeightHalf = ship.height / 2;
//        if (shipPosX + shipWidthHalf > width || shipPosX - shipWidthHalf < 0) {
//            ship.posCenter[0] = Math.round(width - shipPosX - 1);
//            ship.posCenter[1] = Math.round(height - ship.posCenter[1]);
//        } else {
//            ship.posCenter[1] = Math.round(height - shipPosY - 1);
//            ship.posCenter[0] = Math.round(width - ship.posCenter[0]);
//        }
        if(ship.posCenter[0] <= ship.width / 2) {
            ship.posCenter[0] = width + ship.width / 2;
//            ship.posCenter[1] = height - ship.posCenter[1];
        } else if (ship.posCenter[1] <= ship.height / 2) {
            ship.posCenter[1] = height + ship.width / 2;
//            ship.posCenter[0] = width - ship.posCenter[0];
        } else {
            ship.posCenter[0] %= (width + ship.width / 2);
            ship.posCenter[1] %= (height + ship.height / 2);
        }
    };

    this.handleBulletMovementandCollision = function (asteroidProperties, images) {
        var ship = that.ship;
        var asteroids = that.asteroidsInSpace;
        for (var j = 0; j < asteroids.length; j++) {
            var currAsteroid = asteroids[j];

            for (var i = 0; i < that.firedBulletsInSpace.length; i++) {

                var currBullet = that.firedBulletsInSpace[i];

                if (currBullet != undefined) {
                    if (currBullet.age < currBullet.life) {

                        currBullet.moveForward();

                        if (currAsteroid != undefined) {
                            var isCollision = that.checkCollision(currBullet, currAsteroid);         // check bullet coollision with asteroid
                            console.log(isCollision);
                            if (isCollision) {
                                if (currAsteroid.width < asteroidProperties.width) {
                                    that.game.score += 2;
                                } else {
                                    that.game.score ++;
                                }
                                helper.removeElement(currBullet, that.element);
                                that.firedBulletsInSpace.splice(i, 1);
                                console.log(isCollision, 1);
                                if (currAsteroid.width > asteroidProperties.width / 4) {
                                    var debris = currAsteroid.split(that.element, images);

                                    for (var k = 0; k < debris.length; k++) {
                                        asteroids.push(debris[k]);
                                    }

                                    console.log(isCollision, 2);
                                }
                                console.log(isCollision, 3);
                                helper.removeElement(currAsteroid, that.element);
                                asteroids.splice(j, 1);
                            }
                        }
                    } else {

                        helper.removeElement(currBullet, that.element);
                        that.firedBulletsInSpace.splice(i, 1);
                    }
                }

            }
        }
    };

    this.handleAsteroidMovementAndCollision = function (asteroidProperties, images) {
        var ship = that.ship;
        var asteroids = that.asteroidsInSpace;
        for (var j = 0; j < asteroids.length; j++) {
            var currAsteroid = asteroids[j];

            if (currAsteroid != null) {

                currAsteroid.rotateAsteroid();
                currAsteroid.moveForward();
//                isCollision = false;
                if (that.ship.isCollisionEnabled) {
                var isCollision = that.checkCollision(ship, currAsteroid);
                if (isCollision) {
                    if(that.game.life > 0) {
                        that.game.life--;
                    }
//                    helper.removeElement(asteroid, element);
//                    asteroidsInSpace.splice(i, 1);
                        that.ship.isCollisionEnabled = false;
                        that.ship.isFiringEnabled = false;
                    if (currAsteroid.width > asteroidProperties.width / 4) {
                        var debris = currAsteroid.split(that.element, images);
                        for (var k = 0; k < debris.length; k++) {
                            asteroids.push(debris[k])
                        }
                    }
                    helper.removeElement(currAsteroid, that.element);
                    asteroids.splice(j, 1);
                    ship.element.style.opacity = 0.5;
                    // to re enable collision after specified delay
                    setTimeout(function () {
                        that.ship.isCollisionEnabled = true;
                        ship.element.style.opacity = 1;
                        that.ship.isFiringEnabled = true;
                    }, 1000);

//                        ship.posCenter = [spaceWidth / 2, spaceHeight / 2];
//                        helper.placeElement(ship);
//                    console.log('djlfjl', ship.posCenter);
                }
                }
                if (!that.isObjectInSpace(currAsteroid, currAsteroid.width / 2)) {

                    asteroids.splice(j, 1);
                    helper.removeElement(currAsteroid, that.element);

                }

//            }
            }
        }
    };

    this.isObjectInSpace = function (object, offset) {

        var objectLeftEndPos = object.posCenter[0] - object.width / 2;
        var objectRightEndPos = object.posCenter[0] + object.width / 2;
        var objectTopEndPos = object.posCenter[1] - object.height / 2;
        var objectBottomEndPos = object.posCenter[1] + object.height / 2;

        // check if object is totally gone out of space
        if (objectLeftEndPos > width + offset || objectRightEndPos < -offset ||
            objectTopEndPos > height + offset || objectBottomEndPos < -offset) {

            return false;

        }
        return true;
    };

    this.checkCollision = function (obj1, obj2) {

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
}