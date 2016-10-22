import Game from '../game';
import WallSegment from '../wall_segment';
import SparkySparkyLightningMan from '../sparky_sparky_lightning_man';


// TODO Make 2d array for rooms, rather than requiring
const SecondRoom = {

  wallSize: 50,

  wallTexture () {
    return new PIXI.Texture.fromImage('assets/sprites/walls/wall_segment_a.png');
  },

  cornerTexture () {
    return new PIXI.Texture.fromImage('assets/sprites/walls/wall_corner_a.png');
  },

  setUpRoom (game) {
    let sparkMan = new SparkySparkyLightningMan([600, 100], [1,0], game);
    game.enemies.addChild(sparkMan);

  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [this.wallSize / 2, this.wallSize / 2];
    let segment;
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

    while (currentPos[0] < Game.dim_x - this.wallSize / 2) {
      if (currentPos[0] === (Game.dim_x / 2) + (this.wallSize / 2)) {
      } else {

        if (currentPos[0] === this.wallSize / 2) {
          segment = new WallSegment(currentPos, this.cornerTexture());
        } else {
          segment = new WallSegment(currentPos, this.wallTexture());
        }
        segment.rotation = 3 * Math.PI / 2;
        wall.push(segment);
        game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;


      }
      currentPos[0] += this.wallSize;
    }

    while (currentPos[1] > this.wallSize / 2) {
      if (currentPos[1] === Game.dim_y - (this.wallSize / 2)) {
        segment = new WallSegment(currentPos, this.cornerTexture());
      } else {
        segment = new WallSegment(currentPos, this.wallTexture());
      }
      segment.rotation = Math.PI;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      currentPos[1] -= this.wallSize;
    }
    while (currentPos[0] > this.wallSize / 2) {

      if (currentPos[0] === Game.dim_x - (this.wallSize / 2)) {
        segment = new WallSegment(currentPos, this.cornerTexture());
      } else {
        segment = new WallSegment(currentPos, this.wallTexture());
      }
      segment.rotation = Math.PI / 2;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[0] -= this.wallSize;
    }
    return wall;

  }

}

export default SecondRoom;
