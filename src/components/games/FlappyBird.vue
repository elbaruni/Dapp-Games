<template>
  <div>
    <b-container fluid>
      <p>{{level}} {{Score}}</p>
      <b-row no-gutters>
        <b-col>
          <b-container fluid>
            <b-row no-gutters>
              <b-col md="12">
                <b-form-group no-gutters>
                  <b-form-radio-group buttons v-model="level">
                    <b-form-radio
                      v-model="level"
                      name="some-radios"
                      :disabled="disable_level"
                      button-variant="success"
                      value="0"
                    >Easy</b-form-radio>
                    <b-form-radio
                      v-model="level"
                      name="some-radios"
                      :disabled="disable_level"
                      button-variant="primary"
                      value="1"
                    >Normal</b-form-radio>
                    <b-form-radio
                      v-model="level"
                      name="some-radios"
                      :disabled="disable_level"
                      button-variant="danger"
                      value="2"
                    >Hard</b-form-radio>
                  </b-form-radio-group>
                </b-form-group>
                <b-list-group no-gutters>
                  <b-list-group-item>{{`Easy Mode Best Score ${ScoreEasy}`}}</b-list-group-item>
                  <b-list-group-item>{{`Normal Mode Best Score ${ScoreNormal}`}}</b-list-group-item>
                  <b-list-group-item>{{`Hard Mode Best Score ${ScoreHard}`}}</b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
        <b-col>
          <canvas ref="canvas" id="canvas" width="420" height="600"></canvas>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import sprite from "../../assets/img/sprite.png";
