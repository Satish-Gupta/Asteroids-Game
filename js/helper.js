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

    // create html div and append to its parent
    this.createAndAppendElement = function(obj, parentElement, image) {

        var element;
        element = document.createElement('div');
        element.style.width = obj.width + "px";
        element.style.height = obj.height + "px";
        element.style.position = 'absolute';
        if(image) {
            element.style.background = 'url(images/' + image + ')';
        }
        obj.element = element;
//        console.log(obj.element);
        parentElement.appendChild(element);

    };

    // remove html element from the dom
    this.removeElement = function(obj, parentEl) {
        console.log(obj.width)
        if(obj.element) {
            parentEl.removeChild(obj.element);
        }
    };

    // updates the html element positions
    this.placeElement = function (obj) {

        obj.element.style.left = (obj.posCenter[0] - obj.width / 2) + 'px';
        obj.element.style.top = (obj.posCenter[1] - obj.height / 2) + 'px';

    };

    // rotates given html element
    this.rotateElement = function (obj) {
        var str = 'rotate(' + obj.angle + 'deg)';

        obj.element.style.transform = str;
//        console.log('inside rotateElement:element.style.transform', obj.element.rotation, ' obj.angle:',obj.angle);

    };

    // converts angle to unit vector [x, y]
    this.angleToVector = function (obj) {

        var radian = that.angleToRadian(obj.angle);
        return ([Math.cos(radian), Math.sin(radian)])

    };

    this.angleToRadian = function (angle) {

        return angle * Math.PI / 180;

    };

    this.calculateDistance = function(pos1, pos2) {
        return Math.sqrt( Math.pow( (Math.abs(pos1[0])-Math.abs(pos2[0])), 2) + Math.pow( (Math.abs(pos1[1]) - Math.abs(pos2[1])), 2));
    }
}