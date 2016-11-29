const EnemyObject = {

  checkClear (object) {
    if (object.game.enemies.children.length === 0) {
      object.game.currentRoom.onClear();
    }
  }

};

export default EnemyObject;
