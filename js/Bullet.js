'use strict';

function Bullet() {

    this.width = 0;
    this.height = 0;
    this.angle = 0;
    this.element = 0;
    this.posCenter = [];     // x-y cordinate for center of ship respective of its container
    this.posUnitVector = [];    // unit vector for the center of ship (x-y cordinates between 0 and 1)
    this.movementStep = 0;

    this.life = 0;
    this.age = 0;

    var helper;
    var that = this;

    this.init = function(element, bulletProperties, helper) {

        console.log('inside Bullet init')
        that.element = element;
        that.width = bulletProperties.width;
        that.height = bulletProperties.height;
        that.angle = bulletProperties.angle;
        that.posCenter = bulletProperties.posCenter;
        that.posUnitVector = bulletProperties.posUnitVector
        that.life = bulletProperties.life;
        that.movementStep = bulletProperties.movementStep

        that.helper = helper;
        console.log(that.element,that.width,that.height,that.angle,that.life)
    };

    this.moveForward = function() {
            that.posCenter[0] += that.posUnitVector[0] * that.movementStep;
            that.posCenter[1] += that.posUnitVector[1] * that.movementStep;

            that.age += 1;
            that.helper.placeElement(that);

    }
}