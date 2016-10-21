import PIXI from 'pixi.js';
import SAT from 'sat';
import MovingObject from './moving_object';
import HitBoxObject from './hitbox_object';
import PlayerCharacter from './player_character';
import SparkySparkyLightningMan from './sparky_sparky_lightning_man';
import FirstRoom from './rooms/first_room';
import WallSegment from './wall_segment';

// game dimensions
const dim_x = 900,
dim_y = 700;


class Game {
  constructor (renderer) {
    this.renderer = renderer;
    this.stopped = false;
  }

// Retrieve dimensions
  static get dim_x() {
    return dim_x;
  }

  static get dim_y() {
    return dim_y;
  }

  doTheThing () {
    if (this.stopped === false) {
      for (let i = 0; i < this.bunnies.children.length; i++) {
        this.bunnies.children[i].move(this.bunnies.children[i]);
        this.bunnies.children[i].updateHitBox(this.bunnies.children[i]);
        this.bunnies.children[i].enforceBoundaries(this.bunnies.children[i]);

        let test = SAT.testPolygonPolygon(this.bunnies.children[i].hitBox, this.player.hitBox);
        if (test) {
          this.player.healthLost++;
        }
      }
      for (let i = 0; i < this.enemies.children.length; i++) {
        this.enemies.children[i].move();
      }
      for (let i = 0; i < this.projectiles.children.length; i++) {
        this.projectiles.children[i].move();
      }
      this.player.move();
    }
    this.renderer.render(this.masterContainer)
  }

  enactSetupSequence () {
    let texture = new PIXI.Texture.fromImage('./assets/sprites/bunny.png');
    this.bunnies = new PIXI.Container();
    this.texts = new PIXI.Container();
    this.enemies = new PIXI.Container();
    this.wall = new PIXI.Container();
    this.projectiles = new PIXI.Container();
    this.masterContainer = new PIXI.Container();

    this.makeSomeBunnies();

    this.addTexts();
    this.renderer.render(this.masterContainer)

    this.currentRoom = FirstRoom;
    this.createRoom(this.currentRoom);


    this.player = new PlayerCharacter([300, 300], this);
    while (this.player === false) {
      console.log('not yet');
    }

    let sparkMan = new SparkySparkyLightningMan([200, 200], [1,0], this);
    let sparkMan2 = new SparkySparkyLightningMan([500, 200], [0, -1], this);

    this.enemies.addChild(sparkMan);
    this.enemies.addChild(sparkMan2);

    this.masterContainer.addChild(this.wall);

    this.masterContainer.addChild(this.enemies);

    this.masterContainer.addChild(this.player);

    this.masterContainer.addChild(this.projectiles);

    this.masterContainer.addChild(this.bunnies);
    this.masterContainer.addChild(this.texts);
  }

  makeSomeBunnies () {
    let xPos = 200;
    let yPos = 150;
    let texture = PIXI.Texture.fromImage('./assets/sprites/bunny.png');

    while (this.bunnies.children.length < 10) {
      let bunny = new PIXI.Container();
      bunny.sprite = new PIXI.Sprite(texture);
      bunny.velX = 1;
      bunny.velY = 1;
      bunny.game = this;
      [bunny.x, bunny.y] = [xPos, yPos];
      bunny.move = (object) => { MovingObject.move(object); }
      bunny.enforceBoundaries = (object) => { MovingObject.enforceBoundaries(object); }
      HitBoxObject.setUpHitBox(bunny, 20, 35);
      bunny.onWallCollision = (response) => {
        let vector = response.overlapN;
        bunny.velX -= vector.x;
        bunny.velY -= vector.y;

      }
      bunny.addChild(bunny.sprite);
      bunny.updateHitBox = (object) => { HitBoxObject.update(object); }
      [bunny.sprite.anchor.x, bunny.sprite.anchor.y] = [0.5, 0.5];
      yPos += 30;
      xPos += 30;
      this.bunnies.addChild(bunny);
    }
  }

  addTexts () {
    this.gameText = new PIXI.Text(
      "Welcome to the Shrouded City! \n You nerd. \n Press enter to continue",
      {font: '24px Arial', fill: '#01d450', align: 'center'}
    );
    [this.gameText.anchor.x, this.gameText.anchor.y] = [0.5, 0.5];
    [this.gameText.x, this.gameText.y] = [Game.dim_x / 2, Game.dim_y / 2];
    this.texts.addChild(this.gameText);
    this.requireProgression("enter");
    this.setupGlobalKeys();

  }

  setupGlobalKeys () {
    key("esc", () => {
      if (this.gameText.text == false) {
        this.gameText.text = "-Game paused- \n Press enter to unpause";

        this.requireProgression("enter");
      }
    })



  }

  createRoom (room) {
    this.room = []   /* 2d Matrix*/
    let i = 0;
    while (i < Game.dim_y / room.wallSize) {
      this.room.push([]);
      let j = 0;
      while (j < Game.dim_x / room.wallSize) {
        this.room[i].push("blank");
        j++;
      }
      i++;
    }
    let wall = room.buildAWall(this);
    for (let i = 0; i < wall.length; i++) {
      this.wall.addChild(wall[i])
    }

  }

  changeRoom () {
    
  }




  requireProgression (selectedKey, callback) {
    this.stopped = true;
    key(selectedKey, ()=> {
      this.progress(selectedKey, callback);
    })
  }

  progress (selectedKey, callback) {
    key.unbind(selectedKey);
    this.stopped = false;
    this.gameText.text = ""
    callback && callback();
  }
}

export default Game;
