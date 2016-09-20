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
