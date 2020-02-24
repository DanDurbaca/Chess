"use strict";

function isNull(someValue) {
  return someValue === null;
}

class ChessController {
  constructor(model, view) {
    this.GameData = model;
    this.GameView = view;

    this.resetMove();

    this.WhiteToMove = true; // TO DO -> alternating moves !

    this.GameView.bindPageLoad(this.loadedPageEvent);
  }

  resetMove() {
    this.pieceIsRaised = false;
    this.ongoingPossibleMoves = null;
    this.whereWasPieceRaisedFromX = null;
    this.whereWasPieceRaisedFromY = null;
  }

  loadedPageEvent = () => {
    this.GameView.displayBoardSquares(BOARD_SIZE);
    this.refreshViewFromModel();
    this.goNextMove();
  };

  removePieceEvent = pieceToRemove => {
    // callback to for the model remove a piece from board (view)
    if (!isNull(pieceToRemove))
      this.GameView.removePieceFromBoard(
        pieceToRemove.RowPos,
        pieceToRemove.ColPos,
        pieceToRemove.getClassName()
      );
    else
      console.log(
        "Trying to remove from view a piece that doesnt exist in the model"
      );
  };

  mouseDownOnPieceEvent = (whereX, whereY) => {
    if (!isNull(this.GameData.getPieceAt(whereX, whereY))) {
      this.ongoingPossibleMoves = this.GameData.getPossibleMoves(
        whereX,
        whereY
      );
      if (this.ongoingPossibleMoves.length > 0) {
        console.log(whereX, whereY); // piece is raised !!
        let strCursor = this.GameData.getPieceAt(
          whereX,
          whereY
        ).getPieceCursorUrl();
        this.GameView.setCursorToPiece(strCursor);
        this.pieceIsRaised = true;
        this.whereWasPieceRaisedFromX = whereX;
        this.whereWasPieceRaisedFromY = whereY;
        this.GameView.turnOnCells(this.ongoingPossibleMoves);
        this.GameView.removePieceFromBoard(
          whereX,
          whereY,
          this.GameData.getPieceAt(whereX, whereY).getClassName()
        );
        this.GameView.bindMouseUp(this.releasedPieceEvent);
      } else console.log("No possible moves !");
    } else throw "Trying to raise inexistent piece";
  };

  promotedPawnEvent = (transformInto, whereX, whereY) => {
    if (!isNull(transformInto)) {
      this.makeAMove(whereX, whereY); // move the pawn first

      this.removePieceEvent(this.GameData.getPieceAt(whereX, whereY)); // remove the pawn from the view

      this.GameData.transformPiece(
        // transform it !
        whereX,
        whereY,
        transformInto
      );
      this.GameView.putPieceOnBoard(
        // put back the new piece in the view
        whereX,
        whereY,
        this.GameData.getPieceAt(whereX, whereY).getClassName()
      );
    } else {
      this.putBackAPiece();
    }
    this.resetMove();
  };

  makeAMove(whereX, whereY) {
    let lastX = this.whereWasPieceRaisedFromX;
    let lastY = this.whereWasPieceRaisedFromY;

    let moveNotation = this.GameData.movePiece(
      lastX,
      lastY,
      whereX,
      whereY,
      this.removePieceEvent
    );
    this.GameView.addMoveToList(moveNotation);
    this.GameView.putPieceOnBoard(
      whereX,
      whereY,
      this.GameData.getPieceAt(whereX, whereY).getClassName()
    );
    this.goNextMove();
  }

  putBackAPiece() {
    let lastX = this.whereWasPieceRaisedFromX;
    let lastY = this.whereWasPieceRaisedFromY;

    if (
      !isNull(lastX) &&
      !isNull(lastY) &&
      !isNull(this.GameData.getPieceAt(lastX, lastY))
    ) {
      this.GameView.putPieceOnBoard(
        lastX,
        lastY,
        this.GameData.getPieceAt(lastX, lastY).getClassName()
      );
      this.GameView.bindMouseDown(lastX, lastY, this.mouseDownOnPieceEvent);
    } else throw "Putting back an inexistent piece ?!!";
  }

  releasedPieceEvent = (whereX, whereY) => {
    if (!this.pieceIsRaised)
      throw "Released a piece on the board without RAISING IT !";

    this.GameView.turnOnCells(
      this.ongoingPossibleMoves,
      true /* this flag says turn OFF !*/
    );

    let lastX = this.whereWasPieceRaisedFromX;
    let lastY = this.whereWasPieceRaisedFromY;

    let bWillMoveThere = false;
    let bKeepPieceRaised = false;
    // check params if ok !!
    if (!isNull(whereX) && !isNull(whereY)) {
      let targetPosArr = [whereX, whereY];
      // check if whereX, whereY is IN the array ongoingPossibleMoves
      for (let posMove of this.ongoingPossibleMoves)
        if (ChessModel.arePositionsIdentical(targetPosArr, posMove))
          bWillMoveThere = true;
    }
    if (bWillMoveThere)
      if (lastX == whereX && lastY == whereY) bWillMoveThere = false; // not an actual move !!

    if (bWillMoveThere) {
      // pawn promotion check
      if (this.GameData.isMoveAPawnPromotion(lastX, lastY, whereX, whereY)) {
        // is this a promoting pawn ?
        this.GameView.bindPromotionEvent(
          whereX,
          whereY,
          this.promotedPawnEvent
        );
        bKeepPieceRaised = true;
      } else {
        this.makeAMove(whereX, whereY);
      }
    } // released somewhere else !!
    else this.putBackAPiece();

    if (!bKeepPieceRaised) {
      this.resetMove();
    }
    this.GameView.setCursorToDefault();
  };

  refreshViewFromModel() {
    for (let row = 0; row < BOARD_SIZE; row++)
      for (let col = 0; col < BOARD_SIZE; col++)
        if (!isNull(this.GameData.getPieceAt(row, col))) {
          this.GameView.putPieceOnBoard(
            row,
            col,
            this.GameData.getPieceAt(row, col).getClassName()
          );
        }
  }

  goNextMove() {
    let piecesToMove = null;
    let piecesToStayStill = null;
    if (this.WhiteToMove == true) {
      piecesToMove = this.GameData.getPiecesOfColor(PieceColors.White);
      piecesToStayStill = this.GameData.getPiecesOfColor(PieceColors.Black);
    } else {
      piecesToMove = this.GameData.getPiecesOfColor(PieceColors.Black);
      piecesToStayStill = this.GameData.getPiecesOfColor(PieceColors.White);
    }
    // add listeners for the pieces to move
    piecesToMove.forEach(curPiece => {
      this.GameView.bindMouseDown(
        curPiece.RowPos,
        curPiece.ColPos,
        this.mouseDownOnPieceEvent
      );
    });

    // remove listeners for the other pieces
    piecesToStayStill.forEach(curPiece => {
      // remove piece and add it again to remove the listeners !
      this.GameView.removePieceFromBoard(
        curPiece.RowPos,
        curPiece.ColPos,
        curPiece.getClassName()
      );
      this.GameView.putPieceOnBoard(
        curPiece.RowPos,
        curPiece.ColPos,
        curPiece.getClassName()
      );
    });
    this.WhiteToMove = !this.WhiteToMove; // switch for the next move
  }
}
