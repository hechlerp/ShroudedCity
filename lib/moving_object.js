
const MovingObject = {
// behaviors array, call render on each behavior.
  move: (object) => {
    object.x += object.velX;
    object.y += object.velY;
  },

  enforceBoundaries: (object) => {
    if (object.x > 800 || object.x < 100) {
      object.velX = -(object.velX)
    }
    if (object.y > 500 || object.y < 100) {
      object.velY = -(object.velY)
    }
  },

  render (object) {
    this.move(object)
    this.enforceBoundaries(object)
  },

  update (object) {

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
