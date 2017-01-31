const ItemObject = {
  removeFromGameArray (object) {
    for (let i = 0; i < object.game.items.length; i++) {
      if (object === object.game.items[i]) {
        object.game.items.splice(i, 1);
        break;
      }
    }
  }

}

export default ItemObject;
