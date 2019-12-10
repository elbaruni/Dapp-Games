<template>
  <div>
    <b-container>
      <b-row>
        <b-col> </b-col>
        <b-col>
          <h2 class="text-white">Chess</h2>
          <div id="board" class="chess-board"></div
        ></b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  name: "Chess",
  created() {
    console.log("created");
    if (this.game == null) {
      this.game = new window.Chess();
    }
  },
  computed: {
    position() {
      return;
    }
  },
  mounted() {
    console.log("mounted");
    const config = {
      draggable: true,
      position: "start",
      onDragStart: this.onDragStart,
      onDrop: this.onDrop,
      onSnapEnd: this.onSnapEnd,
      showNotation: true
      // onDragStart: this.onDragStart.bind(this),
      // onDrop: this.onDrop.bind(this),
      // onSnapEnd: this.onSnapEnd.bind(this)
    };
    let board;
    console.log("board0", this.board);
    console.log("board0000", window.ChessBoard);
    if (window.ChessBoard !== null) {
      board = window.ChessBoard("board", config);
      board.orientation(this.orientation);
    }
    console.log("board1", board);

    this.board = board;
    console.log("board1", this.board);
    // console.log("game2", this.game);
  },
  methods: {
    onDragStart(source, piece, position, orientation) {
      // do not pick up pieces if the game is over

      if (this.game.game_over()) return false;

      // only pick up pieces for the side to move
      if (
        (this.game.turn() === "w" && piece.search(/^b/) !== -1) ||
        (this.game.turn() === "b" && piece.search(/^w/) !== -1)
      ) {
        return false;
      }
    },
    Promot_click(event) {
      console.log("clicked", event.target);
    },
    onDrop(source, target) {
      // see if the move is legal
      var move = this.game.move({
        from: source,
        to: target,
        promotion: this.promotion //"q" // NOTE: always promote to a queen for example simplicity
      });

      // illegal move
      if (move === null) return "snapback";

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
    }
  },

  data() {
    return {
      ChessBoard: null,
      game: null,
      board: null,
      orientation: "black",
      status: "",
      queen: "./img/chesspieces/wikipedia/wQ.png",
      rook: "./img/chesspieces/wikipedia/wR.png",
      bishop: "./img/chesspieces/wikipedia/wB.png",
      knight: "./img/chesspieces/wikipedia/wN.png",
      promotion: "q"
    };
  }
};
</script>
