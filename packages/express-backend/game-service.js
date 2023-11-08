import mongoose from "mongoose";
import gameModel from "./game.js";

mongoose.set("debug", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/users", {
    useUnifiedTopology: true
  })
  .catch((error) => console.log(error));
