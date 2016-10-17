import MovingObject from './moving_object';
import HpObject from './hp_object';
import HitBoxObject from './hitbox_object'
import SAT from 'sat';
import PIXI from 'pixi.js';

class SparkySparkyLightningMan extends PIXI.Container {
  constructor(position, velocity, game) {
    super();
    this.tracker = {};
    [this.x, this.y] = [position[0], position[1]];
    this.baseTexture = new PIXI.Texture.fromImage('./assets/sprites/sparky_sparky_lightning_man/sparky_man_test_0.png');
    this.sprite = new PIXI.Sprite(this.baseTexture);
    [this.sprite.anchor.x,this.sprite.anchor.y] = [0.5, 0.5];
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.attackDelay = 0;
    this.lightningCounter = 0;
    this.attacking = false;
    this.lightning = false;
    this.game = game;
    this.velX = velocity[0];
    this.velY = velocity[1];
    this.addChild(this.sprite)
    this.healthBar = new PIXI.Graphics();
    this.addChild(this.healthBar)
    this.behaviors = [MovingObject, HpObject];

  }


  createLightning(target) {
    function _trunc (num) {
      return parseFloat(num.toFixed(4));
    }

    let warningTexture = PIXI.utils.TextureCache.lightningWarning;
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

  animateLightning() {
    this.lightningCounter++;
    const that = this;
    function blank () {
      let blankTexture = PIXI.utils.TextureCache.lightningBlank;
      that.lightning.sprite.texture = blankTexture;
    }
    switch(this.lightningCounter) {
      case 60:
        blank();
        break;
      case 62:
        let firstLightning = PIXI.utils.TextureCache['./assets/sprites/lightning_sprites/lightning_sprite_2.png'];
        this.lightning.sprite.texture = firstLightning;
        break;
      case 64:
        blank();
        break;
      case 66:
        let secondLightning = PIXI.utils.TextureCache['./assets/sprites/lightning_sprites/lightning_sprite_3.png'];
        this.lightning.sprite.texture = secondLightning;
        break;
      case 68:
        blank();
        break;
      case 70:
        let thirdLightning = PIXI.utils.TextureCache['./assets/sprites/lightning_sprites/lightning_sprite_4.png'];
        this.lightning.sprite.texture = thirdLightning;
        if (this.checkHit()) {
          this.game.player.healthLost += 40;
        } else {
        }
        break;
      case 80:
        this.removeChild(this.lightning);
        this.removeChild(this.attackBorders);
        this.lightningCounter = 0;
        this.lightning = false;
        this.attacking = false;
        this.sprite.texture = PIXI.Texture.fromImage('./assets/sprites/sparky_sparky_lightning_man/sparky_man_test_0.png');

        break;
      }

  }

  move() {
    if (this.attacking === false) {
      for (let i = 0; i < this.behaviors.length; i++) {
        this.behaviors[i].update(this);
        this.behaviors[i].render(this);
      }
      this.attackDelay++;
    }
    if (this.attackDelay > 80) {
      this.attack(this.game.player);
    }
    if (this.lightning) {
      this.animateLightning();
    }
  }

  attack(target) {
    let attackTexture = new PIXI.Texture.fromImage('./assets/sprites/sparky_sparky_lightning_man/sparky_man_test_1.png');
    this.sprite.texture = attackTexture;
    this.attacking = true;
    this.attackDelay = 0;
    this.createLightning(target);

  }


  dies() {
    this.dead = true;
    this.game.masterContainer.removeChild(this);
  }

  checkHit() {
    let test = SAT.testPolygonPolygon(this.lightning.hitBox, this.game.player.hitBox);

    return test;

    // this.attackBorders.clear()
    // let perpAng = Math.atan(-1 / this.lightning.slope)
    // let lightningCorner1 = {
    //   "x": this.x - 100 * Math.cos(perpAng),
    //   "y": this.y - 100 * Math.sin(perpAng)
    //   };
    //
    // let lightningCorner2 = {
    //   "x": this.x + 100 * Math.cos(perpAng),
    //   "y": this.y + 100 * Math.sin(perpAng)
    //   };
    //
    // let segment1 = {"point1": lightningCorner1, "point2": lightningCorner2, "slope": -1 / this.lightning.slope};
    // let lightningCorner3 = {
    //   "x": lightningCorner1.x + 1000 * Math.cos(this.lightning.slope),
    //   "y": lightningCorner1.y + 1000 * Math.sin(this.lightning.slope)
    //   };
    //
    // let segment2 = {"point1": lightningCorner1, "point2":lightningCorner3, "slope": this.lightning.slope};
    // let lightningCorner4 = {
    //   "x": lightningCorner2.x + 1000 * Math.cos(this.lightning.slope),
    //   "y": lightningCorner2.y + 1000 * Math.sin(this.lightning.slope),
    //   };
    //
    // let segment3 = {"point1": lightningCorner2, "point2": lightningCorner4, "slope": this.lightning.slope};
    // let segment4 = {"point1": lightningCorner3, "point2": lightningCorner4, "slope": -1 / this.lightning.slope};
    // let segments = [segment1, segment2, segment3, segment4];
    // let playerBounds = this.game.player.getBounds();
    // let playerCorner1 = {"x": playerBounds.x, "y": playerBounds.y}
    // let playerCorner2 = {"x": playerCorner1.x + this.game.player.width, "y": playerCorner1.y + this.game.player.height}
    // this.attackBorders.beginFill(0xFFFFFF);
    // this.attackBorders.moveTo(lightningCorner1.x, lightningCorner1.y);
    // this.attackBorders.lineTo(lightningCorner2.x, lightningCorner2.y);
    // this.attackBorders.lineTo(lightningCorner4.x, lightningCorner4.y);
    // this.attackBorders.lineTo(lightningCorner3.x, lightningCorner3.y);
    // this.attackBorders.lineTo(lightningCorner1.x, lightningCorner1.y);
    // this.attackBorders.endFill();


    // if (this.checkContainment(segments)) {
    //   return true;
    // } else {
    //   for (let i = 0; i < segments.length; i++) {
    //     if (this.checkIntersect(segments[i], playerCorner1, playerCorner2)) {
    //       console.log([segments[i], playerCorner1, playerCorner2]);
    //       return true;
    //     }
    //   }
    //   return false;
    // }

  }

  // checkContainment(segments) {
  //   if (this.lightning.containsPoint(this.game.player.position)/* || this.game.player.containsPoint(this.lightning.position)*/){
  //     return true;
  //   }
  //   return false;
  // }
  //
  // checkIntersect(segment, point1, point2) {
  //   if ((point1.x > segment.point1.x && point1.x < segment.point2.x) || (point1.x < segment.point1.x && point1.x > segment.point2.x)) {
  //     let yMatch = segment.slope * (point1.x - segment.point1.x) + segment.point1.y
  //     if ((yMatch > point1.y && yMatch < point2.y) || (yMatch < point1.y && yMatch > point2.y)) {
  //       console.log("yMatch:");
  //       console.log(yMatch);
  //       return true;
  //     }
  //   } else if ((point1.y > segment.point1.y && point1.y < segment.point2.y) || (point1.y < segment.point1.y && point1.y > segment.point2.y)) {
  //     let xMatch = ((point1.y - segment.point1.y) / segment.slope) + segment.point1.x;
  //     if ((xMatch > point1.x && xMatch < point2.x) || (xMatch < point1.x && xMatch > point2.x)) {
  //       console.log("xMatch:");
  //       console.log(xMatch);
  //       return true;
  //     }
  //   } else {
  //     return false;
  //   }
  // }


}

export default SparkySparkyLightningMan;
