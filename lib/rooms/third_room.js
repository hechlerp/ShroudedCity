import Game from '../game';
import WallSegment from '../wall_segment';
import Dynamo from '../dynamo';
import Cultist from '../cultist.js';


const ThirdRoom = {

  wallSize: 50,

  wallTexture: new PIXI.Texture.fromImage('assets/sprites/walls/wall_segment_c.png'),

  cornerTexture: new PIXI.Texture.fromImage('assets/sprites/walls/wall_corner_c.png'),

  setUpRoom (game) {
    let cultist1 = new Cultist([600, 525],  game);
    let cultist2 = new Cultist([600, 575], game);
    game.enemies.addChild(cultist1);
    game.enemies.addChild(cultist2);

  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [this.wallSize / 2, Game.dim_y - (3 * this.wallSize / 2)];
    let segment;

    while (currentPos[0] < Game.dim_x - this.wallSize / 2) {

      segment = new WallSegment(currentPos, this.wallTexture);

      segment.rotation = 3 * Math.PI / 2;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[0] += this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture);

    segment.rotation = 3 * Math.PI / 2;
    wall.push(segment);
    game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;


    currentPos[1] -= 3 * this.wallSize;

    while (currentPos[0] > this.wallSize / 2) {
      segment = new WallSegment(currentPos, this.wallTexture);
      segment.rotation = Math.PI / 2;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;

      currentPos[0] -= this.wallSize;
    }

    segment = new WallSegment(currentPos, this.wallTexture);

    segment.rotation = 3 * Math.PI / 2;
    wall.push(segment);
    game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
    return wall;

  }

}

export default ThirdRoom;
