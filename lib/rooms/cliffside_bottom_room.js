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
    return PIXI.loader.resources.wall_segment_c.texture;
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

  setUpRoom (game) {
    game.floor.addChild(new PIXI.Sprite(this.background()));
    FogRoomObject.createFogShader(game);
  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [Game.dim_x / 2 + (5 * this.wallSize / 2), this.wallSize / 2]
    let segment;
    let wallLocations = [];
    wallLocations.push(currentPos);
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
      let location = [currentPos[0], currentPos[1]];
      wallLocations.push(location);
      currentPos[1] += this.wallSize;
    }

    // while (currentPos[0] < Game.dim_x - this.wallSize / 2) {
    //
    // }
    // currentPos = [Game.dim_x - this.wallSize / 2, (21 * this.wallSize / 2)];
    let outdents = [23 * this.wallSize / 2, 21 * this.wallSize / 2, 19 * this.wallSize / 2]
    while (currentPos[1] > this.wallSize / 2) {
      if (currentPos[1] === 15 * this.wallSize / 2 || currentPos[1] === 13 * this.wallSize / 2) {
      } else {
        if (outdents.includes(currentPos[1])) {
          currentPos[0] += this.wallSize;
        }
        let location = [currentPos[0], currentPos[1]];
        wallLocations.push(location);
      }
      currentPos[1] -= this.wallSize;
    }

    wallLocations.push(currentPos)

    for (let i = 0; i < wallLocations.length; i++) {
      segment = new WallSegment(wallLocations[i], this.blankWallTexture());
      // wall.push(segment)
      game.room[(segment.y - this.wallSize / 2) / this.wallSize][(segment.x - this.wallSize / 2) / this.wallSize] = segment;
    }

    RoomObject.lockDoors(this);

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
    // RoomObject.lockDoors(this);
  },

  onClear (game) {
    RoomObject.openDoors(this)
  }


}

export default CliffsideBottomRoom;
