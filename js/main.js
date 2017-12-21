var lastTime = 0;
var gold = 0;
var workers = undefined;
var isNewPlayer = true;
var s;
function load() {
  var cookieSaveString = cookieExists("save");
  console.log(cookieSaveString);
  if(cookieExists("save") != "") {
    console.log("Save file exists");
    decodeSave(cookieSaveString);
    initGame();
    // SaveGame();
  }
  else {
    console.log("Save file does not exist. Creating...");
    setCookie("save",gold.toString(),365);  
  }
  adjustLabel("ManualGoldButton", "Gold: " + save.gold);
  gameLoop(lastTime);
}
function getGold() {
  if(gold == 0) {
    update();
  }
  gold = save.gold;
  save.gold++;
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
  if(gold === NaN || gold === undefined) {
    console.log("Setting gold to 0");
    gold = 0;
  }
  adjustLabel("ManualGoldButton", "Gold: " + gold);
  adjustLabel("TS2","Current time: " + getDate());
  unlockHandler();
}

function hireWorker() {
  var cost = CalculateCost("worker", gold);
}
