import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const _sfc_main = {
  name: "GameLayout",
  data() {
    return {
      bricks: [],
      // Array to store breakable bricks
      numRows: 20,
      numCols: 9,
      paddlePosition: 180,
      ballX: 195,
      // Initial X position of the ball
      ballY: 400,
      // Initial Y position of the ball
      ballSpeedX: (Math.random() < 0.5 ? 1 : -1) * (Math.random() + 0.5),
      // Random angle adjustment
      ballSpeedY: 0.75,
      // Vertical velocity of the ball
      canvasWidth: 400,
      // Width of the game canvas
      canvasHeight: 600,
      // Height of the game canvas
      ballSize: 8,
      // Size of the ball
      paddleWidth: 31.81,
      // Width of the paddle
      paddleHeight: 7.1,
      // Height of the paddle
      gamePaused: false,
      // Flag to track the game's pause state
      brickWidth: 31.82,
      brickHeight: 7.09,
      bricksToRemove: /* @__PURE__ */ new Set()
      // Set to store positions of bricks to remove
    };
  },
  mounted() {
    this.generateBricks();
    this.gameLoop();
  },
  beforeDestroy() {
  },
  methods: {
    resetBricks() {
      this.bricks = [];
      this.paddlePosition = 180;
      this.ballX = 195;
      this.ballY = 400;
      this.ballSpeedX = (Math.random() < 0.5 ? 1 : -1) * (Math.random() + 0.5);
      this.ballSpeedY = 0.75;
      this.generateBricks();
    },
    removeBricks() {
      this.bricksToRemove.forEach((pos) => {
        const [row, col] = pos.split(",").map(Number);
        this.bricks[row][col] = false;
      });
      this.bricksToRemove.clear();
    },
    checkBrickCollisions() {
      for (let row = 0; row < this.numRows; row++) {
        for (let col = 0; col < this.numCols; col++) {
          if (this.bricks[row][col]) {
            const brickX = col * this.brickWidth + col * 5 + this.brickWidth;
            const brickY = row * this.brickHeight + row * 5;
            if (this.ballX + this.ballSize >= brickX && this.ballX <= brickX + this.brickWidth && this.ballY + this.ballSize >= brickY && this.ballY <= brickY + this.brickHeight) {
              this.bricksToRemove.add(`${row},${col}`);
              this.ballSpeedY *= -1;
            }
          }
        }
      }
    },
    checkPaddleCollision() {
      if (this.ballX + this.ballSize >= this.paddlePosition && this.ballX <= this.paddlePosition + this.paddleWidth && this.ballY + this.ballSize >= this.canvasHeight - this.paddleHeight - 24) {
        this.ballSpeedY *= -1;
      }
    },
    checkCanvasEdgeCollision() {
      if (this.ballX <= 0 || this.ballX + this.ballSize >= this.canvasWidth) {
        this.ballSpeedX *= -1;
      }
      if (this.ballY <= 0) {
        this.ballSpeedY *= -1;
      }
      if (this.ballY + this.ballSize >= this.canvasHeight)
        this.resetBricks();
    },
    generateBricks() {
      for (let row = 0; row < this.numRows; row++) {
        const rowArray = [];
        for (let col = 0; col < this.numCols; col++) {
          if (row === 0) {
            rowArray.push(false);
          } else {
            rowArray.push(Math.random() < 0.5);
          }
        }
        this.bricks.push(rowArray);
      }
    },
    gameLoop() {
      if (!this.gamePaused) {
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;
        this.checkCanvasEdgeCollision();
        this.checkPaddleCollision();
        this.checkBrickCollisions();
        this.removeBricks();
        if (this.ballY + this.ballSize >= this.canvasHeight) {
          this.gamePaused = true;
        }
        this.ballX = Math.max(0, Math.min(this.canvasWidth - this.ballSize, this.ballX));
        this.ballY = Math.max(0, Math.min(this.canvasHeight - this.ballSize, this.ballY));
      }
      requestAnimationFrame(this.gameLoop);
    },
    handleKeyDown(event) {
      if (event.key === " ") {
        this.gamePaused = !this.gamePaused;
      } else if (event.key === "ArrowLeft" && this.paddlePosition > 0) {
        this.paddlePosition -= 10;
      } else if (event.key === "ArrowRight" && this.paddlePosition < 370) {
        this.paddlePosition += 10;
      } else if (event.key === "r") {
        this.resetBricks();
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "game-canvas",
    tabindex: "0"
  }, _attrs))} data-v-c38e1aef><div id="paddle" style="${ssrRenderStyle({ transform: "translateX(" + $data.paddlePosition + "px)" })}" data-v-c38e1aef></div><div id="ball" style="${ssrRenderStyle({ transform: "translate(" + $data.ballX + "px, " + $data.ballY + "px)" })}" data-v-c38e1aef></div><!--[-->`);
  ssrRenderList($data.bricks, (row, rowIndex) => {
    _push(`<div class="brick-row" data-v-c38e1aef><!--[-->`);
    ssrRenderList(row, (brick, brickIndex) => {
      _push(`<div class="${ssrRenderClass({ "brick": true, "brick-hidden": !brick })}" data-v-c38e1aef></div>`);
    });
    _push(`<!--]--></div>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GameLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c38e1aef"]]);
export {
  __nuxt_component_0 as _
};
//# sourceMappingURL=GameLayout-YG_Yjapw.js.map
