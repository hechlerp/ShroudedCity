import Game from '../game';
import WallSegment from '../terrains/wall_segment';
import RoomObject from '../behaviors/room_object';
import FogRoomObject from '../behaviors/fog_room_object';
import Button from '../environment_objects/button';


const CliffsideBottomRoom = {

  wallSize: 50,

  wallTexture() {
    return PIXI.loader.resources.wall_segment_c.texture;
  },

  blankWallTexture () {
    return PIXI.loader.resources.blank_wall.texture;
  },

  placeholderWallTexture () {
    return PIXI.loader.resources.placeholder_wall.texture;
  },

  background () {
    return PIXI.loader.resources.cliffside_top_room_background.texture;
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
    FogRoomObject.createFogShader(game);
  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [Game.dim_x - (11 * this.wallSize / 2), 3 * this.wallSize / 2]
    let segment;
    this.wallLocations = [];

    let outdents = [
      5 * this.wallSize / 2,
    ];
    this.addToWallLocations(currentPos, this.blankWallTexture());
    while (currentPos[1] < Game.dim_y - this.wallSize / 2) {
      if (outdents.includes(currentPos[1])) {
        currentPos[0] -= this.wallSize;
      }
      this.addToWallLocations([currentPos[0], currentPos[1]], this.blankWallTexture());
      currentPos[1] += this.wallSize;
    }

    this.addToWallLocations([currentPos[0], currentPos[1]], this.blankWallTexture());

    currentPos[0] = Game.dim_x - this.wallSize / 2
    while (currentPos[1] > this.wallSize / 2) {
      this.addToWallLocations([currentPos[0], currentPos[1]], this.placeholderWallTexture());
      currentPos[1] -= this.wallSize;
    }
    while (currentPos[0] > Game.dim_x - (11 * this.wallSize / 2)) {
      this.addToWallLocations([currentPos[0], currentPos[1]], this.blankWallTexture());
      currentPos[0] -= this.wallSize;
    }

    for (let i = 0; i < this.wallLocations.length; i++) {
      segment = new WallSegment(this.wallLocations[i].pos, this.wallLocations[i].texture);
      wall.push(segment)
      game.room[(segment.y - this.wallSize / 2) / this.wallSize][(segment.x - this.wallSize / 2) / this.wallSize] = segment;
    }

    RoomObject.lockDoors(this);

    return wall;


  },

  addToWallLocations (pos, texture) {
    this.wallLocations.push({pos: pos, texture: texture});
  },

  animateRoom (game, timeDelta) {
    for (let i = 0; i < game.floor.children.length; i++) {
      if (game.floor.children[i].filters) {
        game.floor.children[i].filters[0].uniforms.time.value = timeDelta;
      }
    }
  },

  onEnter () {
    // RoomObject.lockDoors(this);
  },

  onClear (game) {
    RoomObject.openDoors(this)
  }


}

export default CliffsideBottomRoom;
