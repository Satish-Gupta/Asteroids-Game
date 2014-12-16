/**
 * Created by sg_2 on 08-12-2014.
 */

function Asteroid() {

    this.width = 0;
    this.height = 0;
    this.posCenter = [];     // x-y cordinate for center of ship respective of its container
    this.posUnitVector = [];    // unit vector for the center of ship
    this.angle = 0;
    this.deltaAngle = 0;
    this.movementStep = 0;
    this.clockWiseRotation = true;
    this.element;


    var helper;
    var that = this;

    this.init = function(element, asteroidProperties, mHelper) {

        that.element = asteroidProperties.element;
        that.width = asteroidProperties.width;
        that.height = asteroidProperties.height;
        that.posCenter = asteroidProperties.posCenter;
        that.angle = asteroidProperties.angle;
        that.deltaAngle = asteroidProperties.deltaAngle;
        that.movementStep = asteroidProperties.movementStep;
        that.clockWiseRotation = asteroidProperties.clockWiseRotation;
//        console.log(that.clockWiseRotation);
        helper = mHelper;
        that.posUnitVector = helper.angleToVector(that);

    };

    this.moveForward = function() {
        that.posCenter[0] += that.posUnitVector[0] * that.movementStep;
        that.posCenter[1] += that.posUnitVector[1] * that.movementStep;
        helper.placeElement(that);

    };

    this.rotateAsteroid = function() {
//        console.log('in Asteroid.rotate()');
        if(that.clockWiseRotation) {

            that.angle += that.deltaAngle;
            that.angle %= 360;
            helper.rotateElement(that);

        } else {

            that.angle -= that.deltaAngle;
            helper.rotateElement(that)
            that.angle %= 360;
        }

//        that.posUnitVector = helper.angleToVector(that);  // movement of asteroid is based only with the initial angle
//        console.log(that.deltaAngle)
    };
    // for debugging only
    this.showAsteroidInfo = function() {

        console.log('width:',that.width);
        console.log('height:',that.height);
        console.log('position of center:',that.posCenter);
        console.log('element:',that.element);
        console.log('angle:',that.angle);
        console.log('unitVector',that.posUnitVector);

    };

    this.split = function(spaceEl, images ) {
        var childrenAsteroids = [new Asteroid(), new Asteroid()];
        var childrenAsteroidProperties = {
            width : that.width / 2,
            height : that.height / 2,
            angle : (that.angle - 20),
            deltaAngle : that.deltaAngle,
            posCenter : [that.posCenter[0], that.posCenter[1] - that.width / 4],
            movementStep : that.movementStep,
            clockWiseRotation : that.clockWiseRotation
        };

        childrenAsteroids[0].init(null, childrenAsteroidProperties, helper);
        helper.createAndAppendElement(childrenAsteroids[0], spaceEl, images.debris);
        helper.placeElement(childrenAsteroids[0]);

        childrenAsteroidProperties.angle = (that.angle + 20);
        childrenAsteroidProperties.posCenter = [that.posCenter[0], that.posCenter[1] + that.width / 4]

        childrenAsteroids[1].init(null, childrenAsteroidProperties, helper);
        helper.createAndAppendElement(childrenAsteroids[1], spaceEl, images.debris)
        helper.placeElement(childrenAsteroids[1]);

        return childrenAsteroids;
    }
}