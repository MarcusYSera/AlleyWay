<template>
  <div id="game-canvas" tabindex="0" @keydown.prevent="handleKeyDown">
    <div id="paddle" :style="{ transform: 'translateX(' + paddlePosition + 'px)' }"></div>
    <div id="ball" :style="{ transform: 'translate(' + ballX + 'px, ' + ballY + 'px)' }"></div>
    <!-- Generate breakable bricks -->
    <div v-for="(row, rowIndex) in bricks" :key="rowIndex" class="brick-row">
      <div v-for="(brick, brickIndex) in row" :key="brickIndex" :class="{ 'brick': true, 'brick-hidden': !brick }">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameLayout',
  data() {
    return {
      bricks: [], // Array to store breakable bricks
      numRows: 20,
      numCols: 9,
      paddlePosition: 180,
      ballX: 195, // Initial X position of the ball
      ballY: 400, // Initial Y position of the ball
      ballSpeedX: (Math.random() < 0.5 ? 1 : -1) * (Math.random() + 0.5), // Random angle adjustment
      ballSpeedY: 0.75, // Vertical velocity of the ball
      canvasWidth: 400, // Width of the game canvas
      canvasHeight: 600, // Height of the game canvas
      ballSize: 8, // Size of the ball
      paddleWidth: 31.81, // Width of the paddle
      paddleHeight: 7.1, // Height of the paddle
      gamePaused: false, // Flag to track the game's pause state
      brickWidth: 31.82,
      brickHeight: 7.09,
      bricksToRemove: new Set(), // Set to store positions of bricks to remove
    }
  },
  mounted() {
    this.generateBricks();
    this.gameLoop();
  },
  beforeDestroy() {
    // Remove event listener when the component is destroyed
  },
  methods: {
    resetBricks() {
      // Clear the current bricks array
      this.bricks = [];
      this.paddlePosition = 180;
      this.ballX = 195;
      this.ballY = 400;
      this.ballSpeedX = (Math.random() < 0.5 ? 1 : -1) * (Math.random() + 0.5);
      this.ballSpeedY = 0.75;
      // Generate new bricks
      this.generateBricks();
    },
    removeBricks() {
      // Remove marked bricks from the bricks array
      this.bricksToRemove.forEach(pos => {
        const [row, col] = pos.split(',').map(Number);
        this.bricks[row][col] = false;
      });
      // Clear the set for the next frame
      this.bricksToRemove.clear();
    },
    checkBrickCollisions() {
      for (let row = 0; row < this.numRows; row++) {
        for (let col = 0; col < this.numCols; col++) {
          if (this.bricks[row][col]) {
            const brickX = col * this.brickWidth + col * 5 + this.brickWidth;
            const brickY = row * this.brickHeight + row * 5;

            if (
              this.ballX + this.ballSize >= brickX &&
              this.ballX <= brickX + this.brickWidth &&
              this.ballY + this.ballSize >= brickY &&
              this.ballY <= brickY + this.brickHeight
            ) {
              // Mark brick for removal
              this.bricksToRemove.add(`${row},${col}`);
              this.ballSpeedY *= -1;
            }
          }
        }
      }
    },
    checkPaddleCollision() {
      // Check for collision with the paddle
      if (
        this.ballX + this.ballSize >= this.paddlePosition &&
        this.ballX <= this.paddlePosition + this.paddleWidth &&
        this.ballY + this.ballSize >= this.canvasHeight - this.paddleHeight - 24
      ) {
        // Reverse vertical velocity to bounce off paddle
        this.ballSpeedY *= -1;
      }
    },
    checkCanvasEdgeCollision() {
      // Check for collisions with canvas edges
      if (this.ballX <= 0 || this.ballX + this.ballSize >= this.canvasWidth) {
        this.ballSpeedX *= -1; // Reverse horizontal velocity
      }
      if (this.ballY <= 0) {
        this.ballSpeedY *= -1; // Reverse vertical velocity
      }
      if (this.ballY + this.ballSize >= this.canvasHeight) this.resetBricks();
    },
    generateBricks() {
      for (let row = 0; row < this.numRows; row++) {
        const rowArray = [];
        for (let col = 0; col < this.numCols; col++) {
          // Generate random boolean value to represent whether the space is filled or not
          if (row === 0) {
            rowArray.push(false); // Top row should not be filled
          } else {
            rowArray.push(Math.random() < 0.5); // Adjust probability as needed for other rows
          }
        }
        this.bricks.push(rowArray);
      }
    },
    gameLoop() {
      if (!this.gamePaused) {
        // Update ball position
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;

        this.checkCanvasEdgeCollision();
        this.checkPaddleCollision();
        this.checkBrickCollisions();
        this.removeBricks();

        // Check if the ball hits the bottom of the screen
        if (this.ballY + this.ballSize >= this.canvasHeight) {
          // Pause the game or implement game over logic
          this.gamePaused = true;
          // Reset ball position and velocities (optional)
          // this.ballX = initialX;
          // this.ballY = initialY;
          // this.ballSpeedX = initialSpeedX;
          // this.ballSpeedY = initialSpeedY;
        }

        // Confine ball within canvas boundaries
        this.ballX = Math.max(0, Math.min(this.canvasWidth - this.ballSize, this.ballX));
        this.ballY = Math.max(0, Math.min(this.canvasHeight - this.ballSize, this.ballY));
      }

      // Request animation frame for the next frame
      requestAnimationFrame(this.gameLoop);
    },
    handleKeyDown(event) {
      if (event.key === ' ') { // Spacebar key
        // Pause/unpause the game
        this.gamePaused = !this.gamePaused;
      } else if (event.key === 'ArrowLeft' && this.paddlePosition > 0) {
        // Move the paddle left
        this.paddlePosition -= 10;
      } else if (event.key === 'ArrowRight' && this.paddlePosition < 370) {
        // Move the paddle right
        this.paddlePosition += 10;
      } else if (event.key === 'r') {
        // Reset the bricks
        this.resetBricks();
      }
    }
  },
}
</script>

<style scoped>
#game-canvas {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(50, 1fr);
  gap: 5px;
  width: 400px;
  height: 600px;
  background-color: #222;
  border: 2px solid #fff;
  position: relative;
}

[id="ball"] {
  background-color: greenyellow;
  width: 2%;
  height: 1.25%;
  border-radius: 50%;
  margin: auto;
  position: absolute;
}

#paddle {
  grid-row: 48/49;
  /* left: 50%; /* Center paddle horizontally */
  /* transform-origin: center; */
  /* grid-column: 6 / 7; */
  /* Adjust to center the paddle */
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
}

.brick-row {
  display: flex;
  flex-direction: row;
  gap: 5px;
  grid-column: 2 / 11;
}

.brick {
  flex: 1;
  height: 100%;
  grid-column: auto;
  grid-row: auto;
  background-color: #f00;
}

.brick-hidden {
  background-color: #222;
  /* Brick color when hidden */
}
</style>
