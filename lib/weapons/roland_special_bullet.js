import PIXI from 'pixi.js';
import SAT from 'sat';
import MovingObject from '../behaviors/moving_object';
import HitBoxObject from '../behaviors/hitbox_object';
import ProjectileObject from '../behaviors/projectile_object';
import ExplosiveObject from '../behaviors/explosive_object';


class RolandSpecialBullet extends PIXI.Container {
  constructor (position, rotation, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.velX = 15 * (Math.cos(rotation - Math.PI / 2));
    this.velY = 15 * (Math.sin(rotation - Math.PI / 2));
    this.rotation = rotation;
    HitBoxObject.setUpHitBox(this, 4, 8);
    this.hitBox.rotation = rotation;
    this.game = game;
    this.exploding = false;
    this.animationFrame = 0;
    this.frameDuration = 3;
    this.baseTexture = PIXI.loader.resources.roland_special_bullet0.texture;
    this.sprite = new PIXI.Sprite(this.baseTexture);
    [this.sprite.scale.x, this.sprite.scale.y] = [0.75, 0.75];
    this.addChild(this.sprite);
    this.behaviors = [MovingObject, HitBoxObject];
    this.game.projectiles.push(this);

  }

  onWallCollision (response, wall) {
    if (wall.sprite.texture !== PIXI.loader.resources.blank_wall.texture) {
      this.startExplosion = true;
    }
  }

  move () {
    if (this.startExplosion) {
      this.explode();
    } else if (!this.exploding) {
      for (let i = 0; i < this.behaviors.length; i++) {
        this.behaviors[i].update(this);
        this.behaviors[i].render(this);
      }
      for (let i = 0; i < this.game.enemies.length; i++) {
        this.checkCollision(this.game.enemies[i]);
      }
      if (this.animationFrame > 2) {
        this.animationFrame = 0;
      }
      this.sprite.texture = PIXI.loader.resources["roland_special_bullet" + this.animationFrame].texture
    } else {
      this.animateExplosion();
    }
    this.animationFrame++;
  }

  explode () {
    this.startExplosion = false;
    this.exploding = true;
    this.animationFrame = 0;
    HitBoxObject.setUpCircularHitBox(this, 60);
  }

  checkCollision (object) {
    if ((object.x - this.x) < object.width && (object.x - this.x) > -(object.width) &&
     (object.y - this.y) < object.height && (object.y - this.y) > -(object.height)) {
       if (SAT.testPolygonPolygon(object.hitBox, this.hitBox)) {
         this.startExplosion = true;
       }
     }
   }

   checkExplosionCollision (object) {
     if ((object.x - this.x) < object.width && (object.x - this.x) > -(object.width) &&
      (object.y - this.y) < object.height && (object.y - this.y) > -(object.height)) {
        if (SAT.testPolygonCircle(object.hitBox, this.hitBox)) {
          object.healthLost = 60;
          if (object.healthLost < object.health) {
            ExplosiveObject.knockback(object, this, 50);
          }
        }
      }
   }

   animateExplosion () {
     let i = this.animationFrame / this.frameDuration;
     if (i > 1) {
        for (let i = 0; i < this.game.enemies.length; i++) {
          this.checkExplosionCollision(this.game.enemies[i]);
        }
        for (let i = 0; i < this.game.players.length; i++) {
          this.checkExplosionCollision(this.game.players[i]);
        }
        ProjectileObject.removeFromGameArray(this);
     }
    //  if (i === 26)  {
    //    this.sprite.texture = PIXI.loader.resources["dynamite" + i].texture;
    //    [this.sprite.scale.x, this.sprite.scale.y] = [1.5, 1.5];
    //  } else if (i >= 33) {
    //    this.sprite.texture = PIXI.loader.resources["dynamite" + 32].texture;
    //    let opacityLevel = 1 / (i - 32);
    //    this.sprite.alpha = opacityLevel;
    //    if (i === 36) {
    //    }
    //  } else {
    //    this.sprite.texture = PIXI.loader.resources["dynamite" + i].texture;
    //  }
   }


}

export default RolandSpecialBullet;
