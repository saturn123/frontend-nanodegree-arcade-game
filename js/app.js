//General class to create characters in the game
class Actors {
  constructor() {
    this.sprite = 'images/';
    this.x = 2;
    this.y = 5;
  }
  // Draw the enemy or player on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
  }
  //Update method to check if x and y position out of bound
  update(dt) {
    this.isOutOfBoundsX = this.x > 5;
    this.isOutOfBoundsY = this.y < 1;
  }
  //Method for collision detection for player and/or Enemy
  checkCollisions(playerOrEnemy) {
    if(this.y === playerOrEnemy.y) {
      if(this.x >= playerOrEnemy.x - 0.5 && this.x <= playerOrEnemy.x + 0.5) {
        return true;
      }
    }
    else {
      return false;
    }
  }
}

// Enemies our player must avoid
class Enemy extends Actors {
  constructor(x, y) {
    super();
    // The image/sprite for our enemies
    this.sprite += 'enemy-bug.png';
    this.x = x;
    this.y = y;
    this.level = 1;
    this.speed = Math.floor(this.level + Math.random() * this.level);
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    super.update();
    if(this.isOutOfBoundsX) {
      this.reset();
    }
    else {
      this.x += this.speed * dt;
    }
  }

  changeSpeed(num) {
    this.speed = 0.5 + Math.random() * num;
  }

  reset() {
    this.changeSpeed(3.0);
    this.x = -(Math.floor(1 + Math.random() * 5));
  }
}

// Player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends Actors {
  constructor() {
    super();
    this.sprite += 'char-boy.png';
    this.moving = false;
    this.win = false;
    this.score = 0;
    this.lives = 0
  }
  //Update method to check if the Player win the game
  update(dt) {
    super.update();
      if(this.isOutOfBoundsY && !this.moving && !this.win) {
        alert('win');
        this.win = true;
      }
  }

  render() {
    super.render();
    this.moving = false;
  }

  handleInput(input) {
    switch (input) {
      case 'left':
        this.x = this.x > 0 ? this.x - 1 : this.x;
        break;
      case 'up':
        this.y = this.y > 0 ? this.y - 1 : this.y;
        break;
      case 'right':
        this.x = this.x < 4 ? this.x + 1 : this.x;
        break;
      case 'down':
        this.y = this.y < 5 ? this.y + 1 : this.y;
        break;
      default:
        break;
    }
    this.moving = true;
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player();
const allEnemies = [...Array(3)].map((element, i) => new Enemy(-(Math.floor(1 + Math.random() * 5)), i+1));


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
