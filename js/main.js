var lastTime = 0;
var gold = 0;
var workers = 0;
var isNewPlayer = true;
var s;
var GPS = 0;
var ticks = 0;
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
  gold = save.gold;
  save.gold++;
  console.log("Gold: " + gold);
  console.log("Save gold: " + save.gold);
}
function gameLoop(timeStamp) {
  ticks++;
  var dt = timeStamp - lastTime;
  var roundDt = Math.round(dt);
  if(ticks % 60 === 0) {
    console.log("Tick");
    updatePSValues();
  }
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
  adjustLabel("ManualGoldButton", "Gold: " + save.gold);
  adjustLabel("TS2","Current time: " + getDate());
  adjustLabel("UL1_label","Workers: " + workers);
  unlockHandler();
}
function updatePSValues() {
  if(save.workersUnlocked){
    save.gold = Number.parseInt(save.gold) + GPS;
  }
}

function hireWorker() {
  var cost = CalculateCost("worker", gold, workers);
  if(cost > gold) {
    console.log("Too expensive!");
    return;
  }
  else {
    save.gold -= cost;
    workers++;
    GPS++;
    save.workers = workers;
    adjustLabel("UL1_label", "Workers: " + workers + " (" + GPS + " gold per second)");
  }
  console.log(save.workers + " | " + cost);
}
