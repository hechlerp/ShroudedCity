import PIXI from 'pixi.js'
import MovingObject from './moving_object'

class PlayerCharacter extends MovingObject {
  constructor(texture, velocity, game) {
    super(texture, velocity);
    this.health = 100;
    this.healthbar = new PIXI.Graphics();
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.hitBox = new PIXI.Graphics();
    game.masterContainer.addChild(this.healthbar);
    game.masterContainer.addChild(this.hitBox);
  }

  move() {

    // Diagonal speed (thanks Gautham)
    // (total speed)^2 = (s1)^2 + (s2)^2
    //(new speed = (a * s1)^2 + (a * s2)^2
    //(newspeed)^2 = 2(a^2)(total speed ^2)
    // new speed = sqrt(2) * a * former speed
    // new speed = former speed and solve for a
    // 1 =sqrt(2) * a
    // a = 1/sqrt(2)


    // Add animations here
    if (key.isPressed("down")) {
      if (key.isPressed("left") || key.isPressed("right")) {
        this.y += 3 * (1 / Math.sqrt(2))
      } else {
        this.y += 3;
      }
    }
    if (key.isPressed("up")) {
      if (key.isPressed("left") || key.isPressed("right")) {
        this.y -= 3 * (1 / Math.sqrt(2))
      } else {
        this.y -= 3;
      }
    }
    if (key.isPressed("right")) {
      if (key.isPressed("up") || key.isPressed("down")) {
        this.x += 3 * (1 / Math.sqrt(2))
      } else {
        this.x += 3;
      }
    }
    if (key.isPressed("left")) {
      if (key.isPressed("up") || key.isPressed("down")) {
        this.x -= 3 * (1 / Math.sqrt(2))
      } else {
        this.x -= 3;
      }
    }
    this.trackDamage();
    this.showHitBox();
  }

  trackDamage() {
    this.healthbar.clear();
    // if (damageTaken()) {
    // }
    this.healthbar.beginFill(0xff0000);
    this.healthbar.drawRect(this.x - 25, this.y - 50, this.health / 2, 10);
    this.hitBox.endFill;

  }

  showHitBox() {
    this.hitBox.clear();
    this.hitBox.beginFill(0xFFFFFF);
    let border = this.getBounds();
    this.hitBox.moveTo(border.x, border.y)
    this.hitBox.lineTo(border.x + this.width, border.y);
    this.hitBox.lineTo(border.x + this.width, border.y + this.height);
    this.hitBox.lineTo(border.x, border.y + this.height);
    this.hitBox.lineTo(border.x, border.y);
    this.hitBox.endFill;

  }




}

export default PlayerCharacter;
