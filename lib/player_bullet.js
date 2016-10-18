import PIXI from 'pixi.js';
import MovingObject from './moving_object';
import HitBoxObject from './hitbox_object';

class PlayerBullet extends PIXI.Container {

  constructor (position, rotation, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.velX = 10 * (Math.cos(rotation - Math.PI / 2));
    this.velY = 10 * (Math.sin(rotation - Math.PI / 2));
    this.rotation = rotation;
    HitBoxObject.setUpHitBox(this, 10, 16);
    this.game = game;
    this.baseTexture = new PIXI.Texture.fromImage('assets/sprites/bullet_attempt.png');
    this.sprite = new PIXI.Sprite(this.baseTexture);
    this.addChild(this.sprite);
    this.behaviors = [MovingObject, HitBoxObject];
  }

  onWallCollision () {
    this.game.projectiles.removeChild(this);
  }

  move () {
    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this);
      this.behaviors[i].render(this);
    }
  }



}


export default PlayerBullet;
