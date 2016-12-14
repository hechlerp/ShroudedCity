import PIXI from 'pixi.js';
import HitBoxObject from '../behaviors/hitbox_object';
import ExplosiveObject from '../behaviors/explosive_object';
import SAT from "sat";

class Dynamite extends PIXI.Container {
  constructor (position, game) {
    super();
    [this.x, this.y] = [position[0], position[1] + 55];
    HitBoxObject.setUpCircularHitBox(this, 85);
    this.game = game;
    this.baseTexture = PIXI.loader.resources.dynamite0.texture;
    this.sprite = new PIXI.Sprite(this.baseTexture);
    [this.sprite.anchor.x, this.sprite.anchor.y] = [0.5, 1];
    this.addChild(this.sprite);
    this.animationFrame = 1;
    this.frameDuration = 3;
    this.game.projectiles.addChild(this);

  }

  move () {
    if (this.animationFrame % this.frameDuration === 0) {
      this.animateDynamite();
    }
    this.animationFrame++;
  }

  animateDynamite () {
    let i = this.animationFrame / this.frameDuration;
    if (i === 26)  {
      this.sprite.texture = PIXI.loader.resources["dynamite" + i].texture;
      [this.sprite.scale.x, this.sprite.scale.y] = [1.5, 1.5];
      for (let i = 0; i < this.game.enemies.children.length; i++) {
        this.checkCollision(this.game.enemies.children[i])
      }
      this.checkCollision(this.game.player);
    } else if (i >= 33) {
      this.sprite.texture = PIXI.loader.resources["dynamite" + 32].texture;
      let opacityLevel = 1 / (i - 32);
      this.sprite.alpha = opacityLevel;
      if (i === 36) {
        this.game.projectiles.removeChild(this);
      }
    } else {
      this.sprite.texture = PIXI.loader.resources["dynamite" + i].texture;
    }
  }

  checkCollision (object) {
    if ((object.x - this.x) < this.width && (object.x - this.x) > -(this.width) &&
     (object.y - this.y) < this.height && (object.y - this.y) > -(this.height)) {
       if (SAT.testPolygonCircle(object.hitBox, this.hitBox)) {
         object.healthLost += 70;
         if (object.healthLost < object.health) {
           ExplosiveObject.knockback(object, this, 40);
         }
       }
   }
  }


}

export default Dynamite;
