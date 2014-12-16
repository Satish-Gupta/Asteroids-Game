 'use strict';

function AsteroidGame() {

    var gameWrapper;
    this.score = 0;
    this.life = 3;
    var lifePanel;
    var scoreBoard;
    var level = [2,3,4,5];
    var intervalId;
    var keys = {
        left: 37,
        right: 39,
        up: 38,
        down: 40,
        space: 32,
        escape: 27
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
        friction: 0.05,
        velocity : 0
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
        createWelcomeScreen();
        // register Event listeners
        document.addEventListener('keydown', keydownEventHandler);
        document.addEventListener('keyup', keyupEventHandler);
//        intervalId = setInterval(gameloop, 20)

    };
    var pause = function() {
        clearInterval(intervalId);
    };
    var resume = function() {
        intervalId = setInterval(gameloop,20);
    };
    var restart = function() {
        that.score = 0;
        that.life = 3;
        for(var i = 0;i < space.asteroidsInSpace.length;i++) {
            var asteroid = space.asteroidsInSpace[i];
            if(asteroid) {
                console.log('asteroid removal')
                space.element.removeChild(asteroid.element);
            }
        }
//        space.asteroidsInSpace = undefined;
        for(var i = 0;i < space.firedBulletsInSpace.length;i++) {
            var bullet = space.firedBulletsInSpace[i];
            if(bullet) {
                console.log('bullet removal')
                space.element.removeChild(bullet.element);
            }
        }
//        space.firedBulletsInSpace = undefined;
//        spaceProperties.element = space.ship.element;
//        space.ship.init(spaceProperties, helper);
        clearInterval(intervalId);
        that.welcomeScreen.style.display = 'none';
        showDebugInfo(that, space.ship, space.asteroidsInSpace, space.firedBulletsInSpace, space.isObjectInSpace(space.ship,space.ship.width/2),
            space.ship.velocity);
        intervalId = setInterval(gameloop,20);
    };


    var setWrapperProperties = function (width, height) {

        gameWrapper.style.width = width;
        gameWrapper.style.height = height;
        gameWrapper.style.position = 'relative';
        gameWrapper.style.margin = '0 auto';

    };
    var createWelcomeScreen = function() {
        var welComeScreen;
        welComeScreen = document.createElement('div');
        welComeScreen.style.width = spaceProperties.width / 2 + 'px';
        welComeScreen.style.height = spaceProperties.height / 2+ 'px';
//        welComeScreen.style.background = 'blue';//'url(images/' + images.space + ')';
        welComeScreen.style.position = 'absolute';
        welComeScreen.style.marginLeft = spaceProperties.width / 4 + 'px';
        welComeScreen.style.marginTop = spaceProperties.height / 4 + 'px';
//        welComeScreen.style.position = 'relative';
//        welComeScreen.innerHTML = "click to start";
//        welComeScreen.onclick = function() {
//            intervalId = setInterval(gameloop,20);
//            welComeScreen.style.display = 'none';
//        };

        var startButton;
        startButton = document.createElement('button');
        startButton.style.width = 100 + 'px';
        startButton.style.height = 50 + 'px';
//        welComeScreen.style.background = 'blue';//'url(images/' + images.space + ')';
//        startButton.style.position = 'absolute';
        startButton.style.marginLeft = 200 + 'px';
        startButton.style.marginTop = 50 + 'px';
        startButton.innerHTML = "start";
        startButton.onclick = function() {
            intervalId = setInterval(gameloop,20);
            welComeScreen.style.display = 'none';
        };
        welComeScreen.appendChild(startButton);

        var restartButton;
        restartButton = document.createElement('button');
        restartButton.style.width = 100 + 'px';
        restartButton.style.height = 50 + 'px';
//        welComeScreen.style.background = 'blue';//'url(images/' + images.space + ')';
//        startButton.style.position = 'absolute';
        restartButton.style.marginLeft = 200 + 'px';
        restartButton.style.marginTop = 50 + 'px';
        restartButton.innerHTML = "resstart";
        restartButton.onclick = function() {
            restart();
            welComeScreen.style.display = 'none';
        };

        welComeScreen.appendChild(restartButton);
        scoreBoard = document.createElement('div');
        scoreBoard.style.width = spaceProperties.width / 8 + 'px';
        scoreBoard.style.height = spaceProperties.height / 12 + 'px';
//        scoreBoard.style.background = 'gray';//'url(images/' + images.space + ')';
        scoreBoard.style.position = 'absolute';
        scoreBoard.style.marginLeft = 20 + 'px';
        scoreBoard.style.marginTop = 20 + 'px';
        scoreBoard.innerHTML = 'score' + that.score;
        scoreBoard.style.color = 'white';
        space.element.appendChild(scoreBoard);

        lifePanel = document.createElement('div');
        lifePanel.style.width = spaceProperties.width / 8 + 'px';
        lifePanel.style.height = spaceProperties.height / 12 + 'px';
//        lifePanel.style.background = 'gray';//'url(images/' + images.space + ')';
        lifePanel.style.position = 'absolute';
        lifePanel.style.marginLeft = spaceProperties.width - (spaceProperties.width / 8  + 20) + 'px';
        lifePanel.style.marginTop = 20 + 'px';
        lifePanel.innerHTML = 'life' + that.life;
        lifePanel.style.color = 'white';

        space.element.appendChild(lifePanel);
        space.element.appendChild(welComeScreen);
        that.welcomeScreen = welComeScreen;

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
        space = new Space(that);
        space.init(spaceProperties, helper);
    };

    var gameloop = function () {
        counter++;
        scoreBoard.innerHTML = 'score: ' + that.score;
        lifePanel.innerHTML = 'life: ' + that.life;

        showDebugInfo(that, space.ship, space.asteroidsInSpace, space.firedBulletsInSpace, space.isObjectInSpace(space.ship,space.ship.width/2),
                        space.ship.velocity);

        if (asteroidGenerationDelayCounter % 50 == 0) {

            space.createAsteroid(asteroidProperties);
            asteroidGenerationDelayCounter %= 1000;

        }

        asteroidProperties.movementStep = level[1];
//        if(asteroidGenerationDelayCounter % 10 == 0) {
//            asteroidProperties.movementStep += 0.1;
//        }

        asteroidGenerationDelayCounter++;
        if(space.isObjectInSpace(space.ship, 0)) {
            space.ship.moveForward();
        } else {
            space.getShipBackToSpace();

        }

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
            if(space.ship.velocity < 10) {
                space.ship.velocity += 0.2;
            }
//            if(space.isObjectInSpace(space.ship, 0)) {
//                space.ship.moveForward();
//            } else {
//                space.getShipBackToSpace();
//            }
        }

        if (pressedKeys.isPressed(keys.space)) {
            if(space.ship.isFiringEnabled) {
                space.ship.isFiringEnabled = false;
                setTimeout(function() {
                    space.ship.isFiringEnabled = true;
                },200);
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
            }
            pressedKeys.removeKey(keys.space);
        }
        if(pressedKeys.isPressed(keys.escape)) {
            that.welcomeScreen.style.display = 'block';
            pause();
            pressedKeys.removeKey(keys.escape);
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