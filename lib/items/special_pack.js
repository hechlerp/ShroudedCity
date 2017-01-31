import PIXI from 'pixi.js';
import ItemObject from '../behaviors/item_object';
import HitBoxObject from '../behaviors/hitbox_object';

class SpecialPack extends PIXI.Container {
  constructor (position, game) {
    super();
    [this.x, this.y] = [position[0], position[1]]
    this.sprite = new PIXI.Sprite(PIXI.loader.resources.special_pack.texture);
    this.addChild(this.sprite)
    this.game = game;
    this.game.items.push(this);
    HitBoxObject.setUpHitBox(this, 32, 32);
  }

  pickUp(object) {
    object.specialGained += 40;
    ItemObject.removeFromGameArray(this);
  }
}

export default SpecialPack;
