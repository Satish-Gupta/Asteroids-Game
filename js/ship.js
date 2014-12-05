'use strict';

// Space Ship
function Ship() {

    this.width;
    this.height;
    this.posCenter = [];     // x-y cordinate for center of ship respective of its container
    this.posUnitVector = [];    // unit vector for the center of ship
    this.element;
    this.angle;
    this.deltaAngle = 6;
    this.movementStep = 4;

    var helper;
    var that = this;

    this.init = function(el, wdth, ht, pos, vel, shipAngle, helper) {

        that.element = el;
        that.width = wdth;
        that.height = ht;
        that.angle = shipAngle;
        that.posCenter = pos;
        that.helper = helper

        that.helper.placeElement(that);
        that.helper.rotateElement(that);
        that.posUnitVector = helper.angleToVector(that);

    };

    // for debugging only
    this.showShipInfo = function() {

        console.log("width:",that.width);
        console.log("height:",that.height);
        console.log("position of center:",that.posCenter);
        console.log("element:",that.element);
//        console.log("angular vel:",angularVelocity);
        console.log("angle:",that.angle);
        console.log("unitVector",that.posUnitVector);

    };

    this.moveForward = function() {

        that.posCenter[0] += that.posUnitVector[0] * that.movementStep;
        that.posCenter[1] += that.posUnitVector[1] * that.movementStep;
        console.log(that.posUnitVector[0],that.posUnitVector[1]);
        that.helper.placeElement(that);

    };

    this.rotateShip = function(isClockwiseRotaion) {

        if(isClockwiseRotaion) {

            that.angle += that.deltaAngle;
            that.helper.rotateElement(that);

        } else {

            that.angle -= that.deltaAngle;
            that.helper.rotateElement(that)

        }

        that.posUnitVector = that.helper.angleToVector(that);
    }
}