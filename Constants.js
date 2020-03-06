const BOARD_SIZE = 8;
const ALPHA = 97;

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

const BODY_TAG = "body";
const DIV_TAG = "div";
const BOARD_ID = "placeHolder";
const MOVES_ID = "listOfMoves";
const PROMOTION_SQR_TOP_ID = "promotionSquareTop";
const PROMOTION_SQR_BOT_ID = "promotionSquareBot";

const PROMOTION_STR = "Promo";
const CELL_STR = "cell";

const SQUARE_CLASS = "square";
const ADDRESS_LINE_CLASS = "addressLine";
const ONE_LINE_CLASS = "oneLine";

const BLACK_SQR_CLASS = "blackSquare";
const WHITE_SQR_CLASS = "whiteSquare";
const TARGET_SQR_CLASS = "targetSquare";
const MIDDLE_LINE_CLASS = "middleLine";
const PROMO_CLASS = "promotingPieces";

const MOUSE_POINTER_URL_START = "url('./img/cursor-";
const MOUSE_POINTER_URL_END = ".png'), auto";

const CELL_ID_DELIMITER = "-";
const TAKES_STRING = "x";

const MOVING_DIRECTION = -1;
/* 
  Black is on top -> 0,0 is top,left corner. White is on bottom.
*/

const BLACK_PAWNS_LINE = MOVING_DIRECTION == -1 ? 1 : 6;
const WHITE_PAWNS_LINE = MOVING_DIRECTION == -1 ? 6 : 1;

const BLACK_BACK_LINE = MOVING_DIRECTION == -1 ? 0 : 7;
const WHITE_BACK_LINE = MOVING_DIRECTION == -1 ? 7 : 0;

const QUEEN_COLUMN = 3;
const KING_COLUMN = 4;
const ROOK_COLUMNS = [0, 7];
const KNIGHT_COLUMNS = [1, 6];
const BISHOP_COLUMNS = [2, 5];

function isNull(someValue) {
  // OVERALL used function to check is a value is EXACTLY null !
  return someValue === null;
}

function getColumnName(givenX) {
  return String.fromCharCode(
    MOVING_DIRECTION < 0 ? ALPHA + givenX : ALPHA + BOARD_SIZE - 1 - givenX
  );
}
function getRowName(givenY) {
  return (MOVING_DIRECTION > 0 ? givenY + 1 : BOARD_SIZE - givenY).toString();
}
