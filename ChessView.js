"use strict";

const BOARD_ID = "placeHolder";
const MOVES_ID = "listOfMoves";

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
      this.Body = document.getElementsByTagName("body");
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

  displayBoardSquares(boardSize) {
    //create a first empty new line
    let addressLine = document.createElement("div");
    addressLine.classList.add("oneLine");
    addressLine.classList.add("topLine");
    for (let j = 0; j < boardSize; j++) {
      let newSquare = document.createElement("div");
      newSquare.classList.add("square");
      addressLine.appendChild(newSquare);
      newSquare.innerHTML = String.fromCharCode(ALPHA + j);
    }
    this.ChessPlaceHolder.appendChild(addressLine);

    for (let i = 0; i < boardSize; i++) {
      let newLine = document.createElement("div");
      newLine.classList.add("oneLine");
      for (let j = 0; j < boardSize; j++) {
        let newSquare = document.createElement("div");
        newSquare.id = ChessView.getIdFromCoordinates(i, j);
        newSquare.classList.add("square");

        if ((i + j) % 2 == 0) newSquare.classList.add("whiteSquare");
        else newSquare.classList.add("blackSquare");
        newLine.appendChild(newSquare);
      }
      let newSquare = document.createElement("div"); // add one more square for address
      newSquare.classList.add("square");
      newSquare.classList.add("middleLine");
      newSquare.innerHTML = (BOARD_SIZE - i).toString();
      newLine.appendChild(newSquare);

      this.ChessPlaceHolder.appendChild(newLine);
    }
    addressLine = addressLine.cloneNode(true);
    addressLine.classList.remove("topLine");
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
      if (!off) domElem.classList.add("targetSquare");
      else domElem.classList.remove("targetSquare");
    }
  }

  // static member functions from here on ->

  static isIdACell(givenId) {
    return givenId.substring(0, 4) == "cell";
  }

  static getIdFromCoordinates(i, j) {
    return "cell" + parseInt(i) + "-" + parseInt(j);
  }

  static getCoordinatesFromId(givenId) {
    let numericPart = givenId.substring(4); // remove "cell" from the id
    return numericPart.split("-");
  }
}
