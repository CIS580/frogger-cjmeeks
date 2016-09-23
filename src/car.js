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
