import express from "express";
import cors from "cors";

const app = express();
const port = 8000;


class Pawn {
  constructor(color, position) {
    this.color = color; 
    this.position = position;
  }
}


class Position{
	constructor(x, y) {
	    this.x = x;
	    this.y = y;
  }
}

const pieces = [
	new Pawn("white", new Position(0,1)),
	new Pawn("white", new Position(1,1)),
	new Pawn("white", new Position(2,1)),
	new Pawn("white", new Position(3,1)),
	new Pawn("white", new Position(4,1)),
	new Pawn("white", new Position(5,1)),
	new Pawn("white", new Position(6,1)),
	new Pawn("white", new Position(7,1)),
	new Pawn("black", new Position(0,1)),
	new Pawn("black", new Position(1,1)),
	new Pawn("black", new Position(2,1)),
	new Pawn("black", new Position(3,1)),
	new Pawn("black", new Position(4,1)),
	new Pawn("black", new Position(5,1)),
	new Pawn("black", new Position(6,1)),
	new Pawn("black", new Position(7,1))
]

const currentPlayer = "white";

const moveHistory = [];


app.use(cors());

app.use(express.json());

app.post("/move", (req, res)) => {
	const { from, to } = req.body;
	
}

app.get('/', (req, res) => {
	res.send("Hello World");
});


app.listen(port, () => {
    console.log(`Local Chess listening at http://localhost:${port}`);
});