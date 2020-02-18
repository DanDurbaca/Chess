const app = new ChessController(new ChessModel(), new ChessView());

function showPromotion() {
  let mEvent = this.event;
  let rect = mEvent.target.getBoundingClientRect();
  let x = mEvent.clientX - rect.left; //x position within the element.
  let y = mEvent.clientY - rect.top; //y position within the element.

  console.log(x, y);
  console.log("Click");
  let promotingQueen = document.createElement("div");
  promotingQueen.style.position = "absolute";
  promotingQueen.style.top = parseInt(y, 0).toString() + "px";
  promotingQueen.style.left = parseInt(x, 0).toString() + "px";
  promotingQueen.classList.add("square");
  promotingQueen.classList.add("blackQueen");

  document.getElementById("test").appendChild(promotingQueen);
}
