"use strict";
const BOARD_SIZE = 8;
const ALPHA = 97;

const BLACK_PAWNS_LINE = 1;
const WHITE_PAWNS_LINE = 6;

class ChessModel {
  constructor() {
    this.initBoard();
  }

  getPiecesOfColor(selectColor) {
    let arrRetVal = new Array();
    this.chessBoard.forEach(row => {
      row.forEach(cell => {
        if (!isNull(cell))
          if (cell.PieceColor == selectColor) arrRetVal.push(cell);
      });
    });
    return arrRetVal;
  }

  getPieceAt(X, Y) {
    return this.chessBoard[X][Y];
  }

  initBoard() {
    this.chessBoard = new Array(BOARD_SIZE);
    for (let row = 0; row < BOARD_SIZE; row++) {
      this.chessBoard[row] = new Array(BOARD_SIZE);
      for (let col = 0; col < BOARD_SIZE; col++) {
        this.chessBoard[row][col] = null;
        // init chessBoard with Pawns
        if (row == BLACK_PAWNS_LINE)
          new Pawn(row, col, PieceColors.Black, this.chessBoard);
        if (row == WHITE_PAWNS_LINE)
          new Pawn(row, col, PieceColors.White, this.chessBoard);
        // to do >> all pieces !
      }
    }
    new Queen(0, 4, PieceColors.Black, this.chessBoard);
  }

  isMoveAPawnPromotion(fromX, fromY, toX, toY) {
    // assume a VALID move !
    let bRetVal = false;
    if (this.chessBoard[fromX][fromY].PieceName == ChessPieceTypes.Pawn)
      if (toX == 0 || toX == BOARD_SIZE - 1) bRetVal = true;
    return bRetVal;
  }

  movePiece(fromX, fromY, toX, toY, controllerHandler) {
    let board = this.chessBoard;
    let strMove = "";
    if (fromX != toX || fromY != toY) {
      if (!isNull(board[fromX][fromY])) {
        strMove = board[fromX][fromY].movePiece(toX, toY, controllerHandler);
      } else
        strMove =
          "Trying to move inexistent piece from: " + fromX + "," + fromY;
    } else console.log("Inexistent move !!");
    return strMove;
  }

  getPossibleMoves(fromX, fromY) {
    let board = this.chessBoard;
    if (isNull(fromX) || isNull(fromY)) throw "Invalid from position";
    if (fromX < 0 || fromX >= BOARD_SIZE || fromY < 0 || fromY >= BOARD_SIZE)
      throw "Out of the board position";
    if (isNull(board[fromX][fromY])) throw "Not a piece to move from";
    return board[fromX][fromY].getPossibleMoves();
  }

  transformPiece(row, col, strToTransformInto) {
    if (!isNull(this.chessBoard[row][col])) {
      let colorOfPiece = this.chessBoard[row][col].PieceColor;
      switch (strToTransformInto) {
        case ChessPieceTypes.Rook:
          new Rook(row, col, colorOfPiece, this.chessBoard);
          break;
        case ChessPieceTypes.Knight:
          new Knight(row, col, colorOfPiece, this.chessBoard);
          break;
        case ChessPieceTypes.Bishop:
          new Bishop(row, col, colorOfPiece, this.chessBoard);
          break;
        case ChessPieceTypes.Queen:
          new Queen(row, col, colorOfPiece, this.chessBoard);
          break;
        default:
          throw "Cannot transform piece into " + strToTransformInto;
      }
    } else throw "Cannot transform a non existing piece";
  }

  static arePositionsIdentical(pos1, pos2) {
    // receive two arrays of size 2 and compare them, element by element
    if (!Array.isArray(pos1) || !Array.isArray(pos2))
      throw "No array arguments for positions ";
    if (pos1.length != pos2.length || pos1.length != 2)
      throw "Incorrect length of positions (required 2)";
    return pos1[0] == pos2[0] && pos1[1] == pos2[1];
  }
}
