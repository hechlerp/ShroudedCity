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
    this.baseTexture = new PIXI.Texture.fromImage('assets/sprites/cultist/movement/cultist_down0.png');
    this.sprite = new PIXI.Sprite(this.baseTexture);
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
    this.chase(this.game.player);
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
    if (this.animationFrame === 0 || this.animationFrame === 10) {
      let frame = this.animationFrame / 10;
      if (this.velY > 0) {
        this.sprite.texture = new PIXI.Texture.fromImage(
          'assets/sprites/cultist/movement/cultist_down' + frame + '.png'
        );
      } else if (this.velY < 0) {
        this.sprite.texture = new PIXI.Texture.fromImage(
          'assets/sprites/cultist/movement/cultist_up' + frame + '.png'
        );
      } else if (this.velX > 0) {
        this.sprite.texture = new PIXI.Texture.fromImage(
          'assets/sprites/cultist/movement/cultist_right' + frame + '.png'
        );
      } else if (this.velX < 0) {
        this.sprite.texture = new PIXI.Texture.fromImage(
          'assets/sprites/cultist/movement/cultist_left' + frame + '.png'
        );
      }
    }
  }

  chase (target) {
    let xDiff = target.x - this.x;
    let yDiff = target.y - this.y;
    let above = false;
    let below = false;
    let right = false;
    let left = false;
    if (yDiff > 5) {
      below = true;
    } else if (yDiff < -5) {
      above = true;
    }
    if (xDiff > 5) {
      right = true;
    } else if (xDiff < -5) {
      left = true;
    }

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
      this.velY = 0;
    } else if (left) {
      this.velX = -(this.baseSpeed);
      this.velY = 0;
    } else if (below) {
      this.velX = 0;
      this.velY = this.baseSpeed;
    } else if (above) {
      this.velX = 0;
       this.velY = -(this.baseSpeed);
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
