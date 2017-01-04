#Shrouded City

[ShroudedCity][live]
[live]: http://peterhechler.com/ShroudedCity

Shrouded city is a 2D dungeon crawler built with [pixi.js][pixi_repo].
[pixi_repo]: https://github.com/pixijs/pixi.js

###Starting Screen

![StartingScreen]


###Technical Details

- Shrouded City keeps track of wall positions and the locations of rooms with matrices. A 2d array tracks the position of each wall segment and uses the player's position to key into the matrix and check for walls. By just using some basic math, the normal wall check works in constant time, and never checks whether the player is colliding with walls it's nowhere near.

        fourCorners.push([
          Math.floor((object.x + object.hitBox.calcPoints[0].x) / object.game.currentRoom.wallSize),
          Math.floor((object.y + object.hitBox.calcPoints[0].y) / object.game.currentRoom.wallSize)
        ]);

        fourCorners.push([
          Math.floor((object.x + object.hitBox.calcPoints[1].x) / object.game.currentRoom.wallSize),
          Math.floor((object.y + object.hitBox.calcPoints[1].y) / object.game.currentRoom.wallSize)
        ]);

        fourCorners.push([
          Math.floor((object.x + object.hitBox.calcPoints[2].x) / object.game.currentRoom.wallSize),
          Math.floor((object.y + object.hitBox.calcPoints[2].y) / object.game.currentRoom.wallSize)
        ]);

        fourCorners.push([
          Math.floor((object.x + object.hitBox.calcPoints[3].x) / object.game.currentRoom.wallSize),
          Math.floor((object.y + object.hitBox.calcPoints[3].y) / object.game.currentRoom.wallSize)
        ]);

        for (let i = 0; i < fourCorners.length; i++) {
          if (object.game.room[fourCorners[i][1]] && object.game.room[fourCorners[i][1]][fourCorners[i][0]]) {
            if (object.game.room[fourCorners[i][1]][fourCorners[i][0]] !== "blank") {
              object.game.room[fourCorners[i][1]][fourCorners[i][0]].checkCollision(object);
            }
          }
        }

  Any moving object that needs to check for wall collision is simply marked with the behavior "MovingObject", and then checks to see if its corners key into a wall segment every frame. If they do, only then does it check for collision. To do so, I'm using [this][https://github.com/jriecken/sat-js] Separating Axis Theorem library.

- Instead of using inheritance, many game objects have "behavior" objects attached to them to build objects through composition. For example, any object in the game that needs a health bar runs the HpObject's setup methods in its constructor (passing in itself), then adds HpObject to an array of behaviors. Every frame, it runs the update and render methods on each behavior in the array, which keeps the code clean and modular.

          render (object) {
            let height = (object.sprite.height > 50 ? object.sprite.height / 2 : object.sprite.height);
            object.healthBar.clear();
            object.healthBar.beginFill(0xff0000);
            object.healthBar.drawRect(-(object.maxHealth / 4), -(height + 2), object.health / 2, 10);
            object.healthBar.endFill();
            if (object.grayHealth) {
              object.healthBar.beginFill(0x777777);
              object.healthBar.drawRect(object.health / 2 - (object.maxHealth / 4), -(height + 2), object.grayHealth / 2, 10);
              object.healthBar.endFill();
            }
          },

          update (object) {
            if (object.healthGained > 0) {
              this.regainHealth(object, object.healthGained)
              object.healthGained = 0;
            } else if (object.healthLost > 0) {
              object.grayHealth = object.healthLost
              this.takeDamage(object, object.healthLost);
              object.healthLost = 0;
            }
            if (object.grayHealth) {
              object.grayHealth -= 3;
              if (object.grayHealth > object.health) {
                object.grayHealth = object.health;
              } else if (object.grayHealth <= 0) {
                object.grayHealth = false;
              }
            }
          }


  By passing in the game object to the behavior object, the behavior can manipulate whatever it needs to without the object being bound to it in any way. An enemy might share some functionality with a player, but the two need not inherit from some web of classes just in order to do that.


### Features

- Players havve several  different attacks they can employ how they see fit to make it through the dungeon.
- Introduction and instructions are presented at the start of the game and not on restarts.
- WebGL falls back on HTML5 Canvas if the browser doesn't support it.
- Assets are all preloaded, preventing intermittent lag.



###To-do

- [ ] Expand dungeon to include more rooms and enemies.
- [ ] Improve algorithms for enemies chasing the player.
- [ ] Add additional playable characters.
- [ ] Create multiplayer variant.


[StartingScreen]: ./assets/starting_room_ss_cropped.png
