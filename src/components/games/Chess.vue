<template>
  <div>
    <b-container>
      <b-row class="mt-2">
        <b-col></b-col>
        <b-col>
          <b-container>
            <b-row class="player-info" :class="oppent_info">
              <b-col class="col-nomargin">
                <b-img left class="chess-avatar" :src="oppent_avatar"></b-img>
              </b-col>
              <b-col :class="oppentinfo">{{ `${oppent} ` }}</b-col>
              <b-col :class="oppentinfo">{{ oppent_Elo }}</b-col>
              <b-col :class="oppentClock">{{ oppentTimeClock }}</b-col>
              <!-- <div class="turn-color" :class="game.turn()"></div> -->
            </b-row>
            <b-row>
              <div id="board" class="chess-board"></div>
            </b-row>
            <b-row class="player-info" :class="player_info">
              <b-col class="col-nomargin">
                <b-img left class="chess-avatar" :src="user.avatar"></b-img>
              </b-col>
              <b-col :class="myinfo">{{ `${user.givenName} ` }}</b-col>
              <b-col :class="myinfo">{{ myElo }}</b-col>
              <b-col class="float-left" :class="myClock">
                {{
                myTimeClock
                }}
              </b-col>
            </b-row>
          </b-container>
        </b-col>
        <b-col>
          <b-button @click="register">New Game</b-button>

          <p></p>
          <p class="text-center game-pgn">{{ pgn }}</p>

          <p v-show="gamerResult !== -1">{{ gameResultFormatted }}</p>
          <b-list-group class="mt-3">
            <b-list-group-item
              v-for="player in onlinePlayers"
              :key="player.socketID"
            >{{ player.id }}</b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import io from "socket.io-client";
