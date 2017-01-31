const EnemyObject = {

  checkClear (object) {
    if (object.game.enemies.length === 0) {
      object.game.currentRoom.onClear();
    }
  },

  findTarget (game) {
    let index = Math.floor(Math.random(0) * game.players.length)
    return game.players[index];
  },

  removeFromGameArray(object) {
    for (let i = 0; i < object.game.enemies.length; i++) {
      if (object === object.game.enemies[i]) {
        object.game.enemies.splice(i, 1);
        break;
      }
    }
  }

};

export default EnemyObject;
