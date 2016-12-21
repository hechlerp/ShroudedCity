import PIXI from 'pixi.js';
import Game from '../game.js';
import SAT from 'sat';
import HitBoxObject from '../behaviors/hitbox_object';

class Door extends PIXI.Container {
  constructor(doorTexture, game, rotation, offset, position) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.sprite = new PIXI.Sprite(doorTexture);
    [this.sprite.anchor.x, this.sprite.anchor.y] = [0.5, 0.5];
    this.sprite.x += offset;
    this.rotation = rotation;
    this.addChild(this.sprite)
    this.game = game;
    this.game.wall.addChild(this)
    this.game.room[Math.floor((this.y - 25) / 50)][Math.floor((this.x - 25) / 50)] = this;
    HitBoxObject.setUpHitBox(this, 50, 50);
  }

  checkCollision (object) {
     let response = new SAT.Response();
     if (SAT.testPolygonPolygon(object.hitBox, this.hitBox, response)) {
       object.onWallCollision(response, this);
     }
  }

  remove () {
    this.game.wall.removeChild(this);
    this.game.room[Math.floor((this.y - 25) / 50)][Math.floor((this.x - 25) / 50)] = "blank";
  }
}

export default Door;