import sfx_point from "../../assets/audio/sfx_point.wav";
import sfx_flap from "../../assets/audio/sfx_flap.wav";
import sfx_hit from "../../assets/audio/sfx_hit.wav";
import sfx_swooshing from "../../assets/audio/sfx_swooshing.wav";
import sfx_die from "../../assets/audio/sfx_die.wav";
// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = sfx_point;
const FLAP = new Audio();
FLAP.src = sfx_flap;
const HIT = new Audio();
HIT.src = sfx_hit;
const SWOOSHING = new Audio();
SWOOSHING.src = sfx_swooshing;
const DIE = new Audio();
DIE.src = sfx_die;
// GAME STATE
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2
}; // START BUTTON COORD
const startBtn = {
  x: 170,
  y: 263,
  w: 83,
  h: 29
};
// CONTR
export default {
  name: "FlappyBird",
  data() {
    return {
      canvas: null,
      context: null,
      frames: 0,
      DEGREE: Math.PI / 180,
      currentScore: 0,
      level: "1",
      disable_level: false,
      gameState: 0,
      selected: "1",
      options: [
        { text: "Radio 1", value: "1" },
        { text: "Radio 3", value: "2" },
        { text: "Radio 4", value: "3" }
      ],
      bird: {
        x: 50,
        y: 240,
        w: 34,
        h: 26,
        radius: 12,
        frame: 0,
        gravity: 0.25,
        jump: 4.6,
        speed: 0,
        rotation: 0
      },
      requestAnimationFrameid: undefined
    };
  },
  computed: {
    Score() {
      return parseInt(
        this.$store.getters.flappBirdScoreLevel(parseInt(this.level)) || 0
      );
    },
    ScoreEasy() {
      return parseInt(this.$store.getters.flappBirdScore[0] || 0);
    },
    ScoreNormal() {
      return parseInt(this.$store.getters.flappBirdScore[1] || 0);
    },
    ScoreHard() {
      return parseInt(this.$store.getters.flappBirdScore[2] || 0);
    },
    user() {
      //to add computed  avatar and name

      return this.$store.getters.getUser;
    },
    gap() {
      let Gap;

      switch (parseInt(this.level)) {
        case 0:
          Gap = 140;

          return 140;
          break;
        case 1:
          Gap = 105;

          return 105;
          break;
        case 2:
          Gap = 90;

          return 90;
          break;
        default:
          Gap = 105;
      }
    }
  },
  created() {
    state.current = 0;
  },
  destroyed() {
    cancelAnimationFrame(this.requestAnimationFrameid);
    this.requestAnimationFrameid = undefined;
  },
  mounted() {
    var vm = this;
    vm.canvas = vm.$refs.canvas;
    vm.context = vm.canvas.getContext("2d");
    let Sprite = new Image();

    state.current = 0;
    const md_gl = {
      sX: 312,
      sY: 159,
      w: 43,
      h: 43,
      x: 122,
      y: 177,

      draw: function() {
        vm.context.drawImage(
          Sprite,
          this.sX,
          this.sY,
          this.w,
          this.h,
          this.x,
          this.y,
          this.w,
          this.h
        );
      }
    };

    // Medal bronze
    const md_br = {
      sX: 360,
      sY: 159,
      w: 43,
      h: 43,
      x: 122,
      y: 177,

      draw: function() {
        vm.context.drawImage(
          Sprite,
          this.sX,
          this.sY,
          this.w,
          this.h,
          this.x,
          this.y,
          this.w,
          this.h
        );
      }
    };
    // Medal silver
    const md_sl = {
      sX: 360,
      sY: 112,
      w: 43,
      h: 43,
      x: 122,
      y: 177,

      draw: function() {
        vm.context.drawImage(
          Sprite,
          this.sX,
          this.sY,
          this.w,
          this.h,
          this.x,
          this.y,
          this.w,
          this.h
        );
      }
    };

    // Medal platinum
    const md_pl = {
      sX: 312,
      sY: 112,
      w: 43,
      h: 43,
      x: 122,
      y: 177,

      draw: function() {
        vm.context.drawImage(
          Sprite,
          this.sX,
          this.sY,
          this.w,
          this.h,
          this.x,
          this.y,
          this.w,
          this.h
        );
      }
    };

    // BACKGROUND
    const bg = {
      sX: 0,
      sY: 0,
      w: 275,
      h: 226,
      x: 0,
      y: vm.canvas.height - 226,

      draw: function() {
        vm.context.drawImage(
          Sprite,
          this.sX,
          this.sY,
          this.w,
          this.h,
          this.x,
          this.y,
          this.w,
          this.h
        );

        vm.context.drawImage(
          Sprite,
          this.sX,
          this.sY,
          this.w,
          this.h,
          this.x + this.w,
          this.y,
          this.w,
          this.h
        );
      }
    };

    // FOREGROUND
    const fg = {
      sX: 276,
      sY: 0,
      w: 224,
      h: 112,
      x: 0,
      y: vm.canvas.height - 112,

      dx: 2,

      draw: function() {
        vm.context.drawImage(
          Sprite,
          this.sX,
          this.sY,
          this.w,
          this.h,
          this.x,
          this.y,
          this.w,
          this.h
        );

        vm.context.drawImage(
          Sprite,
          this.sX,
          this.sY,
          this.w,
          this.h,
          this.x + this.w,
          this.y,
          this.w,
          this.h
        );

        vm.context.drawImage(
          Sprite,
          this.sX,
          this.sY,
          this.w,
          this.h,
          this.x + this.w + this.w,
          this.y,
          this.w,
          this.h
        );
      },

      update: function() {
        if (state.current == state.game) {
          this.x = (this.x - this.dx) % (this.w / 2);
        }
      }
    };
    // Bird

    const bird = {
      animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 }
      ],
      x: vm.bird.x,
      y: vm.bird.y,
      w: vm.bird.w,
      h: vm.bird.h,

      radius: vm.bird.radius,

      frame: vm.bird.frame,

      gravity: vm.bird.gravity,
      jump: vm.bird.jump,
      speed: vm.bird.speed,
      rotation: vm.bird.rotation,

      draw: function() {
        let bird = this.animation[this.frame];

        vm.context.save();
        vm.context.translate(this.x, this.y);
        vm.context.rotate(this.rotation);
        vm.context.drawImage(
          Sprite,
          bird.sX,
          bird.sY,
          this.w,
          this.h,
          -this.w / 2,
          -this.h / 2,
          this.w,
          this.h
        );

        vm.context.restore();
      },

      flap: function() {
        this.speed = -this.jump;
      },

      update: function() {
        // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += vm.frames % this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
          this.y = 240; // RESET POSITION OF THE BIRD AFTER GAME OVER
          this.rotation = 0 * this.DEGREE;
        } else {
          this.speed += this.gravity;
          this.y += this.speed;

          if (this.y + this.h / 2 >= vm.canvas.height - fg.h) {
            this.y = vm.canvas.height - fg.h - this.h / 2;

            if (state.current == state.game) {
              state.current = state.over;
              DIE.play();
              vm.setScore(score.value);
            }
          }

          // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE BIRD IS FALLING DOWN
          if (this.speed >= this.jump) {
            this.rotation = 90 * this.DEGREE;
            this.frame = 1;
          } else {
            this.rotation = -25 * this.DEGREE;
          }
        }
      },
      speedReset: function() {
        this.speed = 0;
        this.x = vm.bird.x;
        this.y = vm.bird.y;
        this.w = vm.bird.w;
        this.h = vm.bird.h;

        this.radius = vm.bird.radius;

        this.frame = vm.bird.frame;

        this.gravity = vm.bird.gravity;
        this.jump = vm.bird.jump;
        this.speed = vm.bird.speed;
        this.rotation = vm.bird.rotation;
      }
    };
    // GET READY MESSAGE
    const getReady = {
      sX: 0,
      sY: 228,
      w: 173,
      h: 152,
      x: vm.canvas.width / 2 - 173 / 2,
      y: 80,

      draw: function() {
        if (state.current == state.getReady) {
          vm.context.drawImage(
            Sprite,
            this.sX,
            this.sY,
            this.w,
            this.h,
            this.x,
            this.y,
            this.w,
            this.h
          );
        }
      }
    };
    const gameOver = {
      sX: 175,
      sY: 228,
      w: 225,
      h: 202,
      x: vm.canvas.width / 2 - 225 / 2,
      y: 90,

      draw: function() {
        //to return here
        if (state.current == state.over) {
          if (vm.Score < 10) {
            //no medal
            vm.context.drawImage(
              Sprite,
              this.sX,
              this.sY,
              this.w,
              this.h,
              this.x,
              this.y,
              this.w,
              this.h
            );
          } else if (vm.Score >= 10 && vm.Score < 20) {
            // bronze
            vm.context.drawImage(
              Sprite,
              this.sX,
              this.sY,
              this.w,
              this.h,
              this.x,
              this.y,
              this.w,
              this.h
            );
            md_br.draw();
          } else if (vm.Score >= 20 && vm.Score < 30) {
            //silver
            vm.context.drawImage(
              Sprite,
              this.sX,
              this.sY,
              this.w,
              this.h,
              this.x,
              this.y,
              this.w,
              this.h
            );
            md_sl.draw();
          } else if (vm.Score >= 30 && vm.Score < 40) {
            //gold
            vm.context.drawImage(
              Sprite,
              this.sX,
              this.sY,
              this.w,
              this.h,
              this.x,
              this.y,
              this.w,
              this.h
            );
            md_gl.draw();
          } else if (vm.Score >= 40) {
            //platinum
            vm.context.drawImage(
              Sprite,
              this.sX,
              this.sY,
              this.w,
              this.h,
              this.x,
              this.y,
              this.w,
              this.h
            );
            md_pl.draw();
          }
        }
        //to return here
      }
    };

    // PIPES

    const pipes = {
      position: [],
      top: {
        sX: 553,
        sY: 0
      },
      bottom: {
        sX: 502,
        sY: 0
      },

      w: 53,
      h: 400,
      gap: vm.gap,
      maxYPos: -150,
      dx: 2,

      draw: function() {
        for (let i = 0; i < this.position.length; i++) {
          let p = this.position[i];

          let topYPos = p.y;
          let bottomYPos = p.y + this.h + vm.gap;

          // top pipe
          vm.context.drawImage(
            Sprite,
            this.top.sX,
            this.top.sY,
            this.w,
            this.h,
            p.x,
            topYPos,
            this.w,
            this.h
          );

          // bottom pipe
          vm.context.drawImage(
            Sprite,

            this.bottom.sX,
            this.bottom.sY,
            this.w,
            this.h,
            p.x,
            bottomYPos,
            this.w,
            this.h
          );
        }
      },

      update: function() {
        if (state.current !== state.game) return;

        if (vm.frames % 100 == 0) {
          this.position.push({
            x: vm.canvas.width,
            y: this.maxYPos * (Math.random() + 1)
          });
        }

        for (let i = 0; i < this.position.length; i++) {
          let p = this.position[i];

          let bottomPipeYPos = p.y + this.h + vm.gap;

          // COLLISION DETECTION
          // TOP PIPE
          if (
            bird.x + bird.radius > p.x &&
            bird.x - bird.radius < p.x + this.w &&
            bird.y + bird.radius > p.y &&
            bird.y - bird.radius < p.y + this.h
          ) {
            state.current = state.over;
            HIT.play();
            vm.setScore(score.value);
          }
          // BOTTOM PIPE
          if (
            bird.x + bird.radius > p.x &&
            bird.x - bird.radius < p.x + this.w &&
            bird.y + bird.radius > bottomPipeYPos &&
            bird.y - bird.radius < bottomPipeYPos + this.h
          ) {
            state.current = state.over;
            HIT.play();
            console.log("here0");
            vm.setScore(score.value);
          }

          // MOVE THE PIPES TO THE LEFT
          p.x -= this.dx;

          // if the pipes go beyond canvas, we delete them from the array
          if (p.x + this.w <= 0) {
            this.position.shift();
            score.value += 1;
            SCORE_S.play();
            // score.best = Math.max(score.value, score.best);
            //to use acctions/imutation to set new score
            // localStorage.setItem("best", score.best);
            // vm.Score = score.best;
          }
        }
      },

      reset: function() {
        this.position = [];
      }
    };

    // SCORE
    const score = {
      value: 0,

      draw: function() {
        vm.context.fillStyle = "#FFF";
        vm.context.strokeStyle = "#000";

        if (state.current == state.game) {
          vm.context.lineWidth = 2;
          vm.context.font = "35px Teko";
          vm.context.fillText(this.value, vm.canvas.width / 2, 50);
          vm.context.strokeText(this.value, vm.canvas.width / 2, 50);
          vm.disable_level = true;
        } else if (state.current == state.over) {
          // SCORE VALUE
          vm.context.font = "25px Teko";
          vm.context.fillText(this.value, 225, 186);
          vm.context.strokeText(this.value, 225, 186);
          // BEST SCORE
          //console.log("waaaaaaaaaaaaak", vm.Score[parseInt(vm.level)]);
          vm.context.fillText(vm.Score, 225, 228);
          vm.context.strokeText(vm.Score, 225, 228);
          vm.disable_level = false;
        }
      },

      reset: function() {
        this.value = 0;
      }
    };
    function draw() {
      vm.context.fillStyle = "#70c5ce";
      vm.context.fillRect(0, 0, vm.canvas.width, vm.canvas.height);

      bg.draw();
      pipes.draw();
      fg.draw();
      bird.draw();
      getReady.draw();
      gameOver.draw();
      score.draw();
    }

    // CONTROL THE GAME
    vm.canvas.addEventListener("click", function(evt) {
      switch (state.current) {
        case state.getReady:
          state.current = state.game;
          SWOOSHING.play();
          break;
        case state.game:
          if (bird.y - bird.radius <= 0) return;

          bird.flap();
          FLAP.play();
          break;
        case state.over:
          let rect = vm.canvas.getBoundingClientRect();
          let clickX = evt.clientX - rect.left;
          let clickY = evt.clientY - rect.top;

          // CHECK IF WE CLICK ON THE START BUTTON
          if (
            clickX >= startBtn.x &&
            clickX <= startBtn.x + startBtn.w &&
            clickY >= startBtn.y &&
            clickY <= startBtn.y + startBtn.h
          ) {
            pipes.reset();
            bird.speedReset();
            score.reset();
            state.current = state.getReady;
          }
          break;
      }
    });

    // Medal gold

    // UPDATE
    function update() {
      bird.update();
      fg.update();
      pipes.update();
    }

    // LOOP
    function loop() {
      update();
      draw();
      vm.frames++;
      vm.requestAnimationFrameid = undefined;
      if (!vm.requestAnimationFrameid) {
        vm.requestAnimationFrameid = requestAnimationFrame(loop);
      }
    }

    loop();

    Sprite.src = sprite;
  },
  methods: {
    resetCanvas() {
      var vm = this;
      vm.canvas.width = vm.canvas.width;
      vm.points.length = 0; // reset points array
    },
    async setScore(_score) {
      console.log("here1", this.level, this.Score);
      console.log(_score);
      //_score = Math.max(_score, this.Score);
      console.log(_score);
      if (_score > this.Score) {
        await this.$store.dispatch("SetFlappyBirdScore", {
          score: _score,
          Blockstack_id: this.user.username,
          level: this.level
        });
      }
    }
  }
};
</script>
