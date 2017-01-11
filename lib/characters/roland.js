import PIXI from 'pixi.js';
import Game from '../game';
import PlayerObject from '../behaviors/player_object';
import HpObject from '../behaviors/hp_object';
import MovingObject from '../behaviors/moving_object';
import HitBoxObject from '../behaviors/hitbox_object';
import SpecialMeterObject from '../behaviors/special_meter_object';
import PlayerBullet from '../weapons/player_bullet';
import RolandSpecialBullet from '../weapons/roland_special_bullet';
import Dynamite from '../weapons/dynamite';
import SAT from 'sat';

class Roland extends PIXI.Container {
  constructor(position, game) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.velX = 0;
    this.velY = 0;
    this.baseTexture = PIXI.loader.resources.roland_down0.texture;
    this.sprite = new PIXI.Sprite(this.baseTexture);
    [this.sprite.anchor.x, this.sprite.anchor.y]  = [0.5, 0.5];
    this.addChild(this.sprite);
    this.game = game;
    this.direction = "down";
    this.setUpDirectionsObject();
    this.setUpTextures();
    this.primaryAttackDelay = 0;
    this.primaryAttackLockout = false;
    this.secondaryAttackDelay = 0;
    this.secondaryAttackLockout = false;
    this.specialAttackDelay = 0;
    this.specialAttackLockout = false;
    this.lockDirection = false;
    this.lockMovement = false;
    this.baseSpeed = 3;

