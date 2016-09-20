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
