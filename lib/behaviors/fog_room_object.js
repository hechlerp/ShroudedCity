import PIXI from 'pixi.js'

const FogRoomObject =  {

  fogBase() {
    return PIXI.loader.resources.blank_background.texture;
  },

  createFogShader (game) {
    let uniforms = {}
    uniforms.time = {type: '1f', value: 0};
    uniforms.alpha = {type: '1f', value: 0.3};
    let shaderCode = `
    precision mediump float;
    uniform float time;
    uniform float alpha;

    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
      float fluctuation = sin(0.1 * (time / 10.0));
      gl_FragColor = vec4(fluctuation * alpha,fluctuation * alpha,fluctuation * alpha,0.0);
    }
    `;
    
    let fogShader = new PIXI.AbstractFilter('',shaderCode,uniforms);

    game.floor.addChild(new PIXI.Sprite(this.fogBase()));
    game.floor.children[game.floor.children.length - 1].filters = [fogShader]
  },

}

export default FogRoomObject;
