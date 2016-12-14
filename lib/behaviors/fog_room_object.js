import PIXI from 'pixi.js'

const FogRoomObject =  {

  fogBase() {
    return PIXI.loader.resources.blank_background.texture;
  },

  createFogShader (game) {
    let uniforms = {}
    uniforms.time = {type: '1f', value: 0};
    uniforms.alpha = {type: '1f', value: 0.3};
    let shaderCode = document.getElementById('fogShader').innerHTML;
    let fogShader = new PIXI.AbstractFilter('',shaderCode,uniforms);
    game.floor.addChild(new PIXI.Sprite(this.fogBase()));
    game.floor.children[game.floor.children.length - 1].filters = [fogShader]
  },

}

export default FogRoomObject;
