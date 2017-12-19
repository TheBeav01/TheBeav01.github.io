var lastTime = 0;
var gold = 0;
function load() {
  adjustLabel("ManualGoldButton", "Gold: " + gold);
  gameLoop(lastTime);
}
function handleClick() {
  if(gold === 0) {
    update();
  }
  gold += 1;
  console.log("Gold: " + gold);
}
function gameLoop(timeStamp) {
  var dt = timeStamp - lastTime;
  if(dt >= UPS*100) {
    update();
  }
  requestAnimationFrame(gameLoop)
  }
function update() {
  adjustLabel("ManualGoldButton", "Gold: " + gold);
}
