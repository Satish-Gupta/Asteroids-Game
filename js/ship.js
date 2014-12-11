'use strict';

// Space Ship
function Ship() {

    this.width = 0;
    this.height = 0;
    this.posCenter = [];     // x-y cordinate for center of ship respective of its container
    this.posUnitVector = [];    // unit vector for the center of ship
    this.angle = 0;
    this.deltaAngle = 3;
    this.movementStep = 4;
    this.bulletAvailable = 0;
    this.firedBulletsInSpace = [];   // tracks bullets fired from ship and still live
    this.element;

    var helper;
    var that = this;

    this.init = function(el, wdth, ht, pos, vel, shipAngle, mhelper) {

        that.element = el;
        that.width = wdth;
        that.height = ht;
        that.angle = shipAngle;
        that.posCenter = pos;
        helper = mhelper;
        helper.placeElement(that);
        helper.rotateElement(that);
        that.posUnitVector = helper.angleToVector(that);

    };

    // for debugging only
    this.showShipInfo = function() {

        console.log('width:',that.width);
        console.log('height:',that.height);
        console.log('position of center:',that.posCenter);
        console.log('element:',that.element);
        console.log('angle:',that.angle);
        console.log('unitVector',that.posUnitVector);

    };

    this.moveForward = function() {
//        console.log('move forward(ship)')
        that.posCenter[0] += that.posUnitVector[0] * that.movementStep;
        that.posCenter[1] += that.posUnitVector[1] * that.movementStep;
//        console.log('posUnitVector',that.posUnitVector[0],that.posUnitVector[1]);
        helper.placeElement(that);

    };

    this.rotateShip = function(isClockwiseRotaion) {

        if(isClockwiseRotaion) {

            that.angle += that.deltaAngle;
            that.angle %= 360;
            helper.rotateElement(that);

        } else {

            that.angle -= that.deltaAngle;
            that.angle %= 360;
            helper.rotateElement(that)

        }

        that.posUnitVector = helper.angleToVector(that);
    };

    this.fireBullet = function(bullet, bulletProperties) {

        bulletProperties.angle = that.angle;
        bulletProperties.posCenter = that.getShipGunTipPos();
        bulletProperties.posUnitVector = that.posUnitVector;

        bullet.init(null, bulletProperties, helper);
        that.firedBulletsInSpace.push(bullet);

    };

    this.getShipGunTipPos = function() {

        var xCord = that.posCenter[0] + that.posUnitVector[0] * that.width / 2;
        var yCord = that.posCenter[1] + that.posUnitVector[1] * that.height / 2;
        return [ xCord, yCord ];

    }
}