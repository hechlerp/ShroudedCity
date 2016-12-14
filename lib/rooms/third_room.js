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

  triggers: [

  ],

  setUpRoom (game) {
    game.floor.addChild(new PIXI.Sprite(this.background()));
    game.floor.addChild(new PIXI.Sprite(this.fogBase()));
    let shader = this.createBackgroundShader();
    game.floor.children[1].filters = [shader]
    this.cultist = new Cultist([600, 525], game);
    this.cultist.aware = false;
    this.cultist.sprite.texture = this.cultist.textures["up0"];

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

  animateRoom (game, timeDelta) {
    for (let i = 0; i < game.floor.children.length; i++) {
      if (game.floor.children[i].filters) {
        game.floor.children[i].filters[0].uniforms.time.value = timeDelta;
      }
    }
  },

  onEnter () {
    RoomObject.lockDoors(this);
    this.cultist.aware = true;
  },

  onClear() {

  }

}

export default ThirdRoom;
