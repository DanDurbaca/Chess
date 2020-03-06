"use strict";

class Pawn extends ChessPiece {
  constructor(xPos, yPos, color, board) {
    super(color, ChessPieceTypes.Pawn, board, xPos, yPos);
  }

  static ghostPawn = null;
  static ghostPawnColor = null;

  getMoveNotation(whereX, whereY) {
    let strRetVal = "";
    if (
      !isNull(whereX) &&
      !isNull(whereY) &&
      !isNull(this.RowPos) &&
      !isNull(this.ColPos)
    ) {
      if (whereY != this.ColPos)
        strRetVal += getColumnName(this.ColPos) + TAKES_STRING;
      strRetVal += getColumnName(whereY) + getRowName(whereX);
    }
    return strRetVal;
  }

  movePiece(whereX, whereY, controllerHandler) {
    let fullBoard = this.Board;
    let strRetVal = this.getMoveNotation(whereX, whereY);
    // is this pawn advancing two rows ? - if so - set the flag ghostPawn !
    let oldRow = this.RowPos;
    let oldCol = this.ColPos;
    let oldGhost = null;
    if (!!Pawn.ghostPawn) {
      oldGhost = [...Pawn.ghostPawn]; // what is ...
      // - check :https://medium.com/@oprearocks/what-do-the-three-dots-mean-in-javascript-bc5749439c9a
    }

    super.movePiece(whereX, whereY, controllerHandler);

    let targetPos = new Array(whereX, whereY);
    if (
      !isNull(oldGhost) &&
      ChessModel.arePositionsIdentical(targetPos, oldGhost)
    ) {
      // remove the real pawn from the board
      if (this.PieceColor == PieceColors.Black) oldGhost[0] += MOVING_DIRECTION;
      else oldGhost[0] += -MOVING_DIRECTION;

      controllerHandler(fullBoard[oldGhost[0]][oldGhost[1]]); // remove piece from View
      fullBoard[oldGhost[0]][oldGhost[1]] = null;
    }

    if (Math.abs(oldRow - whereX) == 2) {
      // set the ghostPawnPos
      if (oldRow > whereX) Pawn.ghostPawn = new Array(oldRow - 1, oldCol);
      else Pawn.ghostPawn = new Array(oldRow + 1, oldCol);
      Pawn.ghostPawnColor = this.PieceColor;
    }
    return strRetVal;
  }

  getPossibleMoves() {
    let fullBoard = this.Board;
    var arrRetVals = new Array();
    let directionOfMove = 0;

    let parentMoves = this.getPossibleMovesOfUnknownPiece();
    arrRetVals.push(parentMoves);

    if (this.PieceColor == PieceColors.Black)
      directionOfMove = -MOVING_DIRECTION;
    else directionOfMove = MOVING_DIRECTION;

    let targetRow = this.RowPos + directionOfMove;
    if (targetRow >= 0 && targetRow <= BOARD_SIZE - 1) {
      if (isNull(fullBoard[targetRow][this.ColPos]))
        arrRetVals.push(new Array(targetRow, this.ColPos)); // no capture
      let tryouts = [-1, 1];
      for (let p of tryouts) {
        let targetPos = new Array(targetRow, this.ColPos + p);
        if (this.ColPos + p >= 0 && this.ColPos + p < BOARD_SIZE)
          if (
            !isNull(fullBoard[targetRow][this.ColPos + p]) &&
            this.PieceColor != fullBoard[targetRow][this.ColPos + p].PieceColor
          )
            arrRetVals.push(targetPos);
          // capture possible here
          else if (
            !isNull(Pawn.ghostPawn) &&
            ChessModel.arePositionsIdentical(targetPos, Pawn.ghostPawn) &&
            Pawn.ghostPawnColor != this.PieceColor
          )
            arrRetVals.push(targetPos);
      }
    }
    // two rows advance
    if (
      this.PieceColor == PieceColors.Black &&
      this.RowPos == BLACK_PAWNS_LINE &&
      isNull(fullBoard[this.RowPos - MOVING_DIRECTION][this.ColPos]) &&
      isNull(fullBoard[this.RowPos - 2 * MOVING_DIRECTION][this.ColPos])
    ) {
      arrRetVals.push(
        new Array(this.RowPos - 2 * MOVING_DIRECTION, this.ColPos)
      );
    }

    if (
      this.PieceColor == PieceColors.White &&
      this.RowPos == WHITE_PAWNS_LINE &&
      isNull(fullBoard[this.RowPos + MOVING_DIRECTION][this.ColPos]) &&
      isNull(fullBoard[this.RowPos + 2 * MOVING_DIRECTION][this.ColPos])
    ) {
      arrRetVals.push(
        new Array(this.RowPos + 2 * MOVING_DIRECTION, this.ColPos)
      );
    }
    return arrRetVals;
  }
}
