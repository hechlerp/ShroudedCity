import PIXI from 'pixi.js';
import HitBoxObject from '../behaviors/hitbox_object';
import SAT from 'sat';

class WallSegment extends PIXI.Container {
  constructor (position, texture) {
    super();
    [this.x, this.y] = [position[0], position[1]];
    this.sprite = new PIXI.Sprite(texture);
    [this.sprite.anchor.x, this.sprite.anchor.y] = [0.5, 0.5];
    this.addChild(this.sprite);
    HitBoxObject.setUpHitBox(this, 50, 50);
  }

  checkCollision (object) {
     let response = new SAT.Response();
     if (SAT.testPolygonPolygon(object.hitBox, this.hitBox, response)) {
       object.onWallCollision(response, this);
     }
  }

}

export default WallSegment;
