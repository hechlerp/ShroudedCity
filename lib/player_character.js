import PIXI from 'pixi.js';
import Game from './game';
import HpObject from './behaviors/hp_object';
import MovingObject from './behaviors/moving_object';
import HitBoxObject from './behaviors/hitbox_object';
import PlayerBullet from './weapons/player_bullet';
import Dynamite from './weapons/dynamite';
import SAT from 'sat';

class PlayerCharacter extends PIXI.Container {
  constructor(position, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.velX = 0;
    this.velY = 0;
    this.baseTexture = PIXI.loader.resources.player.texture;
    this.sprite = new PIXI.Sprite(this.baseTexture);
    [this.sprite.anchor.x, this.sprite.anchor.y]  = [0.5, 0.5];
    this.addChild(this.sprite);
    this.game = game;
    this.direction = "down";
    this.setUpDirectionsObject();
    this.primaryAttackDelay = 0;
    this.primaryAttackLockout = false;
    this.secondaryAttackDelay = 0;
    this.secondaryAttackLockout = false;

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
    this.game.gameOver();
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
    if (key.isPressed("up")) {
      if (key.isPressed("left") || key.isPressed("right")) {
        this.velY  = -(3 * (1 / Math.sqrt(2)))
      } else {
        this.velY = -3;
      }
    }
    if (key.isPressed("left")) {
      if (key.isPressed("up")  || key.isPressed("down")) {
        this.velX = -(3 * (1 / Math.sqrt(2)))
      } else {
        this.velX = -3;
      }
    }
    if (key.isPressed("down")) {
      if (key.isPressed("left") || key.isPressed("right")) {
        this.velY = 3 * (1 / Math.sqrt(2))
      } else {
        this.velY = 3;
      }
    }
    if (key.isPressed("right")) {
      if (key.isPressed("up")  || key.isPressed("down")) {
        this.velX = 3 * (1 / Math.sqrt(2))
      } else {
        this.velX = 3;
      }
    }
    MovingObject.determineDirection(this);

    if (this.primaryAttackLockout) {
      this.primaryAttackDelay++;
      if (this.primaryAttackDelay > 30) {
        this.primaryAttackLockout = false;
        this.primaryAttackDelay = 0;
      }
    } else if (key.isPressed("a") && !this.primaryAttackLockout) {
      this.primaryAttack();
    }
    if (this.secondaryAttackLockout) {
      this.secondaryAttackDelay++;
      if (this.secondaryAttackDelay > 80) {
        this.secondaryAttackLockout = false;
        this.secondaryAttackDelay = 0;
      }
    } else if (key.isPressed("s") && !this.secondaryAttackLockout) {
      this.secondaryAttack();
    }
    if (!this.leftRoom && (this.x > Game.dim_x || this.x < 0 || this.y > Game.dim_y || this.y < 0)) {
      this.leftRoom = true;
      this.leaveRoom();
    }



    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this)
      this.behaviors[i].render(this)
    }

    for (let i = 0; i < this.game.items.children.length; i++) {
      if ((this.game.items.children[i].x - this.x) < this.game.items.children[i].width && (this.game.items.children[i].x - this.x) > -(this.game.items.children[i].width) &&
       (this.game.items.children[i].y - this.y) < this.game.items.children[i].height && (this.game.items.children[i].y - this.y) > -(this.game.items.children[i].height)) {
         if (SAT.testPolygonPolygon(this.game.items.children[i].hitBox, this.hitBox)) {
           this.game.items.children[i].pickUp(this);
         }
      }
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



  primaryAttack () {
    this.primaryAttackLockout = true;
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

    let xDisplacement = 20 * directionToFire[0]
    let yDisplacement = 30 * directionToFire[1]
    let bullet = new PlayerBullet([this.x + xDisplacement, this.y + yDisplacement], rotation, this.game)
    this.game.projectiles.addChild(bullet);
  }

  secondaryAttack () {
    this.secondaryAttackLockout = true;
    let dynamite = new Dynamite([this.x, this.y], this.game);
    this.game.projectiles.addChild(dynamite);
  }

  onWallCollision (response) {
    let pushBack = response.overlapV
    this.x -= pushBack.x;
    this.y -= pushBack.y;
  }

  leaveRoom () {
    if (this.x > Game.dim_x) {
      this.game.changeRoom([1,0]);
      this.x = this.width / 4;
    } else if (this.x < 0) {
      this.game.changeRoom([-1,0]);
      this.x = Game.dim_x - this.width / 4;
    } else if (this.y > Game.dim_y) {
      this.game.changeRoom([0, 1]);
      this.y = this.height / 4;
    } else {
      this.game.changeRoom([0, -1]);
      this.y = Game.dim_y - this.height / 4;
    }
    this.leftRoom = false;
  }

  // Gun guy with shoot, dynamite, shoot explosive bullet
  // Knife girl with throw, slash, and flurry of knives
  // Spear/shield girl with stab, block, whirl
  // Chain guy with slap, grab, and make chain super.
}

export default PlayerCharacter;
