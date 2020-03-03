"use strict";

function isNull(someValue) {
  // OVERALL used function to check is a value is EXACTLY null !
  return someValue === null;
}

/*
This class is the link between the Model and the view.
Its using callbacks to update things.
*/

class ChessController {
  constructor(model, view) {
    this.GameData = model;
    this.GameView = view;

    this.resetMove();

    this.WhiteToMove = true;

    this.GameView.bindPageLoad(this.loadedPageEvent);
  }

  resetMove() {
    // reset the moves
    this.pieceIsRaised = false;
    this.ongoingPossibleMoves = null;
    this.whereWasPieceRaisedFromX = null; // last position we raised a piece from
    this.whereWasPieceRaisedFromY = null;
  }

  // when the page finished loading
  loadedPageEvent = () => {
    this.GameView.displayBoardSquares(BOARD_SIZE); // show the board squares first
    this.refreshViewFromModel(); // show the model !
    this.goNextMove(); // next player
  };

  // callback to for the model remove a piece from board (view)
  removePieceEvent = pieceToRemove => {
    if (!isNull(pieceToRemove))
      // remove the piece from the view !
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

  // callback for the view - trying to raise a piece
  mouseDownOnPieceEvent = (whereX, whereY) => {
    if (!isNull(this.GameData.getPieceAt(whereX, whereY))) {
      this.ongoingPossibleMoves = this.GameData.getPossibleMoves(
        whereX,
        whereY
      );
      if (this.ongoingPossibleMoves.length > 0) {
        // if we can move ANYWHERE
        //console.log(whereX, whereY); // piece is raised !!
        let strCursor = this.GameData.getPieceAt(
          whereX,
          whereY
        ).getPieceCursorUrl(); // the the image name for the cursor to change from the model
        this.GameView.setCursorToPiece(strCursor); // change the cursor in the view
        this.pieceIsRaised = true; // ok .. we raised the piece
        this.whereWasPieceRaisedFromX = whereX;
        this.whereWasPieceRaisedFromY = whereY;
        this.GameView.turnOnCells(this.ongoingPossibleMoves); // highlight the possible moves
        this.GameView.removePieceFromBoard(
          // remove the piece from the view (for the moment)
          whereX,
          whereY,
          this.GameData.getPieceAt(whereX, whereY).getClassName()
        );
        this.GameView.bindMouseUp(this.releasedPieceEvent); // WAIT for a release somewhere !
      } else console.log("No possible moves !");
    } else throw "Trying to raise inexistent piece";
  };

  // callback for the promotion of a pawn from the view - the user just CHOSE a piece to transform into !
  promotedPawnEvent = (transformInto, whereX, whereY) => {
    if (!isNull(transformInto)) {
      // what piece are we transforming into ?!
      this.makeAMove(whereX, whereY); // move the pawn first

      this.removePieceEvent(this.GameData.getPieceAt(whereX, whereY)); // remove the pawn from the view

      this.GameData.transformPiece(
        // call the model to CHANGE the pawn into something else
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
      // the user hasnt selected ANY piece to transform into
      this.putBackAPiece(); // put back the original pawn
    }
    this.resetMove();
  };

  // callback from the view -> a piece has been released on the board !
  releasedPieceEvent = (whereX, whereY) => {
    if (!this.pieceIsRaised)
      // no no ...
      throw "Released a piece on the board without RAISING IT !";

    this.GameView.turnOnCells(
      // turn OFF the cells that were previously turned on
      this.ongoingPossibleMoves,
      true /* this flag says turn OFF !*/
    );

    let lastX = this.whereWasPieceRaisedFromX; // get these into shorter variables
    let lastY = this.whereWasPieceRaisedFromY;

    let bWillMoveThere = false; // flags
    let bKeepPieceRaised = false;
    // check params if ok !!
    if (!isNull(whereX) && !isNull(whereY)) {
      let targetPosArr = [whereX, whereY];
      // WAS this even POSSIBLE ?!
      // check if whereX, whereY is IN the array ongoingPossibleMoves
      for (let posMove of this.ongoingPossibleMoves)
        if (ChessModel.arePositionsIdentical(targetPosArr, posMove))
          bWillMoveThere = true; // yeah
    }
    if (bWillMoveThere)
      if (lastX == whereX && lastY == whereY)
        // .. now did he ACTUALLY make a move ?!
        bWillMoveThere = false; // not an actual move !!

    if (bWillMoveThere) {
      // pawn promotion check - > this is an EXCEPTION !
      // ask the model
      if (this.GameData.isMoveAPawnPromotion(lastX, lastY, whereX, whereY)) {
        // this a promoting pawn
        this.GameView.bindPromotionEvent(
          // so wait some more time for him to choose a piece to transform into
          whereX,
          whereY,
          this.promotedPawnEvent
        );
        bKeepPieceRaised = true; // keep waiting
      } else {
        // THIS IS THE GENERALL RULE ! - a piece is moved here !
        this.makeAMove(whereX, whereY);
      }
    } // released somewhere else - its a FAKE move
    else this.putBackAPiece(); // go back

    // if the piece is NOT kept up
    if (!bKeepPieceRaised) {
      this.resetMove();
    }
    this.GameView.setCursorToDefault(); // switch the cursor to default
  };

  ///////// <<--- CALLBACKs  END HERE !

  // from here on we implement the members of the ChessController ->>

  // DO make a move from the piece's last position TO the given params.
  makeAMove(whereX, whereY) {
    let lastX = this.whereWasPieceRaisedFromX;
    let lastY = this.whereWasPieceRaisedFromY;

    // call the model to do the change and reply with the move's notation
    let moveNotation = this.GameData.movePiece(
      lastX,
      lastY,
      whereX,
      whereY,
      this.removePieceEvent
    );
    this.GameView.addMoveToList(moveNotation); // update the view with the notation
    // update the view with the piece in the new location
    this.GameView.putPieceOnBoard(
      whereX,
      whereY,
      this.GameData.getPieceAt(whereX, whereY).getClassName()
    );
    this.goNextMove(); // next player
  }

  // a fake move was detected
  putBackAPiece() {
    let lastX = this.whereWasPieceRaisedFromX;
    let lastY = this.whereWasPieceRaisedFromY;

    if (
      !isNull(lastX) &&
      !isNull(lastY) &&
      !isNull(this.GameData.getPieceAt(lastX, lastY))
    ) {
      // get the raised piece back from the model
      this.GameView.putPieceOnBoard(
        // put it on board in the view
        lastX,
        lastY,
        this.GameData.getPieceAt(lastX, lastY).getClassName()
      );
      // wait for new pieces to be raised !
      this.GameView.bindMouseDown(lastX, lastY, this.mouseDownOnPieceEvent);
    } else throw "Putting back an inexistent piece ?!!";
  }

  // update the view from the model
  refreshViewFromModel() {
    // for each NON empty square in the model
    for (let row = 0; row < BOARD_SIZE; row++)
      for (let col = 0; col < BOARD_SIZE; col++)
        if (!isNull(this.GameData.getPieceAt(row, col))) {
          this.GameView.putPieceOnBoard(
            // put the piece in the view
            row,
            col,
            this.GameData.getPieceAt(row, col).getClassName()
          );
        }
  }

  // next player to move
  goNextMove() {
    let piecesToMove = null; // this holds the pieces that are allowed to move
    let piecesToStayStill = null; // the others
    if (this.WhiteToMove == true) {
      // white is moving
      piecesToMove = this.GameData.getPiecesOfColor(PieceColors.White); // get the info from the model
      piecesToStayStill = this.GameData.getPiecesOfColor(PieceColors.Black);
    } else {
      // black is moving
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
      // TRICKY: remove piece and add it again to remove the listeners !
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
    this.WhiteToMove = !this.WhiteToMove; // switch player
  }
}
