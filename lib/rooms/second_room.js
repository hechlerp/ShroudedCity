import Game from '../game';
import WallSegment from '../wall_segment';
import Dynamo from '../enemies/dynamo';
import Cultist from '../enemies/cultist.js';


const SecondRoom = {

  wallSize: 50,

  wallTexture: new PIXI.Texture.fromImage('assets/sprites/walls/wall_segment_a.png'),

  cornerTexture: new PIXI.Texture.fromImage('assets/sprites/walls/wall_corner_a.png'),

  background: new PIXI.Texture.fromImage('assets/backgrounds/second_room_background.png'),

  setUpRoom (game) {
    game.floor.addChild(new PIXI.Sprite(this.background));
    let dynamo = new Cultist([600, 100],  game);
    let cultist = new Cultist([100, 100], game);
    game.enemies.addChild(dynamo);
    game.enemies.addChild(cultist);

  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [this.wallSize / 2, this.wallSize / 2];
    let segment;
    while (currentPos[1] < Game.dim_y - this.wallSize / 2) {
      if (currentPos[1] === this.wallSize / 2) {
        segment = new WallSegment(currentPos, this.cornerTexture);
      } else {
        segment = new WallSegment(currentPos, this.wallTexture);
      }
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      currentPos[1] += this.wallSize;
    }

    while (currentPos[0] < Game.dim_x - this.wallSize / 2) {
      if (currentPos[0] > Game.dim_x / 2 - this.wallSize && currentPos[0] < Game.dim_x / 2 + this.wallSize) {
      } else {

        if (currentPos[0] === this.wallSize / 2) {
          segment = new WallSegment(currentPos, this.cornerTexture);
        } else {
          segment = new WallSegment(currentPos, this.wallTexture);
        }
        segment.rotation = 3 * Math.PI / 2;
        wall.push(segment);
        game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;


      }
      currentPos[0] += this.wallSize;
    }

    while (currentPos[1] > this.wallSize / 2) {
      if (currentPos[1] < Game.dim_y - (3 * this.wallSize / 2) && currentPos[1] > Game.dim_y - (9 * this.wallSize / 2)) {
      } else {
        if (currentPos[1] === Game.dim_y - (this.wallSize / 2)) {
          segment = new WallSegment(currentPos, this.cornerTexture);
        } else {
          segment = new WallSegment(currentPos, this.wallTexture);
        }
        segment.rotation = Math.PI;
        wall.push(segment);
        game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      }
      currentPos[1] -= this.wallSize;
    }
    while (currentPos[0] > this.wallSize / 2) {

      if (currentPos[0] === Game.dim_x - (this.wallSize / 2)) {
        segment = new WallSegment(currentPos, this.cornerTexture);
      } else {
        segment = new WallSegment(currentPos, this.wallTexture);
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
