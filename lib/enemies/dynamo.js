import MovingObject from '../behaviors/moving_object';
import HpObject from '../behaviors/hp_object';
import HitBoxObject from '../behaviors/hitbox_object';
import ItemDropObject from '../behaviors/item_drop_object';
import EnemyObject from '../behaviors/enemy_object';
import SAT from 'sat';
import PIXI from 'pixi.js';

class Dynamo extends PIXI.Container {
  constructor (position, velocity, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.baseTexture = PIXI.loader.resources.dynamo_down.texture;
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

    this.aware = true;
    this.setUpTextures();
    this.addChild(this.sprite)
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar)
    HitBoxObject.setUpHitBox(this, 36, 48);
    this.behaviors = [MovingObject, HpObject, HitBoxObject];
    this.game.enemies.addChild(this);

  }


  createLightning (target) {
    let warningTexture = PIXI.loader.resources.lightning_warning.texture;
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
      let blankTexture = PIXI.loader.resources.lightning_blank.texture;
      that.lightning.sprite.texture = blankTexture;
    }
    switch(this.lightningCounter) {
      case 60:
        blank();
        break;
      case 62:
        let firstLightning = PIXI.loader.resources.lightning1.texture;
        this.lightning.sprite.texture = firstLightning;
        break;
      case 64:
        blank();
        break;
      case 66:
        let secondLightning = PIXI.loader.resources.lightning2.texture;
        this.lightning.sprite.texture = secondLightning;
        break;
      case 68:
        blank();
        break;
      case 70:
        let thirdLightning = PIXI.loader.resources.lightning3.texture;
        this.lightning.sprite.texture = thirdLightning;
        for (var i = 0; i < this.game.players.children.length; i++) {
          if (this.checkHit(this.game.players.children[i])) {
            this.game.players.children[i].healthLost += 40;
          }
        }
        break;
      case 80:
        this.removeChild(this.lightning);
        this.lightningCounter = 0;
        this.lightning = false;
        this.attacking = false;
        [this.velX, this.velY] = this.prevVel;
        MovingObject.determineDirection(this);
        this.sprite.texture = this.textures[this.direction];
        break;
      }

  }

  move (timeDelta) {
    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].update(this);
      this.behaviors[i].render(this);
    }
    if (this.aware) {
      if (this.attacking === false) {
        this.animateMovement(timeDelta);
        this.attackDelay++;
      }
      if (this.attackDelay > 80) {
        this.attack(EnemyObject.findTarget(this.game));
      }
      if (this.lightning) {
        this.animateLightning();
      }
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
    ItemDropObject.normalEnemyDrop(this);
    this.game.enemies.removeChild(this);
    EnemyObject.checkClear(this);
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

  checkHit (player) {
    return SAT.testPolygonPolygon(this.lightning.hitBox, player.hitBox);
  }

  storeVel (velX, velY) {
    this.prevVel = [velX, velY];
  }

  setUpTextures () {
    this.textures = {
      "down": PIXI.loader.resources.dynamo_down.texture,
      "downright": PIXI.loader.resources.dynamo_down_right.texture,
      "right": PIXI.loader.resources.dynamo_right.texture,
      "upright": PIXI.loader.resources.dynamo_up_right.texture,
      "up": PIXI.loader.resources.dynamo_up.texture,
      "upleft": PIXI.loader.resources.dynamo_up_left.texture,
      "left": PIXI.loader.resources.dynamo_left.texture,
      "downleft": PIXI.loader.resources.dynamo_down_left.texture,
      "downFiring": PIXI.loader.resources.dynamo_firing_down.texture,
      "downrightFiring": PIXI.loader.resources.dynamo_firing_down_right.texture,
      "rightFiring": PIXI.loader.resources.dynamo_firing_right.texture,
      "uprightFiring": PIXI.loader.resources.dynamo_firing_up_right.texture,
      "upFiring": PIXI.loader.resources.dynamo_firing_up.texture,
      "upleftFiring": PIXI.loader.resources.dynamo_firing_up_left.texture,
      "leftFiring": PIXI.loader.resources.dynamo_firing_left.texture,
      "downleftFiring": PIXI.loader.resources.dynamo_firing_down_left.texture
    }
  }

  animateMovement (timeDelta) {
    if (timeDelta % 10 === 0) {
      MovingObject.determineDirection(this);
      this.sprite.texture = this.textures[this.direction];
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
    if (xDiff > 15) {
      this.direction += "right"
    } else if (xDiff < 15) {
      this.direction += "left"
    }
    if (this.direction === "") {
      this.direction = "down";
    }

    this.sprite.texture = this.textures[this.direction + "Firing"];
  }

}

export default Dynamo;
