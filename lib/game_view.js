import PIXI from 'pixi.js'
import Game from './game'

class GameView {
  constructor(game, renderer) {
    this.game = game;
    this.renderer = renderer;
  }



  start() {



    let renderer = this.renderer;
    let game = this.game;
    let lightningWarning = new PIXI.Texture.fromImage('./assets/sprites/lightning_sprites/lightning_sprite_0.png');
    let lightningBlank = new PIXI.Texture.fromImage('./assets/sprites/lightning_sprites/lightning_sprite_1.png');
    let lightning1 = new PIXI.Texture.fromImage('./assets/sprites/lightning_sprites/lightning_sprite_2.png');
    let lightning2 = new PIXI.Texture.fromImage('./assets/sprites/lightning_sprites/lightning_sprite_3.png');
    let lightning3 = new PIXI.Texture.fromImage('./assets/sprites/lightning_sprites/lightning_sprite_4.png');
    let sparkyTexture = new PIXI.Texture.fromImage('./assets/sprites/sparky_sparky_lightning_man/sparky_man_test_0.png');
    let playerTexture = new PIXI.Texture.fromImage('./assets/sprites/forward.png')


    let textures = [lightningWarning, lightningBlank, lightning1, lightning2, lightning3];
    let textureNames = ["lightningWarning", "lightningBlank", "lightning1", "lightning2", "lightning3"];
    for (var i = 0; i < textures.length; i++) {
      PIXI.Texture.addTextureToCache(textures[i], textureNames[i]);
    }

    game.enactSetupSequence();
    renderer.backgroundColor = 212121
    function animate() {
      requestAnimationFrame(animate);
      game.doTheThing();
    }
    animate();

  }



}

export default GameView;
