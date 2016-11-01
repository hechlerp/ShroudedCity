import Game from '../game';
import WallSegment from '../wall_segment';
import Dynamo from '../dynamo';
import Cultist from '../cultist.js';


const FourthRoom = {

  wallSize: 50,

  wallTexture: new PIXI.Texture.fromImage('assets/sprites/walls/wall_segment_b.png'),

  cornerTexture: new PIXI.Texture.fromImage('assets/sprites/walls/wall_corner_b.png'),

  floorTextures : {
    "beam": new PIXI.Texture.fromImage('assets/sprites/floors/floor_tile_a_beam.png'),
    "blank": new PIXI.Texture.fromImage('assets/sprites/floors/floor_tile_a_blank.png'),
    "circle": new PIXI.Texture.fromImage('assets/sprites/floors/floor_tile_a_circle.png')
  },

  setUpRoom (game) {
    this.createFloor(game);
    let dynamo = new Dynamo([500, 100], [1,1], game);
    let cultist = new Cultist([600, 100], game);
    let cultist2 = new Cultist([600, 300], game);
    game.enemies.addChild(dynamo);
    game.enemies.addChild(cultist);
    game.enemies.addChild(cultist2);

  },

  buildAWall (game) {
    let wall = [];
    let currentPos = [this.wallSize / 2, this.wallSize / 2];
    let segment;
    while (currentPos[1] < Game.dim_y - this.wallSize / 2) {
      if (currentPos[1] < Game.dim_y - (3 * this.wallSize / 2) && currentPos[1] > Game.dim_y - (9 * this.wallSize / 2)) {
      } else {
        if (currentPos[1] === this.wallSize / 2) {
          segment = new WallSegment(currentPos, this.cornerTexture);
        } else {
          segment = new WallSegment(currentPos, this.wallTexture);
        }
        wall.push(segment);
        game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
      }
      currentPos[1] += this.wallSize;
    }

    while (currentPos[0] < Game.dim_x - this.wallSize / 2) {

      if (currentPos[0] === this.wallSize / 2) {
        segment = new WallSegment(currentPos, this.cornerTexture);
      } else {
        segment = new WallSegment(currentPos, this.wallTexture);
      }
      segment.rotation = 3 * Math.PI / 2;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;


      currentPos[0] += this.wallSize;
    }

    while (currentPos[1] > this.wallSize / 2) {

      if (currentPos[1] === Game.dim_y - (this.wallSize / 2)) {
        segment = new WallSegment(currentPos, this.cornerTexture);
      } else {
        segment = new WallSegment(currentPos, this.wallTexture);
      }
      segment.rotation = Math.PI;
      wall.push(segment);
      game.room[(currentPos[1] - this.wallSize / 2) / this.wallSize][(currentPos[0] - this.wallSize / 2) / this.wallSize] = segment;
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

  },

  createFloor (game) {
    let backgroundSprite = new PIXI.Sprite(this.floorTextures.blank);
    backgroundSprite.width = Game.dim_x;
    backgroundSprite.height = Game.dim_y;
    game.floor.addChild(backgroundSprite);
    let nextToWall = 40;
    let xIncrement = 10;
    let yIncrement = 6;
    let currentPos = [nextToWall, nextToWall + 5];

    while (currentPos[0] < Game.dim_x / 2 - (6 * xIncrement)) {
      let texture = this.floorTextures.beam;
      let tiles = this.createTileArray(currentPos, texture)
      for (let j = 0; j < tiles.length; j++) {
        game.floor.addChild(tiles[j])
      }

      currentPos[0] += xIncrement;
      currentPos[1] += yIncrement;
    }

    let circleSprite = new PIXI.Sprite(this.floorTextures.circle);
    [circleSprite.anchor.x, circleSprite.anchor.y] = [0.5, 0.5];
    [circleSprite.x, circleSprite.y] = [Game.dim_x / 2 - 1, Game.dim_y / 2 + 1];
    game.floor.addChild(circleSprite);


  },

  createTileArray (currentPos, texture) {
    let tilesArray = [];
    let topLeft = new PIXI.Sprite(texture);
    let rotation = -(Math.PI / 3);
    [topLeft.x, topLeft.y] = [currentPos[0], currentPos[1]];
    topLeft.rotation = rotation
    tilesArray.push(topLeft);
    let bottomLeft = new PIXI.Sprite(texture);
    [bottomLeft.x, bottomLeft.y] = [currentPos[0], Game.dim_y - currentPos[1]];
    bottomLeft.rotation = rotation - (Math.PI / 3);
    tilesArray.push(bottomLeft);
    let bottomRight = new PIXI.Sprite(texture);
    [bottomRight.x, bottomRight.y] = [Game.dim_x - currentPos[0], Game.dim_y - currentPos[1]];
    bottomRight.rotation = rotation - (Math.PI);
    tilesArray.push(bottomRight);
    let topRight = new PIXI.Sprite(texture);
    [topRight.x, topRight.y] = [Game.dim_x - currentPos[0], currentPos[1]];
    topRight.rotation = -(rotation);
    tilesArray.push(topRight);
    for (let i = 0; i < tilesArray.length; i++) {
      [tilesArray[i].anchor.x, tilesArray[i].anchor.y] = [0.5, 0.5];
    }
    return tilesArray;
  }

}

export default FourthRoom;