    this.maxHealth = 100;
    this.maxSpecial = 100;
    this.special = this.maxSpecial;
    this.health = this.maxHealth;
    this.healthLost = 0;
    this.healthGained = 0;
    this.specialLost = 0;
    this.specialGained = 0;
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar);
    this.behaviors = [PlayerObject, HpObject, MovingObject, HitBoxObject, SpecialMeterObject];

    SpecialMeterObject.addSpecialMeter(this);
    HitBoxObject.setUpHitBox(this, 24, 48);
  }

  dies () {
    PlayerObject.dies(this)
  }

  move (timeDelta) {

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

  setUpTextures () {
    this.textures = {}
    let directions = ["down", "up", "right", "left", "down_right", "down_left", "up_right", "up_left"];
    let directionNames = ["down", "up", "right", "left", "downright", "downleft", "upright", "upleft"];
    for (let i = 0; i < directions.length; i++) {
      this.textures[directionNames[i] + 0] = PIXI.loader.resources["roland_" + directions[i] + 0].texture;
      this.textures[directionNames[i] + 1] = PIXI.loader.resources["roland_" + directions[i] + 1].texture;
      this.textures["primaryAttack" + directionNames[i] + 0] = PIXI.loader.resources["roland_primary_attack_" + directions[i] + 0].texture;
      this.textures["primaryAttack" + directionNames[i] + 1] = PIXI.loader.resources["roland_primary_attack_" + directions[i] + 1].texture;
    }
    for (let i = 0; i < 7; i++) {
      this.textures["secondaryAttack" + i] = PIXI.loader.resources["roland_secondary_attack" + i].texture
    }

  }


  animateAttack (stopped, timeDelta) {
    switch (this.attack) {
      case "primary":
        this.lockDirection = false;
        this.animatePrimaryAttack(stopped, timeDelta);

        break;
      case "secondary":
        this.lockDirection = false;
        this.animateSecondaryAttack(timeDelta);

        break;
      case "special":
        this.animateSpecialAttack(stopped, timeDelta);
        break;
    }
  }


  primaryAttack (timeDelta) {
    this.primaryAttackLockout = true;
    this.attack = "primary";
    let bulletProperties = this.getBulletProperties();
    new PlayerBullet(
      [
        this.x + bulletProperties.displacement[0],
        this.y + bulletProperties.displacement[1]
      ],
      bulletProperties.rotation,
      this.game
    )
    this.sprite.texture = this.textures["primaryAttack" + this.direction + timeDelta % 2];
  }

  animatePrimaryAttack (stopped, timeDelta) {
    if (this.primaryAttackDelay > 5) {
      this.endAttack();
    } else {
      if ((this.stopped !== stopped) || (timeDelta % 9 === 0) && !stopped) {
        let i = timeDelta % 2;
        if (this.textures[this.direction + i]) {
          this.sprite.texture = this.textures["primaryAttack" + this.direction + i];
        } else {
          this.sprite.texture = this.textures["down"];
        }
      }
      this.stopped = stopped;
    }
  }

  secondaryAttack () {
    this.stopped = true;
    this.secondaryAttackLockout = true;

    this.attack = "secondary";
  }

  animateSecondaryAttack () {
    if (this.secondaryAttackDelay > 24) {
      this.endAttack();
    } else {
      [this.velX, this.velY] = [0,0];
      if (this.secondaryAttackDelay % 4 === 0) {
        this.sprite.texture = this.textures["secondaryAttack"  + (this.secondaryAttackDelay / 4)];
        if (this.secondaryAttackDelay === 12) {
          new Dynamite([this.x, this.y], this.game);
        }
      }
    }
  }

  specialAttack () {
    this.lockDirection = true;
    this.attack = "special";
    this.specialAttackLockout = true;
    this.specialAttackDelay = 0;
    this.sprite.texture = this.textures[this.direction + 0];
  }

  animateSpecialAttack (stopped, timeDelta) {
    if (this.specialAttackDelay < 95) {
      this.specialWindup(stopped);

    } else if (this.specialAttackDelay === 95) {
      this.fireSpecialBullet(timeDelta);
    } else if (this.specialAttackDelay > 95 && this.specialAttackDelay < 100) {

    } else if (this.specialAttackDelay >= 100) {
        this.endAttack();
        this.lockDirection = false;
    }
  }

  specialWindup (stopped) {
    if (!this.sights) {
      this.sights = new PIXI.Graphics();
      this.crosshairs = new PIXI.Sprite(PIXI.loader.resources.roland_crosshairs.texture);
      [this.crosshairs.anchor.x, this.crosshairs.anchor.y] = [0.5, 0.5];
      this.addChild(this.sights);
      this.addChild(this.crosshairs);
    }
    if (this.specialAttackDelay % 9 === 0 && !stopped) {
      this.sprite.texture = this.textures[this.direction + this.specialAttackDelay % 2];
    }
    let directionToFire = this.directionObject[this.direction]
    let point = this.findPoint(directionToFire);
    let thickness = 5;

    if (directionToFire[0] !== 0 && directionToFire[1] !== 0) {
      thickness /= Math.sqrt(2);
    }

    let farPoint = [point[0] - this.x, point[1] - this.y]

    this.sights.clear();
    this.sights.moveTo(
      this.sprite.width / 2 * directionToFire[0],
      this.sprite.height / 2 * directionToFire[1]
    );
    this.sights.lineStyle(2, 0x520000);
    this.sights.lineTo(farPoint[0], farPoint[1]);
    this.sights.endFill();
    [this.crosshairs.x, this.crosshairs.y] = farPoint;

  }

  findPoint (directionToFire) {
    let point = [this.x, this.y];
    let placeInRoom;
    while (Game.inBounds(point)) {
      placeInRoom = [
        Math.floor(point[0] / this.game.currentRoom.wallSize),
        Math.floor([point[1]] / this.game.currentRoom.wallSize)
      ];
      let possibleWall = this.game.room[placeInRoom[1]][placeInRoom[0]]
      if (possibleWall !== "blank" && possibleWall.sprite.texture !== PIXI.loader.resources.blank_wall.texture) {
        return point;
      }
      // TODO Make it stop on enemies too, maybe
      point[0] += (directionToFire[0]);
      point[1] += (directionToFire[1]);
    }
    return point;
  }

  fireSpecialBullet (timeDelta) {
    this.specialLost += 20;
    let bulletProperties = this.getBulletProperties();
    new RolandSpecialBullet(
      [
        this.x + bulletProperties.displacement[0],
        this.y + bulletProperties.displacement[1]
      ],
      bulletProperties.rotation,
      this.game
    )
    this.sprite.texture = this.textures["primaryAttack" + this.direction + timeDelta % 2];
  }

  getBulletProperties () {
    let properties = {}
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
    properties.displacement = [xDisplacement, yDisplacement];
    properties.rotation = rotation;
    return properties;
  }

  endAttack () {
    this.attack = false;
    if (this.sights) {
      this.removeChild(this.sights);
      this.removeChild(this.crosshairs);
      this.sights = false;
    }
    this.sprite.texture = this.textures[this.direction + 0];
  }




  onWallCollision (response) {
    PlayerObject.onWallCollision(response, this);

  }



  // Gun guy with shoot, dynamite, shoot explosive bullet
  // Knife girl with throw, roll, and flurry of knives
  // Spear/shield girl with stab, block, whirl
  // Chain guy with slap, grab, and make chain super.
}

export default Roland;
