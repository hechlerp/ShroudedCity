import PIXI from 'pixi.js';
import SAT from 'sat';
import MovingObject from './behaviors/moving_object';
import HitBoxObject from './behaviors/hitbox_object';
import PlayerCharacter from './player_character';
import StartingRoom from './rooms/starting_room';
import FirstRoom from './rooms/first_room';
import SecondRoom from './rooms/second_room';
import ThirdRoom from './rooms/third_room';
import FourthRoom from './rooms/fourth_room';
import FifthRoom from './rooms/fifth_room';
import SixthRoom from './rooms/sixth_room';
import Elevator1 from './rooms/elevator1';
import SeventhRoom from './rooms/seventh_room';
import CliffsideBottomRoom from './rooms/cliffside_bottom_room';
import WallSegment from './terrains/wall_segment';

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

  static inBounds(pos) {
    if (pos[0] < Game.dim_x && pos[0] > 0 && pos[1] < Game.dim_y && pos[1] > 0) {
      return true;
    }
  }

  doTheThing (timeDelta) {
    if (this.stopped === false) {

      for (let i = 0; i < this.enemies.children.length; i++) {
        this.enemies.children[i].move(timeDelta);
      }
      for (let i = 0; i < this.projectiles.children.length; i++) {
        this.projectiles.children[i].move(timeDelta);
      }
      this.player.move(timeDelta);

      for (var i = 0; i < this.currentRoom.triggers.length; i++) {
        this.currentRoom.triggers[i](this);
      }
      if (this.currentRoom.animateRoom) {
        this.currentRoom.animateRoom(this, timeDelta);
      }
    }
    if (this.fadeOut && this.fader.alpha <= 0.7) {
      this.fade();
    }
    this.renderer.render(this.masterContainer)
  }

  enactSetupSequence () {

    this.texts = new PIXI.Container();
    this.enemies = new PIXI.Container();
    this.wall = new PIXI.Container();
    this.sights = new PIXI.Container();
    this.floor = new PIXI.Container();
    this.projectiles = new PIXI.Container();
    this.items = new PIXI.Container();
    this.masterContainer = new PIXI.Container();
    this.environmentObjects = new PIXI.Container();

    this.fadeOut = false;
    this.addTexts();
    this.renderer.render(this.masterContainer)
    this.createRoomMatrix();
    this.currentFloor = 1;
    this.placeInRoomMatrix = [1, 9, 0];

    this.createRoom(StartingRoom);

    this.player = new PlayerCharacter([300, 300], this);
    while (this.player === false) {
      console.log('not yet');
    }


    this.createFader();

    this.masterContainer.addChild(this.floor);

    this.masterContainer.addChild(this.wall);

    this.masterContainer.addChild(this.enemies);

    this.masterContainer.addChild(this.player);

    this.masterContainer.addChild(this.environmentObjects)

    this.masterContainer.addChild(this.items);

    this.masterContainer.addChild(this.projectiles);

    this.masterContainer.addChild(this.fader);

    this.masterContainer.addChild(this.texts);
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
    this.wall.removeChildren();
    this.floor.removeChildren();
    this.enemies.removeChildren();
    this.projectiles.removeChildren();
    this.items.removeChildren();
    this.environmentObjects.removeChildren();
    if (this.currentRoom) {
      this.currentRoom.doorInfo = [];
      this.currentRoom.triggers = [];
    }
    this.currentRoom = room;
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

    room.setUpRoom(this);
  }

  createRoomMatrix () {
    // 2d Matrix for rooms
    this.roomMatrix = []
    for (var i = 0; i < 5 ; i++) {
      let newFloor = [];
      for (let i = 0; i < 10; i++) {
        let newArray = [];
        for (let j = 0; j < 10; j++) {
          newArray.push([]);
        }
        newFloor.push(newArray)
      }
      this.roomMatrix.push(newFloor);
    }
    this.roomMatrix[1][9][0] = StartingRoom;
    this.roomMatrix[1][8][0] = FirstRoom;
    this.roomMatrix[1][7][0] = SecondRoom;
    this.roomMatrix[1][7][1] = ThirdRoom;
    this.roomMatrix[1][7][2] = FourthRoom;
    this.roomMatrix[1][6][2] = FifthRoom;
    this.roomMatrix[1][5][2] = SixthRoom;
    this.roomMatrix[1][5][3] = Elevator1;
    this.roomMatrix[2][5][3] = Elevator1;
    this.roomMatrix[2][5][2] = SeventhRoom;
    this.roomMatrix[2][5][1] = CliffsideBottomRoom;
  }

  changeRoom (direction) {
    this.placeInRoomMatrix = [this.currentFloor, this.placeInRoomMatrix[1] + direction[1], this.placeInRoomMatrix[2] + direction[0]];
    let room = this.roomMatrix[this.placeInRoomMatrix[0]][this.placeInRoomMatrix[1]][this.placeInRoomMatrix[2]];
    this.createRoom(room);
  }

  createFader () {
    this.fader = new PIXI.Graphics();
    this.fader.clear()
    this.fader.beginFill(0x000000);
    this.fader.drawRect(0, 0, Game.dim_x, Game.dim_y);
    this.fader.endFill();
    this.fader.alpha = 0;
  }

  fade () {
    this.fader.alpha += 0.02;
    this.gameText.alpha += 0.02;
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

  gameOver () {
    this.gameText.text = "The city has claimed you. \n Press enter to restart";
    this.gameText.alpha = 0.3;
    this.fadeOut = true;
    this.requireProgression("enter", () => {
      this.enactSetupSequence();
    });
  }

}

export default Game;
