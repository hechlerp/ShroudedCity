import SAT from 'sat';
import HitBoxObject from './hitbox_object';

const ExplosiveObject = {
  knockback (object, ctx, distance) {
    let xDiff = object.x - ctx.x;
    let yDiff = object.y - ctx.y;
    let xDisplacement = 0;
    let yDisplacement = 0;
    if (xDiff !== 0 && yDiff !== 0) {
      distance /= Math.sqrt(2);
    }
    if (xDiff > 0) {
      xDisplacement += distance * 2 * distance / xDiff;
    } else if (xDiff < 0) {
      xDisplacement -= distance * 2 * -distance / xDiff;
    }
    if (yDiff > 0) {
      yDisplacement += distance * 2 * distance / yDiff;
    } else if (yDiff < 0) {
      yDisplacement -= distance * 2 * -distance / yDiff;
    }
    let spaceToLand = [object.x + xDisplacement, object.y + yDisplacement];
    let direction = this.determineDirection(spaceToLand, object);
    if (direction[0] > 0) {
      while (object.x < spaceToLand[0]) {
        if (this.enforceBoundaries(object)) {
          return
        } else {
          object.x += 1 * direction[0];
          object.y += 1 * direction[1];
          HitBoxObject.update(object);
        }
      }
    } else if (direction[0] < 0) {
      while (object.x > spaceToLand[0]) {
        if (this.enforceBoundaries(object)) {
          return
        } else {
          object.x += 1 * direction[0];
          object.y += 1 * direction[1];
          HitBoxObject.update(object);
        }
      }
    } else if (direction[1] > 0) {
      while (object.y < spaceToLand[1]) {
        if (this.enforceBoundaries(object)) {
          return
        } else {
          object.x += 1 * direction[0];
          object.y += 1 * direction[1];
          HitBoxObject.update(object);
        }
      }
    } else if (direction[1] < 0) {
      while(object.y > spaceToLand[1]) {
        if (this.enforceBoundaries(object)) {
          return
        } else {
          object.x += 1 * direction[0];
          object.y += 1 * direction[1];
          HitBoxObject.update(object);
        }
      }
    }

  },

  determineDirection (spaceToLand, object) {
    if (spaceToLand[0] > object.x && spaceToLand[1] === object.y) {
      return [1, 0];
    } else if (spaceToLand[0] > object.x && spaceToLand[1] > object.y) {
      return [1, 1];
    } else if (spaceToLand[0] === object.x && spaceToLand[1] > object.y) {
      return [0, 1];
    } else if (spaceToLand[0] < object.x && spaceToLand[1] > object.y) {
      return [-1, 1];
    } else if (spaceToLand[0] < object.x && spaceToLand[1] === object.y) {
      return [-1, 0];
    } else if (spaceToLand[0] < object.x && spaceToLand[1] < object.y) {
      return [-1, -1];
    } else if (spaceToLand[0] === object.x && spaceToLand[1] < object.y) {
      return [0, -1];
    } else if (spaceToLand[0] > object.x && spaceToLand[1] < object.y) {
      return [1, -1];
    }
  },

  enforceBoundaries (object) {
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
          let response = new SAT.Response();
          if (SAT.testPolygonPolygon(object.hitBox, object.game.room[fourCorners[i][1]][fourCorners[i][0]].hitBox, response)) {
            let pushBack = response.overlapN
            object.x -= pushBack.x;
            object.y -= pushBack.y;
            return true;
          }
        }

      }

    }
    return false;
  }
}

export default ExplosiveObject;
