import Game from '../game';
import WallSegment from '../terrains/wall_segment';
import RoomObject from '../behaviors/room_object';
import Button from '../environment_objects/button';


const SecondRoom = {

  wallSize: 50,

  wallTexture() {
    return PIXI.loader.resources.wall_segment_c.texture;
  },

  blankWallTexture () {
    return PIXI.loader.resources.blank_wall.texture;
  },

  background () {
    return PIXI.loader.resources.starting_room_background.texture;
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
    // new Button ()
  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [this.wallSize / 2 + this.wallSize * 3, this.wallSize / 2 + this.wallSize];
    let segment;
    let rotation = 0;
    while (currentPos[1] < Game.dim_y - (3 * this.wallSize / 2)) {
        segment = new WallSegment(currentPos, this.blankWallTexture());
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      currentPos[1] += this.wallSize;
      if (currentPos[1] === 9 * this.wallSize / 2) {
        currentPos[0] -= this.wallSize;
      } else if (currentPos[1] === 23 * this.wallSize / 2) {
        currentPos[0] += this.wallSize;
      }
    }

    while (currentPos[0] < Game.dim_x - (this.wallSize / 2)) {
      segment = new WallSegment(currentPos, this.blankWallTexture());
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      currentPos[0] += this.wallSize;
      if (currentPos[0] === 11 * this.wallSize / 2) {
        currentPos[1] += this.wallSize;
      } else if (currentPos[0] === 27 * this.wallSize / 2) {
        let i = 0;
        while (i < 3) {
          currentPos[1] -= this.wallSize;
          segment = new WallSegment(currentPos, this.blankWallTexture());
          wall.push(segment);
          game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
          i++
        }
        currentPos[1] += 2 * this.wallSize;
      } else if (currentPos[0] === 31 * this.wallSize / 2) {
        currentPos[1] -= this.wallSize;
      }
    }
    while (currentPos[1] > 3 * this.wallSize / 2) {
      segment = new WallSegment(currentPos, this.blankWallTexture());
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      currentPos[1] -= this.wallSize;
      let pointsToChange = [13 * this.wallSize / 2, 11 * this.wallSize / 2, 7 * this.wallSize / 2, 3 *this.wallSize / 2];
      if (pointsToChange.includes(currentPos[1])) {
        currentPos[0] -= this.wallSize;
      }
    }

    while (currentPos[0] > this.wallSize / 2 + (5 * this.wallSize / 2)) {
      if (currentPos[0] === Game.dim_x / 2 - (this.wallSize / 2)) {
        rotation = (Math.PI / 2)
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], 5, this.doorTextures.largeDoor0(), game, rotation);
        this.doorInfo.push(door);
      } else if (currentPos[0] === Game.dim_x / 2 + (this.wallSize / 2)) {
        rotation = (Math.PI / 2)
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], -5, this.doorTextures.largeDoor1(), game, rotation);
        this.doorInfo.push(door);
      } else {

        if (currentPos[0] === Game.dim_x / 2 + (3 * this.wallSize / 2)) {
          rotation = 0;
          game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - 3 * this.wallSize / 2) / this.wallSize] = segment;
          segment = new WallSegment([currentPos[0], currentPos[1] - this.wallSize], this.wallTexture());
          segment.rotation = rotation;
          wall.push(segment);
          segment = new WallSegment(currentPos, this.wallTexture());
          new Button(currentPos, game, () => RoomObject.openDoors(this), {message: "Open door (f)"})
        } else if (currentPos[0] === Game.dim_x / 2 - (3 * this.wallSize / 2)) {
          rotation = Math.PI;
          segment = new WallSegment([currentPos[0], currentPos[1] - this.wallSize], this.wallTexture());
          game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - 3 * this.wallSize / 2) / this.wallSize] = segment;
          segment.rotation = rotation;
          wall.push(segment);
          segment = new WallSegment(currentPos, this.wallTexture());
        } else {
          segment = new WallSegment(currentPos, this.blankWallTexture());
        }
        wall.push(segment);
        game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      }
      currentPos[0] -= this.wallSize;
    }
    RoomObject.lockDoors(this);

    return wall;


  },


  onEnter () {
    RoomObject.lockDoors(this);
  },

  onClear (game) {
    RoomObject.openDoors(this)
  }


}

export default SecondRoom;
