(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const EntityManager = require('./entity-manager.js');
const Car = require ('./car.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var em = new EntityManager();
var level = 1;
var cars = [];
for(var i = 0; i < 2; i++){
  cars.push(new Car(level,
    Math.random()*20 + 100,
    Math.random()*canvas.height
  ));
}



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
  player.update(elapsedTime);
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
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.render(elapsedTime, ctx);
  for(var i = 0; i < cars.length; i++){
    cars[i].active = true;
    cars[i].render;
  }
}

},{"./car.js":2,"./entity-manager.js":3,"./game.js":4,"./player.js":5}],2:[function(require,module,exports){
"use strict";

module.exports = exports = Car;

function Car(speed, x, y){
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/cars_mini.svg');
    this.width = 200;
    this.height = 400;
    this.speed = speed;
    this.x = x;
    this.y = 0;
    this.active = false;

    var self = this;
    this.moving = function(time){
        self.y +=1;
    }
}

Car.prototype.update = function(time){
    if(!this.active) return;
    this.move(time);
}

Car.prototype.render = function(time, ctx){
    if(!this.active) return;
    ctx.drawImage(this.spritesheet, this.width-20,0,this.width,this.height,
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

const MS_PER_FRAME = 1000/8;

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
      if(event.keyCode == 39 && self.state == "idle"){
          self.state = "jumping";
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
        this.x +=1;
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
    // TODO: Implement your player's redering according to state
  }
}

},{}]},{},[1]);
