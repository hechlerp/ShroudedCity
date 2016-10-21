
const MovingObject = {

  move (object) {
    object.x += object.velX;
    object.y += object.velY;
  },

  enforceBoundaries (object) {

    // TODO stop double collisions from super accelerating bunnies
    // TODO account for rotation

    let fourCorners = [];
    fourCorners.push([
      Math.floor((object.x + object.hitBox.calcPoints[0].x) / object.game.currentRoom.wallSize),
      Math.floor((object.y + object.hitBox.calcPoints[0].y) / object.game.currentRoom.wallSize)
    ]);

    fourCorners.push([
      Math.floor((object.x + object.hitBox.calcPoints[1].x) / object.game.currentRoom.wallSize),
      Math.floor((object.y + object.hitBox.calcPoints[1].y) / object.game.currentRoom.wallSize)
    ]);

    fourCorners.push([
      Math.floor((object.x + object.hitBox.calcPoints[2].x) / object.game.currentRoom.wallSize),
      Math.floor((object.y + object.hitBox.calcPoints[2].y) / object.game.currentRoom.wallSize)
    ]);

    fourCorners.push([
      Math.floor((object.x + object.hitBox.calcPoints[3].x) / object.game.currentRoom.wallSize),
      Math.floor((object.y + object.hitBox.calcPoints[3].y) / object.game.currentRoom.wallSize)
    ]);

    for (let i = 0; i < fourCorners.length; i++) {

      if (object.game.room[fourCorners[i][1]][fourCorners[i][0]] !== "blank") {
        object.game.room[fourCorners[i][1]][fourCorners[i][0]].checkCollision(object);
      }
    }


  },

  render (object) {
    this.move(object)
  },

  update (object) {
    this.enforceBoundaries(object)

  }

}


// class MovingObject extends PIXI.Sprite {
//   constructor(texture, velocity) {
//     super(texture);
//     this.velocityX = velocity[0];
//     this.velocityY = velocity[1];
//     this.health = Infinity;
//   }
//   move() {
//     this.x += this.velocityX;
//     this.y += this.velocityY;
//     this.collision();
//   }
//   collision() {
//     if (this.x > 800 || this.x < 100) {
//       this.velocityX = -(this.velocityX)
//     }
//     if (this.y > 500 || this.y < 100) {
//       this.velocityY = -(this.velocityY)
//     }
//   }
//   takeDamage(damage) {
//     this.health -= damage;
//     if (this.health <= 0) {
//       this.health = 0;
//       this.dies();
//     }
//   }
  // dies() {
  //   if (this !== this.game.player) {
  //     this.game.masterContainer.enemies.removeChild(this);
  //   } else {
  //     this.deathAnimation();
  //   }
  // }



export default MovingObject;
