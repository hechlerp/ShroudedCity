import PIXI from 'pixi.js'

class Button extends PIXI.Container {
  constructor (position, game, action, options) {
    super();
    [this.x, this.y] = position;
    this.action = action;
    let defaultMessage = "Press Button (f)";
    let defaultTexture = PIXI.loader.resources.default_button.texture;
    let keys = Object.keys(options);
    for (let i = 0; i < keys.length; i++) {
      this[keys[i]] = options[keys[i]]
    }
    this.message = this.message ? this.message : defaultMessage;
    this.texture = this.texture ? this.texture : defaultTexture;
    this.sprite = new PIXI.Sprite(this.texture);
    this.cooldown = 0;
    this.game = game;
    this.active = true;
    [this.sprite.anchor.x, this.sprite.anchor.y] = [0.5, 0.5];
    this.addChild(this.sprite);
    this.game.currentRoom.triggers.push(() => {this.nearButton()})
    this.game.environmentObjects.addChild(this);
  }

  nearButton () {
    if (this.cooldown > 0) {
      this.cooldown -= 1;
      if (this.cooldown === 0) {
        this.active = true;
      }
    }
    if (
      (this.game.player.x - this.x) < this.game.player.width &&
      (this.game.player.x - this.x) > -(this.game.player.width) &&
      (this.game.player.y - this.y) < this.game.player.height &&
      (this.game.player.y - this.y) > -(this.game.player.height) &&
      this.active
    ) {
      this.textPrompt();
    } else if (this.bubble) {
      this.removeChild(this.bubble);
      this.bubble = false;
    }
  }

  textPrompt () {
    if (!this.bubble) {
      let text = new PIXI.Text(
        this.message,
        {font: '14px Arial', fill: '#000000', align: 'center'}
      )
      this.createBubble(text);
    }
    if (key.isPressed("f")) {
      this.executeAction();
    }
  }

  executeAction () {
    this.cooldown = 100;
    this.active = false;
    this.action();
  }

  createBubble (text) {
    this.bubble = new PIXI.Container();
    [text.anchor.x, text.anchor.y] = [0.5, 0.5];
    let bubbleSpace = new PIXI.Graphics();
    let bounds = text.getBounds();
    bubbleSpace.beginFill(0xe0be88);
    bubbleSpace.drawRect(bounds.x - 3, bounds.y - 3, bounds.width + 6, bounds.height + 6);
    bubbleSpace.endFill();
    bubbleSpace.alpha = 0.5;
    this.bubble.addChild(bubbleSpace);
    this.bubble.addChild(text)
    this.bubble.y -= 20;
    this.addChild(this.bubble);
  }
}


export default Button;
