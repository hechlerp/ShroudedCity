const HpObject = {

  takeDamage(object, amt) {
    if (object.health - amt <= 0) {
      object.health = 0
      object.dies()
    } else {
      object.health -= amt
    }
  },

  regainHealth(object, amt) {
    if (object.health + amt > object.maxHealth) {
      object.health = object.maxHealth
    } else {
      object.health += amt
    }
  },

  render(object) {
    object.healthBar.clear();
    object.healthBar.beginFill(0xff0000);
    object.healthBar.drawRect(-25, -50, object.health / 2, 10);
    object.healthBar.endFill;
  },

  update(object) {
    if (object.healthGained > 0) {
      this.regainHealth(object, object.healthGained)
      object.healthGained = 0;
    } else if (object.healthLost > 0) {
      this.takeDamage(object, object.healthLost)
      object.healthLost = 0;
    }
  }

}

export default HpObject
