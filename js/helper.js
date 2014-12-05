'use strict';

function Helper() {

    var that = this;

    // calculates center position cordinates of an object with reference to its container
    this.getCenterPos = function (obj) {

        var centerPos = [];
        centerPos[0] = obj.left + obj.width / 2;
        centerPos[1] = obj.top + obj.height / 2;
        return centerPos;

    };

    //get center of an object
    this.getCenter = function (obj) {

        return [obj.width / 2, obj.height / 2];

    };

    // updates the html element positions
    this.placeElement = function (obj) {

        console.log(obj.element);
        obj.element.style.left = (obj.posCenter[0] - obj.width / 2) + "px";
        obj.element.style.top = (obj.posCenter[1] - obj.height / 2) + "px";
        console.log("inside place Element", obj.element);

    };

    // rotaes a html element
    this.rotateElement = function (obj) {
        var str = "rotate(" + obj.angle + "deg)";

        obj.element.style.transform = str;
        console.log('inside rotateElement:element.style.transform', obj.element.rotation);

    };

    // converts angle to unit vector [x, y]
    this.angleToVector = function (obj) {

        var radian = that.angleToRadian(obj.angle);
        return ([Math.cos(radian), Math.sin(radian)])

    };

    this.angleToRadian = function (angle) {

        return angle * Math.PI / 180;

    }

}