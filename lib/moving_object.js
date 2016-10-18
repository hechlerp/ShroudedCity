
const MovingObject = {

  move (object) {
    object.x += object.velX;
    object.y += object.velY;
  },

  enforceBoundaries (object) {

    /* Change this to implement a 2d grid, using modulo and Math.floor to find
      the player's position in the grid. Certain parts will be marked as
      "contains wall segment" and can contain the segment itself. Then, check
      player against the wall segment collision.
   */
    let wall = object.game.wall.children;
    for (let i = 0; i < wall.length; i++) {
      wall[i].checkCollision(object);
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
