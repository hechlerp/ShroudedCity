const ProjectileObject = {

  removeFromGameArray (object) {
    for (var i = 0; i < object.game.projectiles.length; i++) {
      if (object === object.game.projectiles[i]) {
        object.game.projectiles.splice(i, 1);
        break;
      }
    }
  }

}

export default ProjectileObject;
