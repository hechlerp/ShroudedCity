const HpObject = {

  takeDamage (object, amt) {
    if (object.health - amt <= 0) {
      object.health = 0
      object.dies()
    } else {
      object.health -= amt
    }
  },

  regainHealth (object, amt) {
    if (object.health + amt > object.maxHealth) {
      object.health = object.maxHealth
    } else {
      object.health += amt
    }
  },

  render (object) {
    object.healthBar.clear();
    object.healthBar.beginFill(0xff0000);
    object.healthBar.drawRect(-(object.maxHealth / 4), -50, object.health / 2, 10);
    object.healthBar.endFill();
    if (object.grayHealth) {
      object.healthBar.beginFill(0x777777);
      object.healthBar.drawRect(object.health / 2 - (object.maxHealth / 4), -50, object.grayHealth / 2, 10);
      object.healthBar.endFill();
    }
  },

  update (object) {
    if (object.healthGained > 0) {
      this.regainHealth(object, object.healthGained)
      object.healthGained = 0;
    } else if (object.healthLost > 0) {
      object.grayHealth = object.healthLost
      this.takeDamage(object, object.healthLost);
      object.healthLost = 0;
    }
    if (object.grayHealth) {
      object.grayHealth -= 3;
      if (object.grayHealth > object.health) {
        object.grayHealth = object.health;
      } else if (object.grayHealth <= 0) {
        object.grayHealth = false;
      }
    }
  }

}

export default HpObject
