import PIXI from 'pixi.js';
import MovingObject from '../behaviors/moving_object';
import HitBoxObject from '../behaviors/hitbox_object';
import SAT from "sat";

class Murk extends PIXI.Container {

  constructor (position, angle, flip, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.velX = 6 * (Math.cos(angle)) * flip;
    this.velY = 6 * (Math.sin(angle)) * flip;
    HitBoxObject.setUpHitBox(this, 8, 8);

    this.game = game;
    this.baseTexture = PIXI.loader.resources.murk.texture;
    this.sprite = new PIXI.Sprite(this.baseTexture);
    [this.sprite.anchor.x, this.sprite.anchor.y] = [0.5, 0.5];
    this.addChild(this.sprite);
    this.behaviors = [MovingObject, HitBoxObject];
    this.game.projectiles.addChild(this);
  }

  onWallCollision () {
    this.game.projectiles.removeChild(this);
  }

  move () {
    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this);
      this.behaviors[i].render(this);
    }
    this.rotation += Math.PI / 16;
    this.checkCollision(this.game.player);
    this.scaleUp()
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

  scaleUp () {
    // Make the ball grow
    this.sprite.scale.x += 0.02;
    this.sprite.scale.y += 0.02;
    HitBoxObject.setUpHitBox(this, this.sprite.width, this.sprite.height);
  }
}

export default Murk;
