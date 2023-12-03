import mongoose from "mongoose";
import gameModel from "./game.js";

mongoose.set("debug", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/localchess", {
    useUnifiedTopology: true
  })
  .catch((error) => console.log(error));

// takes in game which is a dictionary with the form 
// specified in game.js and inserts it into the games
// table in the localchess database
function createGame(game) {
  const game = new gameModel(game);
  const promise = game.save();
  return promise;
}

// takes in an id and a move_list 
// move_list is a list of [fromsquare, tosquare] arrays
// looks up the game in games table by id and updates
// its move_list to the move_list provided
function updateGame(id, newMoveList) {
  const promise = gameModel.findByIdAndUpdate(
    id,
    { move_list: newMoveList },
  );
  return promise;
}

export default {
  createGame,
  updateGame
};
