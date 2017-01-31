import PIXI from 'pixi.js'

const FogRoomObject =  {

  fogBase() {
    return PIXI.loader.resources.blank_background.texture;
  },

  // Fog shader using Fractal Brownian Motion is derived from this article:
  // http://www.awwwards.com/a-gentle-introduction-to-shaders-with-pixi-js.html

  createFogShader (game) {
    let width = 900;
    let height = 700;
    let uniforms = {}
    uniforms.time = {type: '1f', value: 0};
    uniforms.alpha = {type: '1f', value: 0.3};
    uniforms.speed = {type: 'v2', value: {x: 0.001, y: 0.0}};
    uniforms.resolution = { type: 'v2', value: { x: width, y: height}};

    let shaderCode = `
      precision mediump float;
      uniform vec2      resolution;
      uniform float     time;
      uniform float     alpha;
      uniform vec2      speed;
      uniform float     shift;


      float rand(vec2 n) {
        	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float noise(vec2 n) {
    	  const vec2 d = vec2(0.0, 1.0);
    	  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    	  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
      }

      float fbm(vec2 n) {
        float total = 0.0, amplitude = 1.0;
        for (int i = 0; i < 4; i++) {
         total += noise(n) * amplitude;
          n += n;
          amplitude *= 0.5;
        }
        return total;
      }

      void main() {
        const vec3 c1 = vec3(0.0/255.0, 0.0/255.0, 26.0/255.0);
        const vec3 c2 = vec3(103.0/255.0, 113.0/255.0, 113.0/255.0);
        const vec3 c3 = vec3(0.0, 0.1, 0.1);
        const vec3 c4 = vec3(134.0/255.0, 134.0/255.0, 144.0/255.0);
        const vec3 c5 = vec3(0.3);
        const vec3 c6 = vec3(0.4);

        vec2 p = gl_FragCoord.xy * 1.0 / resolution.xx;
        float q = fbm(p - time * 0.001);
        vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
        vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
        float grad = gl_FragCoord.y / resolution.y;
        gl_FragColor = vec4(c * cos(shift * gl_FragCoord.y / resolution.y), 0.3);
      }
    `;

      // Very basic shader-
      // precision mediump float;
      // uniform float time;
      // uniform float alpha;
      //
      // varying vec2 vTextureCoord;
      // uniform sampler2D uSampler;
      //
      // void main(void) {
      //   gl_FragColor = texture2D(uSampler, vTextureCoord);
      //   float fluctuation = sin(0.1 * (time / 10.0));
      //   gl_FragColor = vec4(fluctuation * alpha,fluctuation * alpha,fluctuation * alpha,0.0);
      // }
      let fogShader = new PIXI.AbstractFilter('',shaderCode,uniforms);

      game.floor.push(new PIXI.Sprite(this.fogBase()));
      let image = game.floor[game.floor.length - 1];
      image.filters = [fogShader];


    },



}

export default FogRoomObject;
