"use strict";
// constants are here !!

const PieceColors = {
  White: "white",
  Black: "black"
};

const ChessPieceTypes = {
  Pawn: "Pawn",
  Rook: "Rook",
  Knight: "Knight",
  Bishop: "Bishop",
  Queen: "Queen",
  King: "King"
};

const WHITE_PROMOTABLES = [
  "whiteQueen",
  "whiteRook",
  "whiteBishop",
  "whiteKnight"
];

const BLACK_PROMOTABLES = [
  "blackQueen",
  "blackRook",
  "blackBishop",
  "blackKnight"
];

class ChessPiece {
  constructor(color, name = null, board = null) {
    this.PieceColor = color;
    this.PieceName = name;
    this.Board = board;
    this.RowPos = null;
    this.ColPos = null;
  }

  getPossibleMovesOfUnknownPiece() {
    // an unknown piece possible movements:
    if (!isNull(this.RowPos) && !isNull(this.ColPos))
      return new Array(this.RowPos, this.ColPos); // only its current location !
    return null;
  }

  movePiece(newRowPos, newColPos, controllerHandler) {
    if (!isNull(this.Board)) {
      if (!isNull(this.RowPos) && !isNull(this.ColPos)) {
        if (!isNull(this.Board[this.RowPos][this.ColPos]))
          controllerHandler(this.Board[this.RowPos][this.ColPos]); // remove piece from View
        this.Board[this.RowPos][this.ColPos] = null; // make previous square empty !
      } else
        console.log("Previously unset coordinates ! Is this a new piece ??");

      if (!isNull(this.Board[newRowPos][newColPos]))
        // if the target is NON EMPTY
        controllerHandler(this.Board[newRowPos][newColPos]); // remove piece from View

      this.Board[newRowPos][newColPos] = this;
    } else console.log("moving piece without any board attached !!!");
    this.RowPos = newRowPos;
    this.ColPos = newColPos;
    Pawn.ghostPawn = null;
  }

  getImageName() {
    return this.PieceColor + "_" + this.PieceName;
  }

  getPieceCursorUrl() {
    return "url('./img/cursor-" + this.getImageName() + ".png'), auto";
  }

  getClassName() {
    return this.PieceColor + this.PieceName;
  }

  getPossibleMoves() {
    console.log("Not implemented  !! Unknown piece ");
  }
}

class Rook extends ChessPiece {
  constructor(color, board = null) {
    super(color, ChessPieceTypes.Rook, board);
  }
}
class Knight extends ChessPiece {
  constructor(color, board = null) {
    super(color, ChessPieceTypes.Knight, board);
  }
}
class Bishop extends ChessPiece {
  constructor(color, board = null) {
    super(color, ChessPieceTypes.Bishop, board);
  }
}

class Queen extends ChessPiece {
  constructor(color, board = null) {
    super(color, ChessPieceTypes.Queen, board);
  }
}
class King extends ChessPiece {
  constructor(color, board = null) {
    super(color, ChessPieceTypes.King, board);
  }
}
