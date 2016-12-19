import MovingObject from '../behaviors/moving_object';
import HpObject from '../behaviors/hp_object';
import HitBoxObject from '../behaviors/hitbox_object'
import ItemDropObject from '../behaviors/item_drop_object';
import EnemyObject from '../behaviors/enemy_object';
import Murk from '../weapons/murk';
import SAT from 'sat';
import PIXI from 'pixi.js';

class Murkspawn extends PIXI.Container {
  constructor (position, direction, game) {
    super()
    this.x = position[0];
    this.y = position[1];
    this.setUpTextures();
    this.sprite = new PIXI.Sprite(this.textures["move0"]);
    [this.sprite.anchor.x,this.sprite.anchor.y] = [0.5, 0.5];
    this.maxHealth = 150;
    this.health = this.maxHealth;
    this.healthLost = 0;
    this.healthGained = 0;
    this.attackDelay = 0;
    this.attacking = false;
    this.game = game;
    this.baseSpeed = 0.75;
    this.velX = this.baseSpeed * direction[0];
    this.velY = this.baseSpeed * direction[1];
    this.aware = true;
    this.addChild(this.sprite);
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar);
    HitBoxObject.setUpHitBox(this, 120, 100);
    this.behaviors = [MovingObject, HpObject, HitBoxObject];
    this.game.enemies.addChild(this);
  }

  move (timeDelta) {

    if (timeDelta % 40 === 0) {
      this.movementSwitch();
    }

    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this);
      this.behaviors[i].render(this);
    }
    if (this.aware) {
      if (this.attacking === false) {
        this.animateMovement(timeDelta);
        this.attackDelay++;
      } else {
        this.attackCounter++
        if (this.attackCounter > 10) {
          this.fireMurk(this.game.player);
        }
      }
      if (this.attackDelay > 160) {
        this.attack(this.game.player, timeDelta);
      }
    }
  }

  animateMovement (timeDelta) {
    if (timeDelta % 9 === 0 && (this.velX !== 0 || this.velY !== 0)) {
      this.sprite.texture = this.textures["move" + timeDelta % 4];
    }
  }

  onWallCollision (response) {
    let vector = response.overlapN;
    if (vector.x > 0 && this.velX > 0) {
      this.velX = -(this.baseSpeed);
    } else if (vector.x < 0 && this.velX < 0) {
      this.velX = this.baseSpeed;
    }
    if (vector.y > 0 && this.velY > 0) {
      this.velY = -(this.baseSpeed);
    } else if (vector.y < 0 && this.velY < 0) {
      this.velY = this.baseSpeed;
    }

    this.storeVel(this.velX, this.velY);
  }

  attack (target, timeDelta) {
    this.attacking = true;
    this.sprite.texture = this.textures["attack" + Math.floor(timeDelta % 4)];

    this.storeVel(this.velX, this.velY);
    [this.velX, this.velY] = [0,0];
    this.attackDelay = 0;
    this.attackCounter = 0;
  }

  fireMurk (target) {
    let slope = (target.y - this.y + 32) / (target.x - this.x);
    let angle = Math.atan(slope);
    let flip = 1;
    if (this.x > target.x) {
      flip = -1;
    }
    let murk = new Murk([this.x, this.y - 32], angle, flip, this.game);
    [this.velX, this.velY] = this.prevVel
    this.attacking = false;
  }

  movementSwitch () {
    let rngesus = Math.random(0) * 100;
    if (rngesus > 79 && rngesus <= 84 ) {
      this.velX = -this.baseSpeed
      this.velY = 0;
    } else if (rngesus > 84 && rngesus <= 89) {
      this.velY = -this.baseSpeed
      this.velX = 0;
    } else if (rngesus > 89 && rngesus <= 94) {
      this.velX = this.baseSpeed
      this.velY = 0;
    } else if (rngesus > 94 && rngesus <= 99) {
      this.velY = this.baseSpeed
      this.velX = 0;
    }
  }

  storeVel (velX, velY) {
    this.prevVel = [velX, velY];
  }

  dies () {
    this.dead = true;
    ItemDropObject.normalEnemyDrop(this);
    this.game.enemies.removeChild(this);
    EnemyObject.checkClear(this)
  }

  setUpTextures () {
    this.textures = {
      "move0": PIXI.loader.resources.murkspawn_move0.texture,
      "move1": PIXI.loader.resources.murkspawn_move1.texture,
      "move2": PIXI.loader.resources.murkspawn_move2.texture,
      "move3": PIXI.loader.resources.murkspawn_move3.texture,
      "attack0": PIXI.loader.resources.murkspawn_attack0.texture,
      "attack1": PIXI.loader.resources.murkspawn_attack1.texture,
      "attack2": PIXI.loader.resources.murkspawn_attack2.texture,
      "attack3": PIXI.loader.resources.murkspawn_attack3.texture,
    }
  }


}

export default Murkspawn;
