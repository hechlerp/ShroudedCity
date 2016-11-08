import PIXI from 'pixi.js';
import HealthPack from '../items/health_pack';
import SpecialPack from '../items/special_pack';

const ItemDropObject = {
  normalEnemyDrop (object) {
    let num = Math.random(0) * 100;
    if (num > 95) {
      new HealthPack([object.x, object.y], object.game);
    } else if (num > 90 && num <= 95) {
      new SpecialPack([object.x, object.y], object.game);
    }
  }
}

export default ItemDropObject;
