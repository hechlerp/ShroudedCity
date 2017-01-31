import Game from '../game';
import PIXI from 'pixi.js'
import WallSegment from '../terrains/wall_segment';
import RoomObject from '../behaviors/room_object';
import FogRoomObject from '../behaviors/fog_room_object';
import Dynamo from '../enemies/dynamo';


const FifthRoom = {

  wallSize: 50,

  wallTexture() {
    return PIXI.loader.resources.wall_segment_c.texture;
  },

  cornerTexture () {
    return PIXI.loader.resources.wall_corner_c.texture;
  },

  background () {
    return PIXI.loader.resources.fifth_room_background.texture;
  },

  doorTextures: {
    "largeDoor0": () => {
      return PIXI.loader.resources.large_door0.texture;
    },

    "largeDoor1": () => {
      return PIXI.loader.resources.large_door1.texture;
    }
  },

  doorInfo: [

  ],

  triggers: [

  ],

  setUpRoom () {
    this.game.floor.push(new PIXI.Sprite(this.background()));
    FogRoomObject.createFogShader(this.game);
    new Dynamo([475, 100], [0,0], this.game);
    new Dynamo([425, 100], [0,0], this.game);

  },

  buildAWall () {
    let wall = [];
    let currentPos = [(Game.dim_x / 2) - (3 * this.wallSize / 2), this.wallSize / 2];
    let segment;
    let rotation = Math.PI;

    while (currentPos[1] < Game.dim_y - this.wallSize / 2) {

      segment = new WallSegment(currentPos, this.wallTexture());

      segment.rotation = rotation;
      wall.push(segment);
      this.game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[1] += this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture());

    segment.rotation = rotation;
    wall.push(segment);
    this.game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

    currentPos[0] += 3 * this.wallSize;
    rotation -= Math.PI;

    while (currentPos[1] > this.wallSize / 2) {
      segment = new WallSegment(currentPos, this.wallTexture());
      segment.rotation = rotation;
      wall.push(segment);
      this.game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[1] -= this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture());

    segment.rotation = rotation;
    wall.push(segment);
    this.game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
    return wall;

  },

  createBackgroundShader () {
    let uniforms = {}
    uniforms.time = {type: '1f', value: 0};
    uniforms.alpha = {type: '1f', value: 0.3};
    let shaderCode = document.getElementById('fogShader').innerHTML;
    let simpleShader = new PIXI.AbstractFilter('',shaderCode,uniforms);
    return simpleShader;
  },

  animateRoom (timeDelta) {
    for (let i = 0; i < this.game.floor.length; i++) {
      if (this.game.floor[i].filters) {
        this.game.floor[i].filters[0].uniforms.time.value = timeDelta;
      }
    }
  },


  onEnter () {
    RoomObject.lockDoors(this);
  },

  onClear () {

  }


}

export default FifthRoom;
