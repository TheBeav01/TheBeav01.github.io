var lastTime = 0;
var gold = 0;
function load() {
  adjustLabel("ManualGoldButtonLabel", "Gold: " + gold);
  gameLoop(lastTime);
}
function handleClick() {
  console.log("Gold: " + gold);
  if(gold === 0) {
    update();
  }
  gold += 1;
}
function gameLoop(timeStamp) {
  var dt = timeStamp - lastTime;
  if(dt >= UPS*100) {
    update();
  }
  requestAnimationFrame(gameLoop)
  }
function update() {
  adjustLabel("ManualGoldButtonLabel", "Gold: " + gold);
}
