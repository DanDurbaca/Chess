"use strict";

class ChessView {
  constructor() {
    this.Body = null;
    this.ChessPlaceHolder = null;
    this.listOfMoves = null;
  }

  bindPageLoad(handlerFromController) {
    window.addEventListener("load", event => {
      // When adding the function name here (no arrow function)
      // this will NOT be the class - but the target html element !!
      this.Body = document.getElementsByTagName(BODY_TAG);
      this.ChessPlaceHolder = document.getElementById(BOARD_ID);
      this.listOfMoves = document.getElementById(MOVES_ID);
      handlerFromController();
    });
  }

  addMoveToList(strMoveToAdd) {
    if (strMoveToAdd != "") {
      let elem = document.createElement("li");
      elem.innerHTML = strMoveToAdd;
      this.listOfMoves.appendChild(elem);
    }
  }

  bindMouseDown(X, Y, handlerFromController) {
    let squareId = ChessView.getIdFromCoordinates(X, Y);
    let domElement = document.getElementById(squareId);
    domElement.addEventListener(
      "mousedown",
      event => {
        event.preventDefault();
        handlerFromController(X, Y);
      },
      true
    );
  }

  bindPromotionEvent(X, Y, handlerFromController) {
    let idLocation = "";
    if (X == 0) idLocation = PROMOTION_SQR_TOP_ID;
    else if (X == BOARD_SIZE - 1) idLocation = PROMOTION_SQR_BOT_ID;
    else throw "Not a promotion ! Wrong call !";
    idLocation += Y;
    let colorOfPiece =
      X == BLACK_BACK_LINE ? PieceColors.White : PieceColors.Black;
    let promoLocation = document.getElementById(idLocation);
    let promotables = ChessView.getPromotablesElements(colorOfPiece);
    promoLocation.appendChild(promotables);
    let _mouseUp = event => {
      // WHY MOUSEUP and NOT CLICK ????
      // Check the event. target id and IF IT is a promotable selected call the handler accordingly
      if (ChessView.isIDOfAPromotable(event.target.id)) {
        handlerFromController(
          ChessView.getPromotionPieceFromId(event.target.id, colorOfPiece),
          X,
          Y
        );
      } else handlerFromController(null);
      document.removeEventListener("mouseup", _mouseUp, true);
      promoLocation.removeChild(promotables);
      // remove the promotables div from the board !
    };
    document.addEventListener("mouseup", _mouseUp, true);
  }

  bindMouseUp(handlerFromController) {
    let _mouseUp = event => {
      // get x and y from event.target.id
      if (ChessView.isIdACell(event.target.id)) {
        let arrCoordinates = ChessView.getCoordinatesFromId(event.target.id);
        handlerFromController(
          parseInt(arrCoordinates[0]),
          parseInt(arrCoordinates[1])
        ); // mouseup
      } else handlerFromController(null, null);

      document.removeEventListener("mouseup", _mouseUp, true);
    };
    document.addEventListener("mouseup", _mouseUp, true);
  }

  displayBoardSquares() {
    //create a first empty new line
    let addressLine = document.createElement(DIV_TAG);
    addressLine.classList.add(ADDRESS_LINE_CLASS);
    for (let j = 0; j < BOARD_SIZE; j++) {
      let newSquare = document.createElement(DIV_TAG);
      newSquare.style.position = "relative";
      newSquare.id = PROMOTION_SQR_TOP_ID + j;
      addressLine.appendChild(newSquare);
      newSquare.innerHTML = getColumnName(j);
    }
    this.ChessPlaceHolder.appendChild(addressLine);

    for (let i = 0; i < BOARD_SIZE; i++) {
      let newLine = document.createElement(DIV_TAG);
      newLine.classList.add(ONE_LINE_CLASS);
      for (let j = 0; j < BOARD_SIZE; j++) {
        let newSquare = document.createElement(DIV_TAG);
        newSquare.id = ChessView.getIdFromCoordinates(i, j);
        newSquare.classList.add(SQUARE_CLASS);

        if ((i + j) % 2 == 0) newSquare.classList.add(WHITE_SQR_CLASS);
        else newSquare.classList.add(BLACK_SQR_CLASS);
        newLine.appendChild(newSquare);
      }
      let newSquare = document.createElement(DIV_TAG); // add one more square for address
      newSquare.classList.add(SQUARE_CLASS);
      newSquare.classList.add(MIDDLE_LINE_CLASS);
      newSquare.innerHTML = getRowName(i);
      newLine.appendChild(newSquare);

      this.ChessPlaceHolder.appendChild(newLine);
    }
    addressLine = addressLine.cloneNode(true);
    addressLine.childNodes.forEach(curNode => {
      let numericPart = curNode.id.substring(PROMOTION_SQR_TOP_ID.length); // remove PROMOTION_SQR_TOP_ID
      curNode.id = PROMOTION_SQR_BOT_ID + numericPart;
    });

    this.ChessPlaceHolder.appendChild(addressLine);
  }

