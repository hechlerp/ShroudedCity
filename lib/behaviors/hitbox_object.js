import SAT from 'sat';
import PIXI from 'pixi.js';

const HitBox = {

  setUpHitBox (object, width, height) {

    // object.hitBox = new SAT.Polygon(new SAT.Vector(object.x, object.y), [
    //   new SAT.Vector(object.x, object.y),
    //   new SAT.Vector(object.x + width, object.y),
    //   new SAT.Vector(object.x + width, object.y + height),
    //   new SAT.Vector(object.x, object.y + height)
    // ]);
    object.hitBox = new SAT.Polygon(new SAT.Vector(object.x, object.y), [
      new SAT.Vector((width / 2), -(height / 2)),
      new SAT.Vector((width / 2), (height / 2)),
      new SAT.Vector(-(width / 2), (height / 2)),
      new SAT.Vector(-(width / 2), -(height / 2))
    ]);

  },

  setUpCircularHitBox (object, radius) {
    object.hitBox = new SAT.Circle(new SAT.Vector(object.x, object.y), radius);
  },

  traceHitBox (object) {
    // if (!object.tracer) {
    //   object.tracer = new PIXI.Graphics();
    //   object.addChild(object.tracer)
    // } else {
    //   object.tracer.beginFill(0xFFFFFF)
    //   object.tracer.moveTo(object.hitBox.calcPoints[0].x, object.hitBox.calcPoints[0].y)
    //   object.tracer.lineTo(object.hitBox.calcPoints[1].x, object.hitBox.calcPoints[1].y);
    //   object.tracer.lineTo(object.hitBox.calcPoints[2].x, object.hitBox.calcPoints[2].y);
    //   object.tracer.lineTo(object.hitBox.calcPoints[3].x, object.hitBox.calcPoints[3].y);
    //   object.tracer.lineTo(object.hitBox.calcPoints[0].x, object.hitBox.calcPoints[0].y);
    //   object.tracer.endFill;
    // }
    // if (!object.tracer) {
    //   object.tracer = new PIXI.Graphics();
    //   object.addChild(object.tracer)
    // } else {
    //   let width = object.sprite.width;
    //   let height = object.sprite.height;
    //   object.tracer.beginFill(0xFFFFFF)
    //   object.tracer.moveTo( -(width / 2),  -(height / 2));
    //   object.tracer.lineTo( (width / 2),  -(height / 2));
    //   object.tracer.lineTo( (width / 2),  (height / 2));
    //   object.tracer.lineTo( -(width / 2),  (height / 2));
    //   object.tracer.lineTo( -(width / 2),  -(height / 2));
    //   object.tracer.endFill;
    // }
  },

  updateHitBox(object) {

    object.hitBox.pos.x = object.x;
    object.hitBox.pos.y = object.y;

  },

  update(object) {
    this.updateHitBox(object)
  },

  render(object) {
    this.traceHitBox(object)
  }

}

export default HitBox;
