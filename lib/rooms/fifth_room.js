import Game from '../game';
import PIXI from 'pixi.js'
import WallSegment from '../wall_segment';
import Dynamo from '../enemies/dynamo';


const SecondRoom = {

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

  setUpRoom (game) {
    game.floor.addChild(new PIXI.Sprite(this.background()));
    new Dynamo([475, 100], [0,0], game);
    new Dynamo([425, 100], [0,0], game);

  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [(Game.dim_x / 2) - (3 * this.wallSize / 2), this.wallSize / 2];
    let segment;

    while (currentPos[1] < Game.dim_y - this.wallSize / 2) {

      segment = new WallSegment(currentPos, this.wallTexture());

      // segment.rotation = 3 * Math.PI / 2;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[1] += this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture());

    // segment.rotation = 3 * Math.PI / 2;
    wall.push(segment);
    game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;


    currentPos[0] += 3 * this.wallSize;

    while (currentPos[1] > this.wallSize / 2) {
      segment = new WallSegment(currentPos, this.wallTexture());
      // segment.rotation = Math.PI / 2;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[1] -= this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture());

    // segment.rotation = 3 * Math.PI / 2;
    wall.push(segment);
    game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
    return wall;

  }

}

export default SecondRoom;