  removePieceFromBoard(X, Y, classNameOfPiece) {
    let squareId = ChessView.getIdFromCoordinates(X, Y);
    let domElement = document.getElementById(squareId);
    domElement.classList.remove(classNameOfPiece);
    /*
            remove OLD LISTENER !!
            */
    let new_element = domElement.cloneNode(true);
    domElement.parentNode.replaceChild(new_element, domElement);
    domElement = new_element;
  }

  putPieceOnBoard(X, Y, classNameOfPiece) {
    let squareId = ChessView.getIdFromCoordinates(X, Y);
    let domElement = document.getElementById(squareId);
    domElement.classList.add(classNameOfPiece);
  }

  setCursorToPiece(stringOfCursorPiece) {
    let curElem = this.ChessPlaceHolder;
    curElem.style.cursor = stringOfCursorPiece;
  }

  setCursorToDefault() {
    let curElem = this.ChessPlaceHolder;
    curElem.style.cursor = "auto";
  }

  turnOnCells(arrOfPossibleLocations, off = false) {
    for (let p of arrOfPossibleLocations) {
      if (p.length != 2) throw "Invalid position given !!";
      let elemId = ChessView.getIdFromCoordinates(p[0], p[1]);
      let domElem = document.getElementById(elemId);
      if (!off) domElem.classList.add(TARGET_SQR_CLASS);
      else domElem.classList.remove(TARGET_SQR_CLASS);
    }
  }

  // static member functions from here on ->

  static getPromotionPieceFromId(givenId, colorStr) {
    // assume this starts with PROMOTION_STR
    return givenId.substring(PROMOTION_STR.length + colorStr.length);
  }

  static isIDOfAPromotable(givenId) {
    return this.stringStartsWith(givenId, PROMOTION_STR);
  }

  static isIdACell(givenId) {
    return this.stringStartsWith(givenId, CELL_STR);
  }

  static stringStartsWith(testStr, checkAgainst) {
    return testStr.substring(0, checkAgainst.length) == checkAgainst;
  }

  static getIdFromCoordinates(i, j) {
    return CELL_STR + parseInt(i) + CELL_ID_DELIMITER + parseInt(j);
  }

  static getCoordinatesFromId(givenId) {
    let numericPart = givenId.substring(CELL_STR.length); // remove "cell" from the id
    return numericPart.split(CELL_ID_DELIMITER);
  }

  static getPromotablesElements(color) {
    let promotingPieces = document.createElement(DIV_TAG);
    promotingPieces.classList.add(PROMO_CLASS);

    let arrOfPromotables = [];
    // decide on what direction should the promotables spawn
    let spawnDown = true;
    if (color == PieceColors.Black) {
      arrOfPromotables = BLACK_PROMOTABLES;
      spawnDown = MOVING_DIRECTION < 0 ? true : false;
    } else if (color == PieceColors.White) {
      arrOfPromotables = WHITE_PROMOTABLES;
      spawnDown = MOVING_DIRECTION < 0 ? false : true;
    } else throw "Unknown color received as param !";

    if (spawnDown) {
      promotingPieces.style.flexDirection = "column-reverse";
      promotingPieces.style.bottom = "0px";
    } else {
      promotingPieces.style.flexDirection = "column";
      promotingPieces.style.top = "0px";
    }

    arrOfPromotables.forEach(pieceClass => {
      let promotingPiece = document.createElement(DIV_TAG);
      promotingPiece.id = PROMOTION_STR + pieceClass;
      promotingPiece.classList.add(SQUARE_CLASS);
      promotingPiece.classList.add(pieceClass);
      promotingPieces.appendChild(promotingPiece);
    });
    return promotingPieces;
  }
}
