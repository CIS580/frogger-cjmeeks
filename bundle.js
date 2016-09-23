(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const EntityManager = require('./entity-manager.js');
const Car = require ('./car.js');
const Log = require ('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var levelDom = document.getElementById('level');
var livesDom = document.getElementById('lives');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var log = new Log(level,0,0,1);
var em = new EntityManager();
var background = new Image();
background.src = './assets/background.png'
var level = 1;
var cars = [];
var logs = [];
var livesLeft = 3;
var gameEnd = false;
for(var i = 0; i < 2; i++){
  cars.push(new Car(level, ((i+1)*110) , Math.floor(Math.random()*480)));
}
var ycord = Math.floor(Math.random()*480);
logs.push(new Log(level, 467, ycord));
console.log(canvas.width);
console.log(canvas.height);


/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
    if(!gameEnd){
        player.update(elapsedTime);
        cars.forEach(function(car){
            car.update(elapsedTime, level);
        });
        logs.forEach(function(log){
           log.update(elapsedTime);
        });
        if((player.x+player.width) > 100 && (player.x+player.width) < 185){
            checkCollisionCars(cars[0]);
        }
        if((player.x+player.width) > 185 && (player.x+player.width)< 300){
            checkCollisionCars(cars[1]);
        }
        //cars.forEach(checkCollisionCars);
        if (player.x > 467 && (player.x+player.width) < 667){
          logs.forEach(checkCollisionLog);
        }
        checkForNewLevel();
    }

  if(livesLeft < 1){
    gameEnd = true;
  }

  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  if(gameEnd){
      ctx.fillStyle = "blue";
      ctx.fillRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.font = "bold 30px Arial";
      ctx.fillText("Game Over: level "+ level, 760/2, 480/2);
  }
  else{
      ctx.fillStyle = "lightblue";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0);
      cars.forEach(function(car){car.render(elapsedTime, ctx)});
      logs.forEach(function(log){log.render(elapsedTime, ctx)});
      player.render(elapsedTime, ctx);
  }
  levelDom.innerHTML = level;
  livesDom.innerHTML = livesLeft;
}

function checkCollisionCars(car){
    var collision = false;
    if(!((player.x + player.width) < car.x ||  player.x > (car.x + car.width) ||  (player.y + player.height) < car.y ||  player.y > (car.y + car.height))){
      collision = true;
    }
    if(collision){
        player.x = 0;
        player.y = 240;
        player.frame = 0;
        player.state = "idle";
        livesLeft --;
    }
}

function checkCollisionLog(log){
    var collision = false;
    if(!((player.x + player.width) < log.x ||  player.x > (log.x + log.width) ||  (player.y + player.height) < log.y ||  player.y > (log.y + log.height))){
        collision = true;
    }
    if(!collision){
        player.x = 0;
        player.y = 240;
        player.frame = 0;
        player.state = "idle";
        livesLeft --;
    }
}
function checkForNewLevel(){
    if(player.x+64 > canvas.width){
        level++;
        player.x = 0;
        player.y = 240;
        player.frame = 0;
        player.state = "idle";
    }
}

},{"./car.js":2,"./entity-manager.js":3,"./game.js":4,"./log.js":5,"./player.js":6}],2:[function(require,module,exports){
"use strict";

module.exports = exports = Car;

function Car(speed, x, y){
    this.carUp = new Image();
    this.carUp.src = encodeURI('assets/car.png');
    this.width = 75;
    this.height = 125;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.state = "up";

    var self = this;
    this.moving = function(){
        if(this.state == "down"){
            this.y +=this.speed;
        }
        else if(this.state == "up"){
            this.y -=this.speed;
        }
    }
    this.determinDir = function(){
        if((self.y + self.height) > 480){
            self.state = "up";
        }
        else if(self.y < 0){
            self.state = "down";
        }
    }
}

Car.prototype.update = function(time, level){
    this.determinDir();
    this.moving();
    this.speed = level;
}

Car.prototype.render = function(time, ctx){
    ctx.drawImage(this.carUp, 0,0,this.width,this.height,
    this.x,this.y,this.width,this.height);
}

},{}],3:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize){
  this.worldWidth = width;
  this.worldHeight = height;
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width/cellSize);
  this.numberOfCells = this.widthInCells * Math.ceil(height/cellSize);
  this.cells = [];
  for(var i =0; i<this.numberOfCells;i++){
    this.cells[i] = [];
  }
}

