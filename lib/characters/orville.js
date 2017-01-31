import PIXI from 'pixi.js';
import Game from '../game';
import PlayerObject from '../behaviors/player_object';
import HpObject from '../behaviors/hp_object';
import MovingObject from '../behaviors/moving_object';
import HitBoxObject from '../behaviors/hitbox_object';
import SpecialMeterObject from '../behaviors/special_meter_object';
import Dynamite from '../weapons/dynamite';
import SAT from 'sat';

class Orville extends PIXI.Container {
  constructor (position, game) {
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
      this.textures[directionNames[i] + 0] = PIXI.loader.resources["orville_" + directions[i] + 0].texture;
      this.textures[directionNames[i] + 1] = PIXI.loader.resources["orville_" + directions[i] + 1].texture;
    //   this.textures["primaryAttack" + directionNames[i] + 0] = PIXI.loader.resources["orville_primary_attack_" + directions[i] + 0].texture;
    //   this.textures["primaryAttack" + directionNames[i] + 1] = PIXI.loader.resources["orville_primary_attack_" + directions[i] + 1].texture;
    }
    // for (let i = 0; i < 7; i++) {
    //   this.textures["secondaryAttack" + i] = PIXI.loader.resources["orville_secondary_attack" + i].texture
    // }

  }

  animateAttack (stopped, timeDelta) {
    switch (this.attack) {
      case "primary":
        this.lockDirection = false;
        this.animatePrimaryAttack(stopped, timeDelta);

        break;
      case "secondary":
        this.lockDirection = false;
        this.animateSecondaryAttack(stopped, timeDelta);

        break;
      case "special":
        this.animateSpecialAttack(stopped, timeDelta);
        break;
    }
  }

  primaryAttack (timeDelta) {

  }

  animatePrimaryAttack (stopped, timeDelta) {

  }

  secondaryAttack (timeDelta) {

  }

  animateSecondaryAttack (stopped, timeDelta) {

  }

  specialAttack (timeDelta) {

  }

  animateSpecialAttack(stopped, timeDelta) {

  }


  onWallCollision (response) {
    PlayerObject.onWallCollision(response, this);

  }


  endAttack () {
    this.attack = false;
    this.sprite.texture = this.textures[this.direction + 0];
  }
}

export default Orville;
