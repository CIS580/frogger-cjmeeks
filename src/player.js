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
