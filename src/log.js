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
