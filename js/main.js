var lastTime = 0;
var gold = 0;
var workers = 0;
var isNewPlayer = true;
var s;
var GPT = 0;
var GPS = 0;
var ticks = 0;
var version = "0.01";

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
  if(save.gold === undefined) {
    console.log("Undefined?");
  }
  gold = save.gold;
  save.gold++;
  console.log("Save gold: " + save.gold);
}
function gameLoop(timeStamp) {
  ticks++;
  var dt = timeStamp - lastTime;
  var roundDt = Math.round(dt);
  if(ticks%60 === 0) {
    // console.log("Tick");
  }
  update();
  requestAnimationFrame(gameLoop)
  }
function update() {
  if(gold === NaN || gold === undefined) {
    console.log("Setting gold to 0");
    gold = 0;
  }
  if(workers > 0) {
    GPT = workers/60;
    var parsedFloatSG = Number.parseFloat(save.gold);
    parsedFloatSG += GPT;
    save.gold = parsedFloatSG;
    var displayGold = Number.parseInt(save.gold);
    console.log(displayGold);

    checkCosts(displayGold);
    adjustLabel("ManualGoldButton", "Gold: " + displayGold);
    var nextString = displayGold + "/" + CalculateCost("worker", save.gold, workers);
    adjustLabel("UL1_label", "Workers: " + workers + " (" + GPS + " GPS) " + nextString);
    }
  else {
    adjustLabel("ManualGoldButton", "Gold: " + save.gold);
  }
  adjustLabel("TS2","Current time: " + getDate());
 
  unlockHandler();
}

function hireWorker() {
  var cost = CalculateCost("worker", save.gold, workers);
  if(cost > save.gold) {
    console.log("Too expensive!");
    return;
  }
  else {
    save.gold -= cost;
    workers++;
    GPT = workers/60;
    GPS = workers;
    save.workers = workers;
    adjustLabel("UL1_label", "Workers: " + workers + " (" + GPS + " gold per second)");
  }
  console.log(save.workers + " | " + cost);
}
