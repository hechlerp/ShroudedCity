import MovingObject from './moving_object';
import HpObject from './hp_object';
import HitBoxObject from './hitbox_object'
import SAT from 'sat';
import PIXI from 'pixi.js';

class Dynamo extends PIXI.Container {
  constructor (position, velocity, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.baseTexture = new PIXI.Texture.fromImage('assets/sprites/dynamo/1.png');
    this.sprite = new PIXI.Sprite(this.baseTexture);
    [this.sprite.anchor.x,this.sprite.anchor.y] = [0.5, 0.5];
    this.direction = "down";
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

    this.animationFrame = 0;
    this.setUpTextures();
    this.addChild(this.sprite)
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar)
    HitBoxObject.setUpHitBox(this, 36, 48);
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
        [this.velX, this.velY] = this.prevVel;
        this.determineDirection();
        this.sprite.texture = this.textures[this.direction];
        break;
      }

  }

  move () {
    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this);
      this.behaviors[i].render(this);
    }
    if (this.attacking === false) {
      if (this.animationFrame > 20) {
        this.animationFrame = 0;
      }
      this.animationFrame++
      this.animateMovement();
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
    this.attacking = true;
    this.setAttackDirection(target);

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

  setUpTextures () {
    this.textures = {
      "down": new PIXI.Texture.fromImage('assets/sprites/dynamo/1.png'),
      "downright": new PIXI.Texture.fromImage('assets/sprites/dynamo/2.png'),
      "right": new PIXI.Texture.fromImage('assets/sprites/dynamo/3.png'),
      "upright": new PIXI.Texture.fromImage('assets/sprites/dynamo/4.png'),
      "up": new PIXI.Texture.fromImage('assets/sprites/dynamo/5.png'),
      "upleft": new PIXI.Texture.fromImage('assets/sprites/dynamo/6.png'),
      "left": new PIXI.Texture.fromImage('assets/sprites/dynamo/7.png'),
      "downleft": new PIXI.Texture.fromImage('assets/sprites/dynamo/8.png'),
      "downfiring": new PIXI.Texture.fromImage('assets/sprites/dynamo/firing/1.png'),
      "downrightfiring": new PIXI.Texture.fromImage('assets/sprites/dynamo/firing/2.png'),
      "rightfiring": new PIXI.Texture.fromImage('assets/sprites/dynamo/firing/3.png'),
      "uprightfiring": new PIXI.Texture.fromImage('assets/sprites/dynamo/firing/4.png'),
      "upfiring": new PIXI.Texture.fromImage('assets/sprites/dynamo/firing/5.png'),
      "upleftfiring": new PIXI.Texture.fromImage('assets/sprites/dynamo/firing/6.png'),
      "leftfiring": new PIXI.Texture.fromImage('assets/sprites/dynamo/firing/7.png'),
      "downleftfiring": new PIXI.Texture.fromImage('assets/sprites/dynamo/firing/8.png')
    }
  }

  animateMovement () {
    if (this.animationFrame === 0 || this.animationFrame === 10) {
      this.determineDirection();
      this.sprite.texture = this.textures[this.direction];
    }
  }

  determineDirection () {
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

  setAttackDirection (target) {
    this.direction = "";
    let xDiff = target.x - this.x;
    let yDiff = target.y - this.y;
    if (yDiff > 0) {
      this.direction += "down"
    } else if (yDiff < 0) {
      this.direction += "up"
    }
    if (xDiff > 0) {
      this.direction += "right"
    } else if (xDiff < 0) {
      this.direction += "left"
    }
    if (this.direction === "") {
      this.direction = "down";
    }

    this.sprite.texture = this.textures[this.direction + "firing"];
  }

}

export default Dynamo;
