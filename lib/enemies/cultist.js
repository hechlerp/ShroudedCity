import MovingObject from '../behaviors/moving_object';
import HpObject from '../behaviors/hp_object';
import HitBoxObject from '../behaviors/hitbox_object'
import ItemDropObject from '../behaviors/item_drop_object';
import EnemyObject from '../behaviors/enemy_object';
import SAT from 'sat';
import PIXI from 'pixi.js';

class Cultist extends PIXI.Container {
  constructor (position, game) {
    super()
    this.x = position[0];
    this.y = position[1];
    this.direction = "down";
    this.setUpTextures();
    this.sprite = new PIXI.Sprite(this.textures["down0"]);
    [this.sprite.anchor.x,this.sprite.anchor.y] = [0.5, 0.5];

    this.maxHealth = 50;
    this.health = this.maxHealth;
    this.healthLost = 0;
    this.healthGained = 0;
    this.attackDelay = 0;
    this.attacking = false;
    this.game = game;
    this.velX = 0;
    this.velY = 0;
    this.baseSpeed = 1.75;
    this.animationFrame = 0;
    this.aware = true;
    this.addChild(this.sprite)
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar)
    HitBoxObject.setUpHitBox(this, 24, 48);
    this.behaviors = [MovingObject, HpObject, HitBoxObject];
    this.game.enemies.push(this);
  }

  move () {
    this.animationFrame++;
    if (this.animationFrame > 20) {
      this.animationFrame = 0;
    }
    if (this.aware) {
      if (this.attacking) {
        this.animateAttack()
      } else {
        this.chase(this.game.players[0]);
        this.animateMovement();
      }
    }
    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this);
      this.behaviors[i].render(this);
    }
  }

  animateMovement () {
    if (this.animationFrame === 0 || this.animationFrame === 10 && (this.velX !== 0 || this.velY !== 0)) {
      MovingObject.determineDirection(this)
      let frame = this.animationFrame / 10;
      if (this.direction === "") {
        this.direction = "down";
      }
      this.sprite.texture = this.textures[this.direction + frame];
    }
  }

  chase (target) {
    let xDiff = target.x - this.x;
    let yDiff = target.y - this.y;
    let above = false;
    let below = false;
    let right = false;
    let left = false;
    if (yDiff > 32) {
      below = true;
    } else if (yDiff < -32) {
      above = true;
    }
    if (xDiff > 20) {
      right = true;
    } else if (xDiff < -20) {
      left = true;
    }

    [this.velX, this.velY] = [0,0];


    if (below && right) {
      [this.velX, this.velY] = [this.baseSpeed / Math.sqrt(2), this.baseSpeed / Math.sqrt(2)];
    } else if (above && right) {
      [this.velX, this.velY] = [this.baseSpeed / Math.sqrt(2), -(this.baseSpeed / Math.sqrt(2))];
    } else if (above && left) {
      [this.velX, this.velY] = [-(this.baseSpeed / Math.sqrt(2)), -(this.baseSpeed / Math.sqrt(2))];
    } else if (below && left) {
      [this.velX, this.velY] = [-(this.baseSpeed / Math.sqrt(2)), this.baseSpeed / Math.sqrt(2)];
    } else if (right) {
      this.velX = this.baseSpeed;
    } else if (left) {
      this.velX = -(this.baseSpeed);
    } else if (below) {
      this.velY = this.baseSpeed;
    } else if (above) {
       this.velY = -(this.baseSpeed);
    }
    if (this.velX === 0 && this.velY === 0) {
      this.attack(target);
    }

  }

  setUpTextures () {
    this.textures = {
      "down0": PIXI.loader.resources.cultist_down0.texture,
      "down1": PIXI.loader.resources.cultist_down1.texture,
      "downright0": PIXI.loader.resources.cultist_down_right0.texture,
      "downright1": PIXI.loader.resources.cultist_down_right1.texture,
      "right0": PIXI.loader.resources.cultist_right0.texture,
      "right1": PIXI.loader.resources.cultist_right1.texture,
      "upright0": PIXI.loader.resources.cultist_up_right0.texture,
      "upright1": PIXI.loader.resources.cultist_up_right1.texture,
      "up0": PIXI.loader.resources.cultist_up0.texture,
      "up1": PIXI.loader.resources.cultist_up1.texture,
      "upleft0": PIXI.loader.resources.cultist_up_left0.texture,
      "upleft1": PIXI.loader.resources.cultist_up_left1.texture,
      "left0": PIXI.loader.resources.cultist_left0.texture,
      "left1": PIXI.loader.resources.cultist_left1.texture,
      "downleft0": PIXI.loader.resources.cultist_down_left0.texture,
      "downleft1": PIXI.loader.resources.cultist_down_left1.texture,
      "downAttacking0": PIXI.loader.resources.cultist_attack_down0.texture,
      "downAttacking1": PIXI.loader.resources.cultist_attack_down1.texture,
      "downAttacking2": PIXI.loader.resources.cultist_attack_down2.texture,
      "downAttacking3": PIXI.loader.resources.cultist_attack_down3.texture,
      "downrightAttacking0": PIXI.loader.resources.cultist_attack_down_right0.texture,
      "downrightAttacking1": PIXI.loader.resources.cultist_attack_down_right1.texture,
      "downrightAttacking2": PIXI.loader.resources.cultist_attack_down_right2.texture,
      "downrightAttacking3": PIXI.loader.resources.cultist_attack_down_right3.texture,
      "rightAttacking0": PIXI.loader.resources.cultist_attack_right0.texture,
      "rightAttacking1": PIXI.loader.resources.cultist_attack_right1.texture,
      "rightAttacking2": PIXI.loader.resources.cultist_attack_right2.texture,
      "rightAttacking3": PIXI.loader.resources.cultist_attack_right3.texture,
      "uprightAttacking0": PIXI.loader.resources.cultist_attack_up_right0.texture,
      "uprightAttacking1": PIXI.loader.resources.cultist_attack_up_right1.texture,
      "uprightAttacking2": PIXI.loader.resources.cultist_attack_up_right2.texture,
      "uprightAttacking3": PIXI.loader.resources.cultist_attack_up_right3.texture,
      "upAttacking0": PIXI.loader.resources.cultist_attack_up0.texture,
      "upAttacking1": PIXI.loader.resources.cultist_attack_up1.texture,
      "upAttacking2": PIXI.loader.resources.cultist_attack_up2.texture,
      "upAttacking3": PIXI.loader.resources.cultist_attack_up3.texture,
      "upleftAttacking0": PIXI.loader.resources.cultist_attack_up_left0.texture,
      "upleftAttacking1": PIXI.loader.resources.cultist_attack_up_left1.texture,
      "upleftAttacking2": PIXI.loader.resources.cultist_attack_up_left2.texture,
      "upleftAttacking3": PIXI.loader.resources.cultist_attack_up_left3.texture,
      "leftAttacking0": PIXI.loader.resources.cultist_attack_left0.texture,
      "leftAttacking1": PIXI.loader.resources.cultist_attack_left1.texture,
      "leftAttacking2": PIXI.loader.resources.cultist_attack_left2.texture,
      "leftAttacking3": PIXI.loader.resources.cultist_attack_left3.texture,
      "downleftAttacking0": PIXI.loader.resources.cultist_attack_down_left0.texture,
      "downleftAttacking1": PIXI.loader.resources.cultist_attack_down_left1.texture,
      "downleftAttacking2": PIXI.loader.resources.cultist_attack_down_left2.texture,
      "downleftAttacking3": PIXI.loader.resources.cultist_attack_down_left3.texture
    }
  }


  onWallCollision () {

  }


  dies () {
    this.dead = true;
    ItemDropObject.normalEnemyDrop(this);
    EnemyObject.removeFromGameArray(this);
    EnemyObject.checkClear(this)
  }

  attack (target) {
    this.attacking = true;
    this.setAttackDirection(target);
    this.dagger = new PIXI.Graphics();

    this.addChild(this.dagger);
    HitBoxObject.setUpHitBox(this.dagger, 5, 10);
    this.dagger.animationCounter = 0;
    let xDisplacement = target.x - this.x
    let yDisplacement = target.y - this.y
    let disMag = Math.sqrt(Math.pow(xDisplacement, 2) + Math.pow(yDisplacement, 2))
    this.dagger.destination = [target.x, target.y];
    // TODO find right hitbox distance
    let slope = yDisplacement / xDisplacement;
    this.dagger.hitBox.rotate(Math.atan(slope) - (Math.PI / 2));
    if (target.x < this.x) {
      this.dagger.hitBox.rotate(Math.PI);
    }

  }

  animateAttack () {
    this.dagger.animationCounter++;
    switch (this.dagger.animationCounter) {
      case 3:
        this.sprite.texture = this.textures[this.direction + "Attacking1"];
        break;

      case 7:
          this.sprite.texture = this.textures[this.direction + "Attacking2"];
          break;

      case 10:
        this.sprite.texture = this.textures[this.direction + "Attacking3"];
        [this.dagger.hitBox.pos.x, this.dagger.hitBox.pos.y] = this.dagger.destination;
        if (SAT.testPolygonPolygon(this.hitBox, this.game.players[0].hitBox)) {
          this.game.players[0].healthLost += 50;
        }
        break;

      case 20:
        this.sprite.texture = this.textures[this.direction + "Attacking1"];
        break;

      case 25:
        this.sprite.texture = this.textures[this.direction + "Attacking0"];
        break;

      case 40:
        this.attacking = false;
        this.dagger = false;
        break;


    }

  }

  setAttackDirection (target) {
    this.direction = "";
    let xDiff = target.x - this.x;
    let yDiff = target.y - this.y;
    if (yDiff > 15) {
      this.direction += "down"
    } else if (yDiff < -15) {
      this.direction += "up"
    }
    if (xDiff > 10) {
      this.direction += "right"
    } else if (xDiff < -10) {
      this.direction += "left"
    }
    if (this.direction === "") {
      this.direction = "down";
    }

    this.sprite.texture = this.textures[this.direction + "Attacking0"];
  }

}

export default Cultist;
