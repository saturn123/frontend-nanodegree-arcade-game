let gameScore = 0,

    livesRemaining = document.querySelector(".lives > span"),
    score = document.querySelector('.score > span');

//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

//General class to create characters in the game
class Actors {
  constructor() {
    this.sprite = 'images/';
    this.x = 2;
    this.y = 5;
  }
  // Draw the enemy or player on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, (this.y * 83)-20);
  }
  //Update method to check if x and y position out of bound
  update(dt) {
    this.isOutOfBoundsX = this.x > 5;
    this.isOutOfBoundsY = this.y === 0;
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
    this.rate = 5;
    this.speed = Math.floor(200 * this.rate + Math.random() * this.rate);
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

  changeSpeed(rate) {
    this.speed = 2 + Math.random() * rate;
  }

  reset() {
    this.changeSpeed(randomIntFromInterval(1,this.rate));
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
    this.lives = 3;
  }
  //Update method to check if the Player win the game
  update(dt) {
    super.update();
    if(!this.moving && !this.win ) {

      this.checkIfWin();
      }

  }
  // Draw the enemy or player on the screen, required method for game
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

  reset() {
    this.x = 2;
    this.y = 5;
    this.win = false;
  }

  levelUp () {
    if(gameScore >= 5 && this.lives > 0) {
      this.rate += 3;
    }
  }

  checkIfWin() {
    if (this.isOutOfBoundsY) {
      if(gameScore === 10 && this.lives > 0){
        this.success();
      } else {
        gameScore++;
        score.innerText = gameScore * 100;
        this.reset();
      }
    }
  }

  success() {
    this.win = true;
  }

  loseLife() {
    if (this.lives > 0) {
      this.lives--;
      livesRemaining.innerText = this.lives;
    }
  }

  allLivesUsed() {
    return this.lives === 0 ? true : false;
  }

  endGame() {
    this.lives = 3;
    livesRemaining.innerText = this.lives;
    gameScore = 0;
    score.innerText = gameScore;
  }

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player();
const allEnemies = [...Array(3)].map((enemy, i) => new Enemy(-(Math.floor(1 + Math.random() * 5)), i+1));

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
