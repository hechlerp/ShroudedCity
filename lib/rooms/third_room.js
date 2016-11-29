import Game from '../game';
import WallSegment from '../terrains/wall_segment';
import RoomObject from '../behaviors/room_object';
import Dynamo from '../enemies/dynamo';
import Cultist from '../enemies/cultist.js';


const ThirdRoom = {

  wallSize: 50,

  wallTexture () {
    return PIXI.loader.resources.wall_segment_c.texture;
  },

  cornerTexture () {
    return PIXI.loader.resources.wall_corner_c.texture;
  },

  background () {
    return PIXI.loader.resources.third_room_background.texture;
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

  setUpRoom (game) {
    game.floor.addChild(new PIXI.Sprite(this.background()));
    new Cultist([600, 575], game);

  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [this.wallSize / 2, Game.dim_y - (3 * this.wallSize / 2)];
    let segment;
    let rotation = 3 * Math.PI / 2;

    while (currentPos[0] < Game.dim_x - this.wallSize / 2) {

      segment = new WallSegment(currentPos, this.wallTexture());

      segment.rotation = rotation;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[0] += this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture());

    segment.rotation = rotation;
    wall.push(segment);
    game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;


    currentPos[1] -= 3 * this.wallSize;
    rotation -= Math.PI;

    while (currentPos[0] > this.wallSize / 2) {
      segment = new WallSegment(currentPos, this.wallTexture());
      segment.rotation = rotation;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[0] -= this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture());

    segment.rotation = rotation;
    wall.push(segment);
    game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
    return wall;

  },

  onEnter () {
    RoomObject.lockDoors(this);
  },

  onClear() {

  }

}

export default ThirdRoom;
