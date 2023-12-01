import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    player1: {
      type: String,
      required: true,
      trim: true
    },
    player2: {
      type: String,
      required: true,
      trim: true
    },
    move_list: {
      type: [],
      required: true,
      trim: true
    },
    winner: {
      type: String,
      required: true,
      trim: true
    }
  },
  { collection: "games" }
);

const Game = mongoose.model("Game", GameSchema);

export default Game;
