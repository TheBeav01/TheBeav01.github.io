var lastTime = 0;
var gold = 0;
var workers = 0;
var isNewPlayer = true;
var s;
var GPT = 0;
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
  if(ticks%60 === 0) {
    console.log("Tick");
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
   
    }
  console.log(displayGold);

  checkCosts(displayGold);
  adjustLabel("ManualGoldButton", "Gold: " + displayGold);
  adjustLabel("TS2","Current time: " + getDate());
  adjustLabel("UL1_label","Workers: " + workers);
  unlockHandler();
}
function updateGoldValues() {
  if(save.workersUnlocked){
    // console.log("Save gold: " + save.gold + " Local gold: " + gold);
    // save.gold = Math.floor(Number.parseInt(save.gold) + GPS);
    // gold = save.gold;
  }
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
    adjustLabel("UL1_label", "Workers: " + workers + " (" + GPT + " gold per second)");
  }
  console.log(save.workers + " | " + cost);
}
