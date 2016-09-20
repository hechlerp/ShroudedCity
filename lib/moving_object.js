import PIXI from 'pixi.js'


class MovingObject extends PIXI.Sprite {
  constructor(texture, velocity) {
    super(texture);
    this.velocityX = velocity[0];
    this.velocityY = velocity[1];
    this.health = Infinity;
  }
  move() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.collision();
  }
  collision() {
    if (this.x > 800 || this.x < 100) {
      this.velocityX = -(this.velocityX)
    }
    if (this.y > 500 || this.y < 100) {
      this.velocityY = -(this.velocityY)
    }
  }
  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.dies();
    }
  }
  dies() {
    if (this !== this.game.player) {
      this.game.masterContainer..enemies.removeChild(this);
    } else {
      this.deathAnimation();
    }
  }

}

export default MovingObject;
