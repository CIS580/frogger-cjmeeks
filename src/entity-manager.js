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
}
