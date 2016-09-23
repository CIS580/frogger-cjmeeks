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
        if ((player.x+player.width) > 467 && (player.x+player.width) < 667){
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
