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

  setUpRoom () {
    this.game.floor.addChild(new PIXI.Sprite(this.background()));
  },

  buildAWall () {
    let wall = [];
    let currentPos = [this.wallSize / 2, this.wallSize / 2 + (5 * this.wallSize)];
    let segment;
    let rotation = 0;

    while (currentPos[1] < Game.dim_y / 2 + this.wallSize) {
      if (currentPos[1] === this.wallSize / 2 + (6 * this.wallSize)) {
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], -5, this.doorTextures.largeDoor1(), this.game, rotation);
        this.doorInfo.push(door);
      } else if (currentPos[1] === this.wallSize / 2 + (7 * this.wallSize)) {
        let door = RoomObject.createDoor([currentPos[0], currentPos[1]], 5, this.doorTextures.largeDoor0(), this.game, rotation);
        this.doorInfo.push(door);
      } else {
        segment = new WallSegment(currentPos, this.cornerTexture());
        segment.rotation = rotation;
        wall.push(segment);
        this.game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
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
      this.game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

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
      this.game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
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
          this.game,
          () => this.startMovement(),
          {message: this.atTop ? "Descend (f)" : "Ascend (f)", maxCooldown : 400}
        );
      }

      segment.rotation = rotation
      wall.push(segment);
      this.game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      currentPos[0] -= this.wallSize;
    }

    return wall;
  },

  animateRoom (timeDelta) {
    if (this.travelDuration) {
      this.travelDuration += 1;
      if (this.travelDuration === 400) {
        this.endMovement();
      }
    }


  },

  endMovement () {
    this.game.currentFloor = this.game.currentFloor === 1 ? 2 : 1;
    this.game.placeInRoomMatrix[0] = this.game.placeInRoomMatrix[0] === 1 ? 2 : 1;
    this.game.environmentObjects.children[0].message = this.atTop ? "Descend (f)" : "Ascend (f)";
    this.travelDuration = false;
    for (let i = 0; i < this.game.players.children.length; i++) {
      this.game.players.children[i].lockMovement = false;
    }
    RoomObject.openDoors(this);

  },

  startMovement () {
    for (let i = 0; i < this.game.players.children.length; i++) {
      this.game.players.children[i].lockMovement = true;
    }
    this.travelDuration = 1;
    RoomObject.lockDoors(this);
  },

  onEnter () {

  },

  onClear () {

  }
}

export default Elevator1;
