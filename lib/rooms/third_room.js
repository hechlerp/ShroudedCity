import Game from '../game';
import WallSegment from '../wall_segment';
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

  setUpRoom (game) {
    game.floor.addChild(new PIXI.Sprite(this.background()));
    let cultist = new Cultist([600, 575], game);
    game.enemies.addChild(cultist);

  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [this.wallSize / 2, Game.dim_y - (3 * this.wallSize / 2)];
    let segment;

    while (currentPos[0] < Game.dim_x - this.wallSize / 2) {

      segment = new WallSegment(currentPos, this.wallTexture());

      segment.rotation = 3 * Math.PI / 2;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[0] += this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture());

    segment.rotation = 3 * Math.PI / 2;
    wall.push(segment);
    game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;


    currentPos[1] -= 3 * this.wallSize;

    while (currentPos[0] > this.wallSize / 2) {
      segment = new WallSegment(currentPos, this.wallTexture());
      segment.rotation = Math.PI / 2;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[0] -= this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture());

    segment.rotation = 3 * Math.PI / 2;
    wall.push(segment);
    game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
    return wall;

  }

}

export default ThirdRoom;
