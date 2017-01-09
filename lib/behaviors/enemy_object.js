const EnemyObject = {

  checkClear (object) {
    if (object.game.enemies.children.length === 0) {
      object.game.currentRoom.onClear();
    }
  },

  findTarget (game) {
    let index = Math.floor(Math.random(0) * game.players.children.length)
    return game.players.children[index];
  }

};

export default EnemyObject;
