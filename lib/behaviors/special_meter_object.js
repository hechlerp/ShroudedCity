import PIXI from 'pixi.js';

const SpecialMeterObject = {

  regainSpecial (object, amt) {
    if (object.special + amt > object.maxSpecial) {
      object.special = object.maxSpecial
    } else {
      object.special += amt
    }
  },

  loseSpecial (object, amt) {
    if (object.special - amt < 0) {
      object.special = 0;
    } else {
      object.special -= amt;
    }
  },

  addSpecialMeter (object) {
    object.specialMeter = new PIXI.Graphics();
    object.addChild(object.specialMeter)
  },

  render (object) {
    object.specialMeter.clear();
    object.specialMeter.beginFill(0xc9c900);
    object.specialMeter.drawRect(-(object.maxSpecial / 4), -39, object.special / 2, 3);
    object.specialMeter.endFill();
    object.specialMeter.moveTo(-(object.maxSpecial / 4), -40);
    object.specialMeter.lineStyle(1, 0x000000);
    object.specialMeter.lineTo(object.health / 2 - (object.maxSpecial / 4), -40);

  },

  update (object) {
    if (object.specialGained > 0) {
      this.regainSpecial(object, object.specialGained);
      object.specialGained = 0;
    }
    if (object.specialLost > 0) {
      this.loseSpecial(object, object.specialLost)
      object.specialLost = 0;
    }
  }

}

export default SpecialMeterObject;