import { Person, lookupProfile } from "blockstack";
import { Chess } from "../../utils/radiks";
export default {
  name: "Chess",
  beforeDestroy() {
    this.socket.disconnect();
  },
  created() {
    if (this.game == null) {
      this.game = new window.Chess();
    }

    // this.socket = io.connect("https://dappgames.gq:5001");   // dev-
    //this.socket = io.connect("http://localhost:5001"); // dev
    this.socket = io.connect("https://dappgames.gq:5000"); //prod
  },
  computed: {
    /*  onlinePlayers() {
      return this.players.filter(player => {
        return player.id != this.user.username;
      });
    }, */
    gameResultFormatted() {
      let resultFormated = "";

      switch (this.gamerResult) {
        case 0:
          if (this.orientation === "black") {
            resultFormated = `You Won the Game 0-1`;
          } else {
            resultFormated = `${this.blackPlayer} Won the Game 0-1`;
          }

          break;
        case 1:
          if (this.orientation === "white") {
            resultFormated = `You Won the Game 1-0`;
          } else {
            resultFormated = `${this.whitePlayer} Won the Game 1-0`;
          }

          break;
        case 0.5:
          resultFormated = `Game Draw 0.5-0.5`;
          break;
      }

      return resultFormated;
    },

    myTimeClock() {
      let _time = (this.myTime - this.startingTimestamp) / 1000;
      let minutes = parseInt(_time / 60, 10);
      let seconds = parseInt(_time % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return `${minutes}:${seconds}`;
    },
    oppentTimeClock() {
      let _time = (this.oppentTime - this.startingTimestamp) / 1000;
      let minutes = parseInt(_time / 60, 10);
      let seconds = parseInt(_time % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return `${minutes}:${seconds}`;
    },

    position() {
      return;
    },
    user() {
      //to add computed  avatar and name
      let givenName;
      let username;
      let avatar = "https://s3.amazonaws.com/onename/avatar-placeholder.png";
      let User = { givenName, avatar, username };

      if (this.signedIn) {
        User = this.$store.getters.getUser;

        givenName = User.name() ? User.name() : "Nameless ";
        if (User.avatarUrl()) avatar = User.avatarUrl();
        User = { ...User, givenName, avatar };

        return User;
      }
    },
    signedIn() {
      return this.$store.getters.isUserSignedIn;
    },
    elo() {
      return 1000;
    },
    oppent_info() {
      switch (this.orientation) {
        case "white":
          return "b";
          break;
        case "black":
          return "w";
          break;
      }
    },
    oppentClock() {
      switch (this.orientation) {
        case "white":
          return "clock blackclock";
          break;
        case "black":
          return "clock whiteclock";
          break;
      }
    },

    player_info() {
      switch (this.orientation) {
        case "white":
          return "w";
          break;
        case "black":
          return "b";
          break;
      }
    },
    myClock() {
      switch (this.orientation) {
        case "white":
          return "clock whiteclock";
          break;
        case "black":
          return "clock blackclock";
          break;
      }
    },
    oppentinfo() {
      switch (this.orientation) {
        case "white":
          return "player_name blackclock";
          break;
        case "black":
          return "player_name whiteclock";
          break;
      }
    },
    myinfo() {
      switch (this.orientation) {
        case "white":
          return "player_name whiteclock";
          break;
        case "black":
          return "player_name blackclock";
          break;
      }
    },

    currntplayer() {
      return this.game.turn();
    }
  },
  mounted() {
    this.startingTimestamp = new Date().getTime();
    this.myTime = this.startingTimestamp + this.timeLength;
    this.oppentTime = this.startingTimestamp + this.timeLength;

    this.socket.on("disconnect", () => {});

    this.socket.on("players", data => {
      this.players = data.players;
    });
    this.socket.on("winByDisconnect", data => {
      console.log("disconnect", data);
      this.gamerResult = data.game.result;
      this.stopOppentTimeTicker();

      this.stopMyTimeTicker();
    });
    this.socket.on("postion", async data => {
      let _oppent;
      this.startingTimestamp = data.game.startTimeStamp;
      this.whitePlayer = data.game.whitePlayer;
      this.blackPlayer = data.game.blackPlayer;
      if (data.game.blackPlayer === this.user.username) {
        this.orientation = "black";
        this.board.orientation(this.orientation);
        this.myTime = data.game.blackTime;
        this.oppentTime = data.game.whiteTime;
        _oppent = data.game.whitePlayer;
      } else {
        this.orientation = "white";
        this.board.orientation(this.orientation);
        this.myTime = data.game.whiteTime;
        this.oppentTime = data.game.blackTime;
        _oppent = data.game.blackPlayer;
      }

      this.oppent = _oppent;
      let profile = await lookupProfile(this.oppent);
      let tmpoppent = new Person(profile);

      let Elo = 1200;

      let notExist = await Chess.fetchList({
        Blockstack_id: this.oppent
      });

      if (notExist.length > 0) {
        Elo = notExist[0].attrs.Elo;
      }

      this.oppent_Elo = Elo;
      this.oppent_avatar = tmpoppent.avatarUrl()
        ? tmpoppent.avatarUrl()
        : "https://s3.amazonaws.com/onename/avatar-placeholder.png";
      Elo = 1200;
      notExist = await Chess.fetchList({
        Blockstack_id: this.user.username
      });

      if (notExist.length > 0) {
        Elo = notExist[0].attrs.Elo;
      }
      this.myElo = Elo;
      this.game = new window.Chess(data.game.fen);
      this.board.position(data.game.fen);
      this.pgn = data.game.pgn;
      this.gamerResult = data.game.result;
      console.log(this.gamerResult);
      if (this.gamerResult === -1) {
        if (this.orientation[0] === this.game.turn()) {
          this.stopOppentTimeTicker();
          this.startMyTimeTicker();
        } else {
          this.stopMyTimeTicker();
          this.startOppentTimeTicker();
        }
      } else {
        this.stopOppentTimeTicker();
        this.stopMyTimeTicker();
        // add reset game
      }
    });

    const config = {
      draggable: true,
      showNotation: true,
      position: "start",
      onDragStart: this.onDragStart,
      onDrop: this.onDrop,
      onSnapEnd: this.onSnapEnd
    };
    let board;

    if (window.ChessBoard !== null) {
      this.board = window.ChessBoard("board", config);
      this.board.orientation(this.orientation);
    }

    // this.board = board;
  },

  methods: {
    moveinvalid() {},
    move() {
      this.board.orientation(this.orientation);
    },
    resetGame() {},
    newGame() {
      this.socket.emit("newGame");
    },
    resigen() {},
    makeMove() {},
    register() {
      this.socket.emit("register", { id: this.user.username, elo: this.elo });
      this.socket.emit("playNow");
    },

    onDragStart(source, piece, position, orientation) {
      // do not pick up pieces if the game is over
      if (this.game.game_over() || this.gamerResult > -1) return false;
      // game.turn() !== playerColor[0];
      //only pick up pieces for the side to move
      if (
        (this.game.turn() === "w" && piece.search(/^b/) !== -1) ||
        (this.game.turn() === "b" && piece.search(/^w/) !== -1) ||
        this.game.turn() !== this.orientation[0]
      ) {
        return false;
      }
    },
    Promot_click(event) {},
    onDrop(source, target) {
      // see if the move is legal
      var move = this.game.move({
        from: source,
        to: target,
        promotion: this.promotion //"q" // NOTE: always promote to a queen for example simplicity
      });

      // illegal move
      if (move === null) return "snapback";
      this.socket.emit("move", {
        gameid: "",
        move: {
          from: source,
          to: target,
          promotion: "q" // NOTE: always promote to a queen for example simplicity
        }
      });
      if (this.currntplayer === this.orientation[0]) {
        this.stopOppentTimeTicker();
        this.startMyTimeTicker();
      } else {
        this.stopMyTimeTicker();
        this.startOppentTimeTicker();
      }
      this.updateStatus();
    },

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    onSnapEnd() {
      this.board.position(this.game.fen());
    },

    updateStatus() {
      var status = "";

      var moveColor = "White";
      if (this.game.turn() === "b") {
        moveColor = "Black";
      }

      // checkmate?
      if (this.game.in_checkmate()) {
        status = "Game over, " + moveColor + " is in checkmate.";
      }

      // draw?
      else if (this.game.in_draw()) {
        status = "Game over, drawn position";
      }

      // game still on
      else {
        status = moveColor + " to move";

        // check?
        if (this.game.in_check()) {
          status += ", " + moveColor + " is in check";
        }
        this.status = status;
      }
    },
    startMyTimeTicker() {
      if (!this.myTimeOn) {
        this.myTimeOn = true;

        this.myTimeTicker = setInterval(() => {
          this.myTime = this.myTime - 1000;

          if (this.myTime <= this.startingTimestamp) {
            this.myTime = this.startingTimestamp;
            this.stopMyTimeTicker();
          }
        }, 1000);
      }
    },
    stopMyTimeTicker() {
      window.clearInterval(this.myTimeTicker);
      this.myTimeOn = false;
    },
    startOppentTimeTicker() {
      if (!this.oppentTimeOn) {
        this.oppentTimeOn = true;
        this.oppentTimeTicker = setInterval(() => {
          this.oppentTime = this.oppentTime - 1000;
          if (this.oppentTime <= this.startingTimestamp) {
            this.oppentTime = this.startingTimestamp;
            this.stopOppentTimeTicker();
          }
        }, 1000);
      }
    },
    stopOppentTimeTicker() {
      window.clearInterval(this.oppentTimeTicker);
      this.oppentTimeOn = false;
    }
  },

  data() {
    return {
      ChessBoard: null,
      startingTimestamp: null,
      myTimeOn: false,
      oppentTimeOn: false,
      timeLength: 3 * 60 * 1000,
      myTime: null,
      oppentTime: null,
      myTimeTicker: null,
      oppentTimeTicker: null,
      whitePlayer: "",
      blackPlayer: "",
      oppent: "oppent",
      oppent_avatar: "https://s3.amazonaws.com/onename/avatar-placeholder.png",
      oppent_Elo: 1200,
      myElo: 1200,

      game: null,
      board: null,
      orientation: "white",
      status: "",
      queen: "./img/chesspieces/wikipedia/wQ.png",
      rook: "./img/chesspieces/wikipedia/wR.png",
      bishop: "./img/chesspieces/wikipedia/wB.png",
      knight: "./img/chesspieces/wikipedia/wN.png",
      promotion: "q",
      clock: 1000 * 60 * 3,
      socket: {},
      players: [],
      pgn: "",
      gamerResult: -1
    };
  }
};
</script>
