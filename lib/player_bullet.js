import PIXI from 'pixi.js';
import MovingObject from './moving_object';
import HitBoxObject from './hitbox_object';
import SAT from "sat";

class PlayerBullet extends PIXI.Container {

  constructor (position, rotation, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.velX = 10 * (Math.cos(rotation - Math.PI / 2));
    this.velY = 10 * (Math.sin(rotation - Math.PI / 2));
    this.rotation = rotation;
    HitBoxObject.setUpHitBox(this, 4, 8);
    this.hitBox.rotation = rotation;
    this.game = game;
    this.baseTexture = PIXI.loader.resources.player_bullet.texture;
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
    for (let i = 0; i < this.game.enemies.children.length; i++) {
      this.checkCollision(this.game.enemies.children[i]);
    }
  }

  checkCollision (object) {
    if ((object.x - this.x) < object.width && (object.x - this.x) > -(object.width) &&
     (object.y - this.y) < object.height && (object.y - this.y) > -(object.height)) {
       if (SAT.testPolygonPolygon(object.hitBox, this.hitBox)) {
         object.healthLost += 30;
         this.game.projectiles.removeChild(this);

       }
     }
  }



}


export default PlayerBullet;
