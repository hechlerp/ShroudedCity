import PIXI from 'pixi.js';
import Game from '../game';
import Button from '../environment_objects/button';
import WallSegment from '../terrains/wall_segment';
import RoomObject from '../behaviors/room_object';

const Elevator1 = {

  wallSize: 50,

  wallTexture() {
    return PIXI.loader.resources.wall_segment_a.texture;
  },

  cornerTexture () {
    return PIXI.loader.resources.wall_corner_a.texture;
  },

  background () {
    return PIXI.loader.resources.elevator1_background.texture;
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

  atTop: true,

  setUpRoom (game) {
    game.floor.addChild(new PIXI.Sprite(this.background()));
  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [this.wallSize / 2, this.wallSize / 2 + (5 * this.wallSize)];
    let segment;
    let rotation = 0;

    while (currentPos[1] < Game.dim_y / 2 + this.wallSize) {
      if (currentPos[1] === this.wallSize / 2 + (6 * this.wallSize)) {
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], -5, this.doorTextures.largeDoor1(), game, rotation);
        this.doorInfo.push(door);
      } else if (currentPos[1] === this.wallSize / 2 + (7 * this.wallSize)) {
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], 5, this.doorTextures.largeDoor0(), game, rotation);
        this.doorInfo.push(door);
      } else {
        segment = new WallSegment(currentPos, this.cornerTexture());
        segment.rotation = rotation;
        wall.push(segment);
        game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      }
      currentPos[1] += this.wallSize;
    }
    rotation -= Math.PI / 2;
    while (currentPos[0] < (9 * this.wallSize / 2)) {
      if (currentPos[0] === this.wallSize / 2) {
        segment = new WallSegment(currentPos, this.cornerTexture())
      } else {
        segment = new WallSegment(currentPos, this.wallTexture())
      }
      segment.rotation = rotation
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[0] += this.wallSize;
    }

    rotation -= Math.PI / 2;
    while (currentPos[1] > this.wallSize / 2 + (5 * this.wallSize)) {
      if (currentPos[1] === Game.dim_y / 2 + (3 * this.wallSize / 2)) {
        segment = new WallSegment(currentPos, this.cornerTexture())
      } else {
        segment = new WallSegment(currentPos, this.wallTexture())
      }
      segment.rotation = rotation
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      currentPos[1] -= this.wallSize;
    }

    rotation -= Math.PI / 2;
    while (currentPos[0] > (this.wallSize / 2)) {
      if (currentPos[0] === (9 * this.wallSize / 2)) {
        segment = new WallSegment(currentPos, this.cornerTexture())
      } else {
        segment = new WallSegment(currentPos, this.wallTexture())
      }

      if (currentPos[0] === (7 * this.wallSize / 2)) {
        new Button(
          currentPos,
          game,
          () => this.startMovement(game),
          {message: this.atTop ? "Descend (f)" : "Ascend (f)", maxCooldown : 400}
        );
      }

      segment.rotation = rotation
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      currentPos[0] -= this.wallSize;
    }

    return wall;
  },

  animateRoom (game, timeDelta) {
    if (this.travelDuration) {
      this.travelDuration += 1;
      if (this.travelDuration === 400) {
        this.endMovement(game);
      }
    }


  },

  endMovement (game) {
    this.atTop = !this.atTop;
    game.environmentObjects.children[0].message = this.atTop ? "Descend (f)" : "Ascend (f)";
    this.travelDuration = false;
    game.player.lockMovement = false;
    RoomObject.openDoors(this);
    if (this.atTop) {
      game.placeInRoomMatrix[0] -= 1;
      game.currentFloor -= 1
    } else {
      game.placeInRoomMatrix[0] += 1;
      game.currentFloor += 1
    }
  },

  startMovement (game) {
    game.player.lockMovement = true;
    this.travelDuration = 1;
    RoomObject.lockDoors(this);
  },

  onEnter () {

  },

  onClear (game) {

  }
}

export default Elevator1;
