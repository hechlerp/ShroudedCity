import Door from '../terrains/door';

const RoomObject = {

  openDoors (object) {
    // debugger;
    if (object.doorInfo.length > 0) {
      for (var i = 0; i < object.doorInfo.length; i++) {
        object.doorInfo[i].game.room[Math.floor((object.doorInfo[i].pos[1] - object.wallSize / 2) / object.wallSize)][Math.floor((object.doorInfo[i].pos[0] - object.wallSize / 2) / object.wallSize)].remove();
      }
    }
  },

  lockDoors (object) {
    for (let i = 0; i < object.doorInfo.length; i++) {
      new Door (
        object.doorInfo[i].texture,
        object.doorInfo[i].game,
        object.doorInfo[i].rotation,
        object.doorInfo[i].offset,
        object.doorInfo[i].pos
      );
    }
  },

  createDoor (pos, offset, texture, game, rotation) {
    let door = {};
    door.pos = pos;
    door.offset = offset;
    door.texture = texture;
    door.game = game;
    door.rotation = rotation - (Math.PI / 2);
    return door;
  }

};

export default RoomObject;
