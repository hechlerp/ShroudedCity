import PIXI from 'pixi.js';
import HpObject from './hp_object';
import MovingObject from './moving_object';
import HitBoxObject from './hitbox_object';
import PlayerBullet from './player_bullet';
import SAT from 'sat';

class PlayerCharacter extends PIXI.Container {
  constructor(position, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.velX = 0;
    this.velY = 0;
    this.baseTexture = new PIXI.Texture.fromImage('./assets/sprites/forward.png');
    this.sprite = new PIXI.Sprite(this.baseTexture);
    [this.sprite.anchor.x, this.sprite.anchor.y]  = [0.5, 0.5];
    this.addChild(this.sprite);
    this.game = game;
    this.direction = "down";
    this.setUpDirectionsObject();
    this.attackDelay = 0;
    this.attackLockout = false;

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.healthLost = 0;
    this.healthGained = 0;
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar);
    this.behaviors = [HpObject, MovingObject, HitBoxObject];

    HitBoxObject.setUpHitBox(this, 24, 48);
  }

  dies () {

  }

  move () {

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
    if (key.isPressed("up") || key.isPressed("w")) {
      if (key.isPressed("left") || key.isPressed("a") || key.isPressed("right") || key.isPressed("d")) {
        this.velY  = -(3 * (1 / Math.sqrt(2)))
      } else {
        this.velY = -3;
      }
    }
    if (key.isPressed("left") || key.isPressed("a")) {
      if (key.isPressed("up") || key.isPressed("w") || key.isPressed("down") || key.isPressed("s")) {
        this.velX = -(3 * (1 / Math.sqrt(2)))
      } else {
        this.velX = -3;
      }
    }
    if (key.isPressed("down") || key.isPressed("s")) {
      if (key.isPressed("left") || key.isPressed("a") || key.isPressed("right") || key.isPressed("d")) {
        this.velY = 3 * (1 / Math.sqrt(2))
      } else {
        this.velY = 3;
      }
    }
    if (key.isPressed("right") || key.isPressed("d")) {
      if (key.isPressed("up") || key.isPressed("w") || key.isPressed("down") || key.isPressed("s")) {
        this.velX = 3 * (1 / Math.sqrt(2))
      } else {
        this.velX = 3;
      }
    }

    if (this.attackLockout) {
      this.attackDelay ++;
      if (this.attackDelay > 30) {
        this.attackLockout = false;
        this.attackDelay = 0;
      }
    } else if (key.isPressed("space") && !this.attackLockout) {
      this.primaryAttack();
    }


    this.determineDirection();


    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this)
      this.behaviors[i].render(this)
    }


  }

  setUpDirectionsObject () {
    this.directionObject = {
      "down": [0, 1],
      "downright": [1, 1],
      "right": [1, 0],
      "upright": [1, -1],
      "up": [0, -1],
      "upleft": [-1, -1],
      "left": [-1, 0],
      "downleft": [-1, 1]
    }
  }

  determineDirection () {
    if (this.velX === 0 && this.velY === 0) {
    } else {
      this.direction = "";
      if (this.velY > 0) {
        this.direction += "down"
      } else if (this.velY < 0) {
        this.direction += "up"
      }
      if (this.velX > 0) {
        this.direction += "right"
      } else if (this.velX < 0) {
        this.direction += "left"
      }
    }

  }

  primaryAttack () {
    this.attackLockout = true;
    let directionToFire = this.directionObject[this.direction]
    let rotation = 0;
    if (directionToFire[0] !== 0) {
      rotation += (Math.PI / 2) * directionToFire[0];
      if (rotation > 0) {
        rotation += (Math.PI / 4) * directionToFire[1];
      } else {
        rotation -= (Math.PI / 4) * directionToFire[1];
      }

    } else if (directionToFire[1] === 1) {
      rotation = Math.PI
    }
    // Math.PI / 2 * xVal.
    // Math.PI / 4 * yVal
    let bullet = new PlayerBullet([this.x, this.y], rotation, this.game)
    this.game.projectiles.addChild(bullet);
  }

  onWallCollision (response) {
    let pushBack = response.overlapV
    this.x -= pushBack.x;
    this.y -= pushBack.y;
  }

  // showHitBox() {
  //   this.hitBox.clear();
  //   this.hitBox.beginFill(0xFFFFFF);
  //   let border = this.getBounds();
  //   this.hitBox.moveTo(border.x, border.y)
  //   this.hitBox.lineTo(border.x + this.width, border.y);
  //   this.hitBox.lineTo(border.x + this.width, border.y + this.height);
  //   this.hitBox.lineTo(border.x, border.y + this.height);
  //   this.hitBox.lineTo(border.x, border.y);
  //   this.hitBox.endFill;
  //
  // }




}

export default PlayerCharacter;
