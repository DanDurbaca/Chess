"use strict";

function isNull(someValue) {
  return someValue === null;
}

class ChessController {
  constructor(model, view) {
    this.GameData = model;
    this.GameView = view;

    this.pieceIsRaised = false;
    this.ongoingPossibleMoves = null;
    this.whereWasPieceRaisedFromX = null;
    this.whereWasPieceRaisedFromY = null;

    this.GameView.bindPageLoad(this.loadedPageEvent);
  }

  loadedPageEvent = () => {
    this.GameView.displayBoardSquares(BOARD_SIZE);
    this.refreshViewFromModel();
  };

  removePieceEvent = pieceToRemove => {
    // callback to for the model remove a piece from board (view)
    if (!isNull(pieceToRemove))
      this.GameView.removePieceFromBoard(pieceToRemove);
    else
      console.log(
        "Trying to remove from view a piece that doesnt exist in the model"
      );
  };

  mouseDownOnPieceEvent = (whereX, whereY) => {
    if (!isNull(this.GameData.chessBoard[whereX][whereY])) {
      this.ongoingPossibleMoves = this.GameData.getPossibleMoves(
        whereX,
        whereY
      );
      if (this.ongoingPossibleMoves.length > 0) {
        console.log(whereX, whereY); // piece is raised !!
        let strCursor = this.GameData.chessBoard[whereX][
          whereY
        ].getPieceCursorUrl();
        this.GameView.setCursorToPiece(strCursor);
        this.pieceIsRaised = true;
        this.whereWasPieceRaisedFromX = whereX;
        this.whereWasPieceRaisedFromY = whereY;
        this.GameView.turnOnCells(this.ongoingPossibleMoves);
        this.GameView.removePieceFromBoard(
          this.GameData.chessBoard[whereX][whereY]
        );
        this.GameView.bindMouseUpOrLeave(this.releasedPieceEvent);
      } else console.log("No possible moves !");
    } else throw "Trying to raise inexistent piece";
  };

  releasedPieceEvent = (whereX, whereY) => {
    this.pieceIsRaised = false;
    this.GameView.turnOnCells(this.ongoingPossibleMoves, true);

    let lastX = this.whereWasPieceRaisedFromX;
    let lastY = this.whereWasPieceRaisedFromY;

    let bWillMoveThere = false;
    // check params if ok !!
    if (!isNull(whereX) && !isNull(whereY)) {
      let targetPosArr = [whereX, whereY];
      // check if whereX, whereY is IN the array ongoingPossibleMoves
      for (let posMove of this.ongoingPossibleMoves)
        if (ChessModel.arePositionsIdentical(targetPosArr, posMove))
          bWillMoveThere = true;
    }

    if (bWillMoveThere) {
      let moveNotation = this.GameData.movePiece(
        lastX,
        lastY,
        whereX,
        whereY,
        this.removePieceEvent
      );
      this.GameView.addMoveToList(moveNotation);
      this.GameView.putPieceOnBoard(
        this.GameData.chessBoard[whereX][whereY],
        this.mouseDownOnPieceEvent
      );
    } // released somewhere else !!
    else {
      if (
        !isNull(lastX) &&
        !isNull(lastY) &&
        !isNull(this.GameData.chessBoard[lastX][lastY])
      )
        // put back the piece
        this.GameView.putPieceOnBoard(
          this.GameData.chessBoard[lastX][lastY],
          this.mouseDownOnPieceEvent
        );
      else throw "Release mouse without press ?!!";
    }
    this.whereWasPieceRaisedFromX = null;
    this.whereWasPieceRaisedFromY = null;
    this.ongoingPossibleMoves = null;

    //console.log("Released !!");
    this.GameView.setCursorToDefault();
  };

  refreshViewFromModel() {
    for (let row = 0; row < BOARD_SIZE; row++)
      for (let col = 0; col < BOARD_SIZE; col++)
        if (!isNull(this.GameData.chessBoard[row][col])) {
          this.GameView.putPieceOnBoard(
            this.GameData.chessBoard[row][col],
            this.mouseDownOnPieceEvent
          );
        }
  }
}
