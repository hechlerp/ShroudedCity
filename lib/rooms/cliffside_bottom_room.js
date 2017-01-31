import Game from '../game';
import WallSegment from '../terrains/wall_segment';
import RoomObject from '../behaviors/room_object';
import FogRoomObject from '../behaviors/fog_room_object';
import Button from '../environment_objects/button';


const CliffsideTopRoom = {

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
    return PIXI.loader.resources.cliffside_bottom_room_background.texture;
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
  },

  buildAWall () {
    let wall = [];
    let currentPos = [Game.dim_x / 2 + (5 * this.wallSize / 2), this.wallSize / 2];
    let segment;
    this.wallLocations = [];
    this.addToWallLocations(currentPos, this.blankWallTexture());
    let indents = [
      11 * this.wallSize / 2,
      17 * this.wallSize / 2,
      19 * this.wallSize / 2,
      21 * this.wallSize / 2,
      23 * this.wallSize / 2
    ];
    while (currentPos[1] < 23 * this.wallSize / 2) {
      if (currentPos[1] === 7 * this.wallSize / 2) {
        currentPos[0] -= this.wallSize;
      } else if (indents.includes(currentPos[1])) {
        currentPos[0] += this.wallSize;
      }
      this.addToWallLocations([currentPos[0], currentPos[1]], this.blankWallTexture());
      currentPos[1] += this.wallSize;
    }

    let outdents = [23 * this.wallSize / 2, 21 * this.wallSize / 2, 19 * this.wallSize / 2]
    while (currentPos[1] > this.wallSize / 2) {
      let texture = this.blankWallTexture();
      if (currentPos[1] === 15 * this.wallSize / 2 || currentPos[1] === 13 * this.wallSize / 2) {
      } else {
        if (outdents.includes(currentPos[1])) {
          currentPos[0] += this.wallSize;
        }
        if (currentPos[0] === Game.dim_x - this.wallSize / 2) {
          texture = this.placeholderWallTexture();
        }
        this.addToWallLocations([currentPos[0], currentPos[1]], texture);
      }
      currentPos[1] -= this.wallSize;
    }

    this.addToWallLocations(currentPos, this.blankWallTexture());

    for (let i = 0; i < this.wallLocations.length; i++) {
      segment = new WallSegment(this.wallLocations[i].pos, this.wallLocations[i].texture);
      this.game.room[(segment.y - this.wallSize / 2) / this.wallSize][(segment.x - this.wallSize / 2) / this.wallSize] = segment;
    }

    RoomObject.lockDoors(this);

    return wall;


  },

  addToWallLocations (pos, texture) {
    this.wallLocations.push({pos: pos, texture: texture});
  },

  animateRoom (timeDelta) {
    for (let i = 0; i < this.game.floor.length; i++) {
      if (this.game.floor[i].filters) {
        this.game.floor[i].filters[0].uniforms.time.value = timeDelta;
      }
    }
  },

  onEnter () {
    // RoomObject.lockDoors(this);
  },

  onClear () {
    RoomObject.openDoors(this)
  }


}

export default CliffsideTopRoom;
