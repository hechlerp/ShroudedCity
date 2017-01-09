import Game from '../game';
import WallSegment from '../terrains/wall_segment';
import RoomObject from '../behaviors/room_object';
import Dynamo from '../enemies/dynamo';
import Cultist from '../enemies/cultist.js';


const SecondRoom = {

  wallSize: 50,

  wallTexture() {
    return PIXI.loader.resources.wall_segment_a.texture;
  },

  cornerTexture () {
    return PIXI.loader.resources.wall_corner_a.texture;
  },

  background () {
    return PIXI.loader.resources.second_room_background.texture;
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
    let cultist1 = new Cultist([550, 100], game);
    let cultist2 = new Cultist([350, 100], game);
    [cultist1.aware, cultist2.aware] = [false, false];
    this.cultists = [cultist1, cultist2];
    cultist1.direction = "left";
    cultist2.direction = "right";
    for (let i = 0; i < this.cultists.length; i++) {
      this.cultists[i].sprite.texture = this.cultists[i].textures[this.cultists[i].direction + 0];
    }


  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [this.wallSize / 2, this.wallSize / 2];
    let segment;
    let rotation;
    while (currentPos[1] < Game.dim_y - this.wallSize / 2) {
      if (currentPos[1] === this.wallSize / 2) {
        segment = new WallSegment(currentPos, this.cornerTexture());
      } else {
        segment = new WallSegment(currentPos, this.wallTexture());
      }
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      currentPos[1] += this.wallSize;
    }
    rotation = 3 * Math.PI / 2;

    while (currentPos[0] < Game.dim_x - this.wallSize / 2) {
      if (currentPos[0] === Game.dim_x / 2 - (this.wallSize / 2)) {
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], -5, this.doorTextures.largeDoor1(), game, rotation);
        this.doorInfo.push(door);
      } else if (currentPos[0] === Game.dim_x / 2 + (this.wallSize / 2)) {
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], 5, this.doorTextures.largeDoor0(), game, rotation);
        this.doorInfo.push(door);
      } else {

        if (currentPos[0] === this.wallSize / 2) {
          segment = new WallSegment(currentPos, this.cornerTexture());
        } else {
          segment = new WallSegment(currentPos, this.wallTexture());
        }
        segment.rotation = rotation;
        wall.push(segment);
        game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;


      }
      currentPos[0] += this.wallSize;
    }
    rotation -= Math.PI / 2;

    while (currentPos[1] > this.wallSize / 2) {
      if (currentPos[1] === Game.dim_y - (5 * this.wallSize / 2)) {
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], -5, this.doorTextures.largeDoor1(), game, rotation);
        this.doorInfo.push(door);
      } else if (currentPos[1] === Game.dim_y - (7 * this.wallSize / 2)) {
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], 5, this.doorTextures.largeDoor0(), game, rotation);
        this.doorInfo.push(door);
      } else {
        if (currentPos[1] === Game.dim_y - (this.wallSize / 2)) {
          segment = new WallSegment(currentPos, this.cornerTexture());
        } else {
          segment = new WallSegment(currentPos, this.wallTexture());
        }
        segment.rotation = rotation;
        wall.push(segment);
        game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      }
      currentPos[1] -= this.wallSize;
    }
    rotation -= Math.PI / 2;

    while (currentPos[0] > this.wallSize / 2) {

      if (currentPos[0] === Game.dim_x - (this.wallSize / 2)) {
        segment = new WallSegment(currentPos, this.cornerTexture());
      } else {
        segment = new WallSegment(currentPos, this.wallTexture());
      }
      segment.rotation = rotation;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[0] -= this.wallSize;
    }
    return wall;

  },

  onEnter () {
    RoomObject.lockDoors(this);
    for (let i = 0; i < this.cultists.length; i++) {
      this.cultists[i].aware = true;
    }
  },

  onClear (game) {
    RoomObject.openDoors(this)
  }


}

export default SecondRoom;
