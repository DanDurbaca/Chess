const BOARD_SIZE = 8;
const ALPHA = 97;

const BLACK_PAWNS_LINE = 1;
const WHITE_PAWNS_LINE = 6;

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

function isNull(someValue) {
  // OVERALL used function to check is a value is EXACTLY null !
  return someValue === null;
}
