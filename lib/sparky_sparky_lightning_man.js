import MovingObject from './moving_object';
import HpObject from './hp_object';
import HitBoxObject from './hitbox_object'
import SAT from 'sat';
import PIXI from 'pixi.js';

class SparkySparkyLightningMan extends PIXI.Container {
  constructor (position, velocity, game) {
    super();
    this.tracker = {};
    [this.x, this.y] = [position[0], position[1]];
    this.baseTexture = new PIXI.Texture.fromImage('./assets/sprites/sparky_sparky_lightning_man/sparky_man_test_0.png');
    this.sprite = new PIXI.Sprite(this.baseTexture);
    [this.sprite.anchor.x,this.sprite.anchor.y] = [0.5, 0.5];
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.healthLost = 0;
    this.healthGained = 0;
    this.attackDelay = 0;
    this.lightningCounter = 0;
    this.attacking = false;
    this.lightning = false;
    this.game = game;
    this.velX = velocity[0];
    this.velY = velocity[1];
    this.baseSpeed = 1;
    this.addChild(this.sprite)
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar)
    HitBoxObject.setUpHitBox(this, 16, 32);
    this.behaviors = [MovingObject, HpObject, HitBoxObject];

  }


  createLightning (target) {
    function _trunc (num) {
      return parseFloat(num.toFixed(4));
    }

    let warningTexture = PIXI.utils.TextureCache.lightningWarning;
    this.lightning = new PIXI.Container()
    this.lightning.sprite = new PIXI.Sprite(warningTexture);
    this.lightning.addChild(this.lightning.sprite);
    this.addChild(this.lightning);
    [this.lightning.sprite.anchor.x, this.lightning.sprite.anchor.y] = [0.5, 0.5];
    this.lightning.sprite.height = 1000;

    let xDisplacement = target.x - this.x
    let yDisplacement = target.y - this.y
    let disMag = Math.sqrt(Math.pow(xDisplacement, 2) + Math.pow(yDisplacement, 2))
    let ratio = 500 / disMag
    this.lightning.x = xDisplacement * ratio;
    this.lightning.y = yDisplacement * ratio;
    this.lightning.slope = yDisplacement / xDisplacement;
    HitBoxObject.setUpHitBox(this.lightning, this.lightning.width / 4, this.lightning.height);
    this.lightning.rotation = (Math.atan(this.lightning.slope) - (Math.PI / 2));
    if (target.x < this.x) {
      this.lightning.rotation += Math.PI
    }
    [this.lightning.hitBox.pos.x, this.lightning.hitBox.pos.y] = [this.lightning.x + this.x, this.lightning.y + this.y];
    this.lightning.hitBox.rotate(this.lightning.rotation);


  }

  animateLightning () {
    this.lightningCounter++;
    const that = this;
    function blank () {
      let blankTexture = PIXI.utils.TextureCache.lightningBlank;
      that.lightning.sprite.texture = blankTexture;
    }
    switch(this.lightningCounter) {
      case 60:
        blank();
        break;
      case 62:
        let firstLightning = PIXI.utils.TextureCache['./assets/sprites/lightning_sprites/lightning_sprite_2.png'];
        this.lightning.sprite.texture = firstLightning;
        break;
      case 64:
        blank();
        break;
      case 66:
        let secondLightning = PIXI.utils.TextureCache['./assets/sprites/lightning_sprites/lightning_sprite_3.png'];
        this.lightning.sprite.texture = secondLightning;
        break;
      case 68:
        blank();
        break;
      case 70:
        let thirdLightning = PIXI.utils.TextureCache['./assets/sprites/lightning_sprites/lightning_sprite_4.png'];
        this.lightning.sprite.texture = thirdLightning;
        if (this.checkHit()) {
          this.game.player.healthLost += 40;
        } else {
        }
        break;
      case 80:
        this.removeChild(this.lightning);
        this.lightningCounter = 0;
        this.lightning = false;
        this.attacking = false;
        this.sprite.texture = PIXI.Texture.fromImage('./assets/sprites/sparky_sparky_lightning_man/sparky_man_test_0.png');
        [this.velX, this.velY] = this.prevVel;
        break;
      }

  }

  move () {
    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this);
      this.behaviors[i].render(this);
    }
    if (this.attacking === false) {
      this.attackDelay++;
    }
    if (this.attackDelay > 80) {
      this.attack(this.game.player);
    }
    if (this.lightning) {
      this.animateLightning();
    }
  }

  attack (target) {
    let attackTexture = new PIXI.Texture.fromImage('./assets/sprites/sparky_sparky_lightning_man/sparky_man_test_1.png');
    this.sprite.texture = attackTexture;
    this.attacking = true;
    this.storeVel(this.velX, this.velY);
    [this.velX, this.velY] = [0,0];
    this.attackDelay = 0;
    this.createLightning(target);

  }


  dies () {
    this.dead = true;
    this.game.enemies.removeChild(this);
  }

  onWallCollision (response) {
    let vector = response.overlapN;
    if (vector.x > 0) {
      this.velX = -(this.baseSpeed);
    } else if (vector.x < 0) {
      this.velX = this.baseSpeed;
    }
    if (vector.y > 0) {
      this.velY = -(this.baseSpeed);
    } else if (vector.y < 0) {
      this.velY = this.baseSpeed;
    }

    this.storeVel(this.velX, this.velY);
  }

  checkHit () {
    return SAT.testPolygonPolygon(this.lightning.hitBox, this.game.player.hitBox);
  }

  storeVel (velX, velY) {
    this.prevVel = [this.velX, this.velY];
  }

}

export default SparkySparkyLightningMan;
