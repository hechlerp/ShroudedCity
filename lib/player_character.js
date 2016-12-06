import PIXI from 'pixi.js';
import Game from './game';
import HpObject from './behaviors/hp_object';
import MovingObject from './behaviors/moving_object';
import HitBoxObject from './behaviors/hitbox_object';
import SpecialMeterObject from './behaviors/special_meter_object';
import PlayerBullet from './weapons/player_bullet';
import RolandSpecialBullet from './weapons/roland_special_bullet';
import Dynamite from './weapons/dynamite';
import SAT from 'sat';

class PlayerCharacter extends PIXI.Container {
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
    this.animationFrame = 0;
    this.setUpTextures();
    this.primaryAttackDelay = 0;
    this.primaryAttackLockout = false;
    this.secondaryAttackDelay = 0;
    this.secondaryAttackLockout = false;
    this.specialAttackDelay = 0;
    this.specialAttackLockout = false;
    this.lockDirection = false;

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
    this.behaviors = [HpObject, MovingObject, HitBoxObject, SpecialMeterObject];

    SpecialMeterObject.addSpecialMeter(this);
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
    if (!this.lockDirection){
      MovingObject.determineDirection(this);
    }

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
    if (this.specialAttackLockout) {
      this.specialAttackDelay++;
      if (this.specialAttackDelay > 300) {
        this.specialAttackLockout = false;
        this.specialAttackDelay = 0;
      }
    } else if (key.isPressed("d") && this.special >= 50 && !this.specialAttackLockout) {
      this.specialAttack();
    }


    if (!this.leftRoom && (this.x > Game.dim_x || this.x < 0 || this.y > Game.dim_y || this.y < 0)) {
      this.leftRoom = true;
      this.leaveRoom();
    }
    if (this.newRoom && MovingObject.isInRoom(this)) {
      this.game.currentRoom.onEnter();
      this.newRoom = false;
    }

    this.animate();
    this.animationFrame++;
    if (this.animationFrame > 20) {
      this.animationFrame = 0;
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

  animate () {
    let stopped = this.velX === 0 && this.velY === 0;
    if (this.attack) {
      this.animateAttack(stopped);
    } else {
      this.animateMovement(stopped);
    }
    if (stopped) {
      this.animationFrame = 0;
    }
    this.stopped = stopped;
  }

  animateMovement (stopped) {
    if ((this.stopped !== stopped) || (this.animationFrame % 9 === 0) && !stopped) {
      let i = this.animationFrame % 2;
      if (this.textures[this.direction + i]) {
        this.sprite.texture = this.textures[this.direction + i];
      } else {
        this.sprite.texture = this.textures["down"];
      }
    }
  }

  animateAttack (stopped) {
    switch (this.attack) {
      case "primary":
        this.lockDirection = false;
        this.animatePrimaryAttack(stopped);

        break;
      case "secondary":
        this.lockDirection = false;
        this.animateSecondaryAttack();

        break;
      case "special":
        this.animateSpecialAttack(stopped);
        break;
    }
  }


  primaryAttack () {
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
    this.sprite.texture = this.textures["primaryAttack" + this.direction + this.animationFrame % 2];
  }

  animatePrimaryAttack (stopped) {
    if (this.primaryAttackDelay > 5) {
      this.endAttack();
    } else {
      if ((this.stopped !== stopped) || (this.animationFrame % 9 === 0) && !stopped) {
        let i = this.animationFrame % 2;
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

  animateSpecialAttack (stopped) {
    if (this.specialAttackDelay < 95) {
      this.specialWindup();

    } else if (this.specialAttackDelay === 95) {
      this.fireSpecialBullet();
    } else if (this.specialAttackDelay > 95 && this.specialAttackDelay < 100) {

    } else if (this.specialAttackDelay >= 100) {
        this.endAttack();
        this.lockDirection = false;
    }
  }

  specialWindup () {
    if (!this.sights) {
      this.sights = new PIXI.Graphics();
      this.crosshairs = new PIXI.Sprite(PIXI.loader.resources.roland_crosshairs.texture);
      [this.crosshairs.anchor.x, this.crosshairs.anchor.y] = [0.5, 0.5];
      this.addChild(this.sights);
      this.addChild(this.crosshairs);
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
      if (this.game.room[placeInRoom[1]][placeInRoom[0]] !== "blank") {
        return point;
      }
      // TODO Make it stop on enemies too, maybe
      point[0] += (directionToFire[0]);
      point[1] += (directionToFire[1]);
    }
    return point;
  }

  fireSpecialBullet () {
    // this.specialLost += 100;
    let bulletProperties = this.getBulletProperties();
    new RolandSpecialBullet(
      [
        this.x + bulletProperties.displacement[0],
        this.y + bulletProperties.displacement[1]
      ],
      bulletProperties.rotation,
      this.game
    )
    this.sprite.texture = this.textures["primaryAttack" + this.direction + this.animationFrame % 2];
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
    this.newRoom = true;
    this.leftRoom = false;
  }

  // Gun guy with shoot, dynamite, shoot explosive bullet
  // Knife girl with throw, roll, and flurry of knives
  // Spear/shield girl with stab, block, whirl
  // Chain guy with slap, grab, and make chain super.
}

export default PlayerCharacter;
