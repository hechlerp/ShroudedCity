const MovingObject = {

  move (object) {
    object.x += object.velX;
    object.y += object.velY;

  },

  enforceBoundaries (object) {

    // TODO account for rotation

    let fourCorners = [];

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


  },

  determineDirection (object) {
    if (object.velX === 0 && object.velY === 0) {
    } else {
      object.direction = "";
      if (object.velY > 0) {
        object.direction += "down"
      } else if (object.velY < 0) {
        object.direction += "up"
      }
      if (object.velX > 0) {
        object.direction += "right"
      } else if (object.velX < 0) {
        object.direction += "left"
      }
    }

  },

  render (object) {
    this.move(object)
  },

  update (object) {
    this.enforceBoundaries(object)

  }

}






export default MovingObject;
