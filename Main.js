const app = new ChessController(new ChessModel(), new ChessView());

function showPromotion() {
  let mEvent = this.event;
  let rect = document.getElementById("test").getBoundingClientRect();
  let x = mEvent.clientX - rect.left; //x position within the element.
  let y = mEvent.clientY - rect.top; //y position within the element.

  let promotingPieces = document.createElement("div");
  promotingPieces.style.position = "absolute";
  promotingPieces.style.top = parseInt(y, 0).toString() + "px";
  promotingPieces.style.left = parseInt(x, 0).toString() + "px";

  let arrOfPromotables = [
    "blackQueen",
    "blackRook",
    "blackBishop",
    "blackKnight"
  ];
  arrOfPromotables.forEach(pieceClass => {
    let promotingPiece = document.createElement("div");
    promotingPiece.classList.add("square");
    promotingPiece.classList.add(pieceClass);
    promotingPieces.appendChild(promotingPiece);
  });

  document.getElementById("test").appendChild(promotingPieces);
}
