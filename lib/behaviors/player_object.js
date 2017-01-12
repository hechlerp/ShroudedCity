import MovingObject from './moving_object';
import SAT from 'sat';
import Game from '../game';

const PlayerObject = {

  timeDelta: 0,

  render () {

  },


  update (object) {
    // Diagonal speed (thanks Gautham)
    // (total speed)^2 = (s1)^2 + (s2)^2
    //(new speed = (a * s1)^2 + (a * s2)^2
    //(newspeed)^2 = 2(a^2)(total speed ^2)
    // new speed = sqrt(2) * a * former speed
    // new speed = former speed and solve for a
    // 1 =sqrt(2) * a
    // a = 1/sqrt(2)
    object.velY = 0
    object.velX = 0

    if (key.isPressed("up")) {
      if (key.isPressed("left") || key.isPressed("right")) {
        object.velY  = -(3 * (1 / Math.sqrt(2)))
      } else {
        object.velY = -3;
      }
    }
    if (key.isPressed("left")) {
      if (key.isPressed("up")  || key.isPressed("down")) {
        object.velX = -(3 * (1 / Math.sqrt(2)))
      } else {
        object.velX = -3;
      }
    }
    if (key.isPressed("down")) {
      if (key.isPressed("left") || key.isPressed("right")) {
        object.velY = 3 * (1 / Math.sqrt(2))
      } else {
        object.velY = 3;
      }
    }
    if (key.isPressed("right")) {
      if (key.isPressed("up")  || key.isPressed("down")) {
        object.velX = 3 * (1 / Math.sqrt(2))
      } else {
        object.velX = 3;
      }
    }

    if (object.lockMovement) {
      [object.velX, object.velY] = [0,0];
    }

    if (!object.lockDirection){
      MovingObject.determineDirection(object);
    }

    if (object.primaryAttackLockout) {
      object.primaryAttackDelay++;
      if (object.primaryAttackDelay > 30) {
        object.primaryAttackLockout = false;
        object.primaryAttackDelay = 0;
      }
    } else if (key.isPressed("a") && !object.primaryAttackLockout) {
      object.primaryAttack(this.timeDelta);
    }
    if (object.secondaryAttackLockout) {
      object.secondaryAttackDelay++;
      if (object.secondaryAttackDelay > 80) {
        object.secondaryAttackLockout = false;
        object.secondaryAttackDelay = 0;
      }
    } else if (key.isPressed("s") && !object.secondaryAttackLockout) {
      object.secondaryAttack();
    }
    if (object.specialAttackLockout) {
      object.specialAttackDelay++;
      if (object.specialAttackDelay > 300) {
        object.specialAttackLockout = false;
        object.specialAttackDelay = 0;
      }
    } else if (key.isPressed("d") && object.special >= 50 && !object.specialAttackLockout) {
      object.specialAttack();
    }


    if (!object.leftRoom && (object.x > Game.dim_x || object.x < 0 || object.y > Game.dim_y || object.y < 0)) {
      object.leftRoom = true;
      this.leaveRoom(object);
    }
    if (object.newRoom && MovingObject.isInRoom(object)) {
      object.game.currentRoom.onEnter();
      object.newRoom = false;
    }

    this.animate(this.timeDelta, object);

    for (let i = 0; i < object.game.items.children.length; i++) {
      if ((object.game.items.children[i].x - object.x) < object.game.items.children[i].width && (object.game.items.children[i].x - object.x) > -(object.game.items.children[i].width) &&
       (object.game.items.children[i].y - object.y) < object.game.items.children[i].height && (object.game.items.children[i].y - object.y) > -(object.game.items.children[i].height)) {
         if (SAT.testPolygonPolygon(object.game.items.children[i].hitBox, object.hitBox)) {
           object.game.items.children[i].pickUp(object);
         }
      }
    }
  },

  animate (timeDelta, object) {
    let stopped = object.velX === 0 && object.velY === 0;
    if (object.attack) {
      object.animateAttack(stopped, timeDelta);
    } else {
      this.animateMovement(stopped, timeDelta, object);
    }
    object.stopped = stopped;
  },

  animateMovement (stopped, timeDelta, object) {
    if ((object.stopped !== stopped) || (timeDelta % 11 === 0) && !stopped) {
      let i = timeDelta % 2;
      if (object.textures[object.direction + i]) {
        object.sprite.texture = object.textures[object.direction + i];
      } else {
        object.sprite.texture = object.textures["down"];
      }
    }
  },


  onWallCollision (response, object) {
    let pushBack = response.overlapV
    object.x -= pushBack.x;
    object.y -= pushBack.y;
  },

  leaveRoom (object) {
    if (object.x > Game.dim_x) {
      object.game.changeRoom([1,0]);
      object.x = object.width / 4;
    } else if (object.x < 0) {
      object.game.changeRoom([-1,0]);
      object.x = Game.dim_x - object.width / 4;
    } else if (object.y > Game.dim_y) {
      object.game.changeRoom([0, 1]);
      object.y = object.height / 4;
    } else {
      object.game.changeRoom([0, -1]);
      object.y = Game.dim_y - object.height / 4;
    }
    object.newRoom = true;
    object.leftRoom = false;
  },

  dies (object) {
    object.game.gameOver();
  }

}

export default PlayerObject;
