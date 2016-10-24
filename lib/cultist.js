import MovingObject from './moving_object';
import HpObject from './hp_object';
import HitBoxObject from './hitbox_object'
import SAT from 'sat';
import PIXI from 'pixi.js';

class Cultist extends PIXI.Container {
  constructor (position, game) {
    super()
    this.x = position[0];
    this.y = position[1];
    this.direction = "down0";
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
    this.velX;
    this.velY;
    this.baseSpeed = 1.75;
    this.animationFrame = 0;
    this.addChild(this.sprite)
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar)
    HitBoxObject.setUpHitBox(this, 24, 48);
    this.behaviors = [MovingObject, HpObject, HitBoxObject];
  }

  move () {
    if (this.attacking) {
      this.animateAttack()
    } else {
      this.chase(this.game.player);
    }
    this.animationFrame++;
    if (this.animationFrame > 20) {
      this.animationFrame = 0;
    }
    this.animateMovement();
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
    if (yDiff > 48) {
      below = true;
    } else if (yDiff < -48) {
      above = true;
    }
    if (xDiff > 24) {
      right = true;
    } else if (xDiff < -24) {
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

  }

  setUpTextures () {
    this.textures = {
      "down0": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/down0.png'),
      "down1": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/down1.png'),
      "downright0": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/down_right0.png'),
      "downright1": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/down_right1.png'),
      "right0": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/right0.png'),
      "right1": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/right1.png'),
      "upright0": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/up_right0.png'),
      "upright1": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/up_right1.png'),
      "up0": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/up0.png'),
      "up1": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/up1.png'),
      "upleft0": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/up_left0.png'),
      "upleft1": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/up_left1.png'),
      "left0": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/left0.png'),
      "left1": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/left1.png'),
      "downleft0": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/down_left0.png'),
      "downleft1": new PIXI.Texture.fromImage('assets/sprites/cultist/movement/down_left1.png')
      // "downAttacking0": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "downAttacking1": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "downrightAttacking0": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "downrightAttacking1": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "rightAttacking0": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "rightAttacking1": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "uprightAttacking0": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "uprightAttacking1": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "upAttacking0": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "upAttacking1": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "upleftAttacking0": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "upleftAttacking1": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "leftAttacking0": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "leftAttacking1": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "downleftAttacking0": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
      // "downleftAttacking1": new PIXI.Texture.fromImage('assets/sprites/cultist/'),
    }
  }


  onWallCollision () {

  }


  dies () {
    this.dead = true;
    this.game.enemies.removeChild(this);
  }
}

export default Cultist;