EntityManager.prototype.addEntity = function(entity){
    var index = Math.floor(entity.x/this.cellSize);
    this.cells[index].push(entity);
}

EntityManager.prototype.updateEntity = function(entity) {
  this.cells.forEach(function(entity){
   entity.update(elapsedTime);
 });
}

EntityManager.prototype.render = function(elapsedTime, ctx) {
  this.cells.forEach(function(entity){
    entity.render(elapsedTime, ctx);
  });
  }


function testForRectCollision(r1, r2) {
  return !( r1.x > r2.x + r2.width ||
            r1.x + r1.width < r2.width ||
            r1.y > r2.y + r2.height ||
            r1.y + r1.height < r2.y
          );
}

EntityManager.prototype.queryRect = function(x, y, width, height) {
  this.cells.filter(function(entity) {
    return testForRectCollision(entity, {x: x, y: y, width: width, height: height});
  });
}

EntityManager.prototype.processCollisions = function(callback) {
  this.entities.forEach(function(entity1){
    this.entities.forEach(function(entity2){
      if(entity1 !== entity2 && testForRectCollision(entity1, entity1))
        callback(entity1, entity2);
    });
  });
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],5:[function(require,module,exports){
"use strict";

module.exports = exports = Log;

function Log(speed, x, y){
    this.image = new Image();
    this.image.src = './assets/log.png';
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 200;
    this.state = "up";
    this.moving = function(){
        if(this.state == "down"){
            this.y +=this.speed;
        }
        else if(this.state == "up"){
            this.y -=this.speed;
        }
    }
    this.determinDir = function(){
        if((this.y + this.height) > 480){
            this.state = "up";
        }
        else if(this.y < 0){
            this.state = "down";
        }
    }
}
Log.prototype.update = function(time){
    this.determinDir();
    this.moving();
}

Log.prototype.render = function(time, ctx){
    ctx.drawImage(this.image, 0,0,this.width,this.height,
    this.x,this.y,this.width,this.height);
}

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/4;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;

  var self = this;
  window.onkeydown = function(event){
      event.preventDefault();
      if(event.keyCode == 39 && self.state == "idle"){
          self.state = "jumping";
      }
      else if(event.keyCode == 40 && self.state =="idle"){
          self.state = "down";
      }
      else if(event.keyCode == 38 && self.state =="idle"){
          self.state = "up";
      }
  }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    case "jumping":
        this.timer += time;
        this.x +=2;
        if(this.timer > MS_PER_FRAME) {
          this.timer = 0;
          this.frame += 1;
          if(this.frame > 3){
              this.frame = 0;
              this.state = "idle";
          }
        }
      break;
    case "up":
        this.timer += time;
        this.y -=2;
        if(this.timer > MS_PER_FRAME) {
            this.timer = 0;
            this.frame += 1;
            if(this.frame > 3){
                this.frame = 0;
                this.state = "idle";
            }
        }
        break;
    case "down":
        this.timer += time;
        this.y +=2;
        if(this.timer > MS_PER_FRAME) {
            this.timer = 0;
            this.frame += 1;
            if(this.frame > 3){
                this.frame = 0;
                this.state = "idle";
            }
        }
        break;


    // TODO: Implement your player's update by state
  }
}
/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "jumping":
        ctx.drawImage(
          // image
          this.spritesheet,
          // source rectangle
          this.frame * 64, 0, this.width, this.height,
          // destination rectangle
          this.x, this.y, this.width, this.height
        );
        break;
    case "up":
        ctx.drawImage(
          // image
          this.spritesheet,
          // source rectangle
          this.frame * 64, 0, this.width, this.height,
          // destination rectangle
          this.x, this.y, this.width, this.height
        );
        break;
    case "down":
        ctx.drawImage(
          // image
          this.spritesheet,
          // source rectangle
          this.frame * 64, 0, this.width, this.height,
          // destination rectangle
          this.x, this.y, this.width, this.height
        );
        break;
    // TODO: Implement your player's redering according to state
  }
}

},{}]},{},[1]);
