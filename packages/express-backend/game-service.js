import mongoose from "mongoose";
import gameModel from "./game.js";

mongoose.set("debug", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/localchess", {
    useUnifiedTopology: true
  })
  .catch((error) => console.log(error));

function createGame(game) {
  const newGame = new gameModel(game);
  const promise = newGame.save();
  return promise;
}

function updateGame(id, move_list) {
  const promise = gameModel.findByIdAndUpdate(
    id,
    { move_list: move_list },
    { new: true }
  );
  return promise;
}

export default {
  createGame,
  updateGame
};
