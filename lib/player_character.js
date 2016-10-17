import PIXI from 'pixi.js';
import HpObject from './hp_object';
import MovingObject from './moving_object';
import HitBoxObject from './hitbox_object';
import SAT from 'sat';

class PlayerCharacter extends PIXI.Container {
  constructor(position, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.velX = 0;
    this.velY = 0;
    this.baseTexture = new PIXI.Texture.fromImage('./assets/sprites/forward.png');
    this.sprite = new PIXI.Sprite(this.baseTexture);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.addChild(this.sprite);


    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.healthLost = 0;
    this.healthGained = 0;
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar);
    this.behaviors = [HpObject, MovingObject, HitBoxObject];

    HitBoxObject.setUpHitBox(this, 24, 48);
  }

  dies() {

  }

  move() {

    // Diagonal speed (thanks Gautham)
    // (total speed)^2 = (s1)^2 + (s2)^2
    //(new speed = (a * s1)^2 + (a * s2)^2
    //(newspeed)^2 = 2(a^2)(total speed ^2)
    // new speed = sqrt(2) * a * former speed
    // new speed = former speed and solve for a
    // 1 =sqrt(2) * a
    // a = 1/sqrt(2)
    this.velY = 0
    this.velX = 0

    // Add animations here
    if (key.isPressed("down")) {
      if (key.isPressed("left") || key.isPressed("right")) {
        this.velY = 3 * (1 / Math.sqrt(2))
      } else {
        this.velY = 3;
      }
    }
    if (key.isPressed("up")) {
      if (key.isPressed("left") || key.isPressed("right")) {
        this.velY  = -(3 * (1 / Math.sqrt(2)))
      } else {
        this.velY = -3;
      }
    }
    if (key.isPressed("right")) {
      if (key.isPressed("up") || key.isPressed("down")) {
        this.velX = 3 * (1 / Math.sqrt(2))
      } else {
        this.velX = 3;
      }
    }
    if (key.isPressed("left")) {
      if (key.isPressed("up") || key.isPressed("down")) {
        this.velX = -(3 * (1 / Math.sqrt(2)))
      } else {
        this.velX = -3;
      }
    }

    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this)
      this.behaviors[i].render(this)
    }


    // console.log(this.hitBox.calcPoints[0]);

  }

  showHitBox() {
    this.hitBox.clear();
    this.hitBox.beginFill(0xFFFFFF);
    let border = this.getBounds();
    this.hitBox.moveTo(border.x, border.y)
    this.hitBox.lineTo(border.x + this.width, border.y);
    this.hitBox.lineTo(border.x + this.width, border.y + this.height);
    this.hitBox.lineTo(border.x, border.y + this.height);
    this.hitBox.lineTo(border.x, border.y);
    this.hitBox.endFill;

  }




}

export default PlayerCharacter;
