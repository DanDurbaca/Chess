"use strict";

class ChessPiece {
  constructor(color, name, board, xPos, yPos) {
    if (isNull(color)) throw "Creating a piece with an invalid color";
    if (!Object.values(PieceColors).includes(color))
      throw "Invalid color received as argument";
    // check piece colors

    if (isNull(name)) throw "Creating a piece with an invalid name";
    if (!Object.values(ChessPieceTypes).includes(name))
      throw "Invalid piece name received as argument";
    // check piece names

    if (isNull(board)) throw "Creating a piece without a board";

    if (isNull(xPos)) throw "Creating a piece without a row position";
    if (xPos < 0 || xPos > BOARD_SIZE) throw "Invalid row number for a piece";

    if (isNull(yPos)) throw "Creating a piece without a column position";
    if (yPos < 0 || yPos > BOARD_SIZE)
      throw "Invalid column number for a piece";

    this.PieceColor = color;
    this.PieceName = name;
    this.Board = board;
    this.RowPos = xPos;
    this.ColPos = yPos;
    this.Board[this.RowPos][this.ColPos] = this;
  }

  getPossibleMovesOfUnknownPiece() {
    // an unknown piece possible movements:
    if (!isNull(this.RowPos) && !isNull(this.ColPos))
      return new Array(this.RowPos, this.ColPos); // only its current location !
    return null;
  }

  movePiece(newRowPos, newColPos, controllerHandler) {
    let fullBoard = this.Board;
    if (!isNull(fullBoard)) {
      if (!isNull(this.RowPos) && !isNull(this.ColPos)) {
        if (!isNull(fullBoard[this.RowPos][this.ColPos]))
          controllerHandler(fullBoard[this.RowPos][this.ColPos]); // remove piece from View
        fullBoard[this.RowPos][this.ColPos] = null; // make previous square empty !
      } else
        console.log("Previously unset coordinates ! Is this a new piece ??");

      if (!isNull(fullBoard[newRowPos][newColPos]))
        // if the target is NON EMPTY
        controllerHandler(fullBoard[newRowPos][newColPos]); // remove piece from View

      fullBoard[newRowPos][newColPos] = this;
    } else console.log("moving piece without any board attached !!!");
    this.RowPos = newRowPos;
    this.ColPos = newColPos;
    Pawn.ghostPawn = null; // reset en passant !
  }

  getImageName() {
    return this.PieceColor + "_" + this.PieceName;
  }

  getPieceCursorUrl() {
    return (
      MOUSE_POINTER_URL_START + this.getImageName() + MOUSE_POINTER_URL_END
    );
  }

  getClassName() {
    return this.PieceColor + this.PieceName;
  }

  getPossibleMoves() {
    console.log("Not implemented  !! Unknown piece ");
  }
}

class Rook extends ChessPiece {
  constructor(xPos, yPos, color, board = null) {
    super(color, ChessPieceTypes.Rook, board, xPos, yPos);
  }
}

class Knight extends ChessPiece {
  constructor(xPos, yPos, color, board = null) {
    super(color, ChessPieceTypes.Knight, board, xPos, yPos);
  }
}

class Bishop extends ChessPiece {
  constructor(xPos, yPos, color, board = null) {
    super(color, ChessPieceTypes.Bishop, board, xPos, yPos);
  }
}

class Queen extends ChessPiece {
  constructor(xPos, yPos, color, board = null) {
    super(color, ChessPieceTypes.Queen, board, xPos, yPos);
  }
}

class King extends ChessPiece {
  constructor(xPos, yPos, color, board = null) {
    super(color, ChessPieceTypes.King, board, xPos, yPos);
  }
}
