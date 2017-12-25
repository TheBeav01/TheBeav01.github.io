var lastTime = 0;
var gold = 0;
var workers = 0;
var isNewPlayer = true;
var s;
var GPT = 0;
var GPS = 0;
var ticks = 0;
var version = "0.01";
var goldGenMultiplier = 1.05;
var wGPS= 0;
/**
 * Loads the game. Is the first function called.
 */
function load() {
  var cookieSaveString = cookieExists("save");
  Log(cookieSaveString);
  if(cookieExists("save") != "") {
    Log("Save file exists");
    decodeSave(cookieSaveString);
    initGame(); //This is in Utils.js
    // SaveGame();
  }
  else {
    Log("Save file does not exist. Creating...");
    setCookie("save",gold.toString(),365);  
  }
  adjustLabel("ManualGoldButton", "Gold: " + save.gold);
  gameLoop(lastTime);
}
/**
 * Adds 1 gold per click.
 */
function recieveGold() {
  if(save.gold === undefined) {
    Log("Undefined?");
  }
  gold = save.gold;
  save.gold++;
  gold++;
  Log("SG: " + save.gold + " Gold: " + gold);
}
/**
 * The loop of this game. This runs via requestAnimationFrame(), 
 * and a tick counter is kept for timekeeping purposes. It should run at 60 ticks per second
 * @param {*} timeStamp Is the time that the frame was requested (in ms.)
 */
function gameLoop(timeStamp) {
  ticks++;
  var dt = timeStamp - lastTime;
  var roundDt = Math.round(dt);
  update(ticks);
  requestAnimationFrame(gameLoop)
  }
  /**
   * Updates what is on the screen and what is in the backend. 
   */
function update(ticks) {
  if(ticks%60 === 0) {
    // Log("Tick");

  }
  if(gold === NaN || gold === undefined) {
    Log("Setting gold to 0");
    gold = 0;
  }
  if(save.workers >= 0) {
    var finGoldGenMultiplier = save.workersInField*goldGenMultiplier;
    var wGPS = finGoldGenMultiplier;
    workers = save.workers;
    GPS = (save.workersInField*finGoldGenMultiplier) + workers;
    GPT = GPS/60;
    var parsedFloatSG = Number.parseFloat(save.gold);
    parsedFloatSG += GPT;
    save.gold = parsedFloatSG;
    var displayGold = Number.parseInt(save.gold);
    gold = displayGold; 
    var nextString = displayGold + "/" + CalculateCost("worker", save.gold, save.workersRecieved);

    checkCosts(displayGold);

    adjustLabel("ManualGoldButton", "Gold: " + displayGold);
    adjustLabel("UL1_label", "Workers: " + save.workers + " (" + GPS + " GPS) " + nextString);
    adjustLabel("T1_2", "Percentage chance of generation: " + getGenChance(save.availableWorkers));
    if(ticks%60 === 0) {
      var ranNumber = Math.random();
      genWorker(ranNumber);
    }
    }
  else {
    adjustLabel("ManualGoldButton", "Gold: " + save.gold);
  }
  adjustLabel("TS2","Current time: " + getDate());
 
  unlockHandler();
}
/**
 * Calculates the cost, then hires a worker if you have enough gold. Workers give a flat +1 GPS bonus.
 */
function hireWorker() {
  var cost = CalculateCost("worker", save.gold, save.workersRecieved);
  if(cost > save.gold) {
    Log("Too expensive!");
    return;
  }
  else if(save.availableWorkers === 0) {
    return;
  }
  else {
    save.gold -= cost;
    workers++;
    save.workersRecieved++;
    GPS = workers + save.workersInField*goldGenMultiplier;
    GPT = GPS/60;
    save.workers = workers;
    save.availableWorkers--;
    adjustLabel("UL1_label", "Workers: " + save.workers + " (" + GPS + " gold per second)");
    adjustLabel("T1_1","Town info: " + save.availableWorkers + " available workers (Max: " + save.maxWorkers + ")")
  }
  Log(save.workers + " | " + cost);
}
function deductWorkers(opCode) {
  if(save.workers === 0) {
    return;
  }
  save.workers--;
  GPS--;
  var nextString = Number.parseInt(save.gold) + "/" + CalculateCost("worker", save.gold, save.workersRecieved);
  Log(nextString);
  if(save.workers === 0) {
    adjustLabel("UL1_label", "Workers: " + save.workers + " (" + GPS + " gold per second) " + nextString);
    save.gold = Number.parseInt(save.gold);
  }
  switch(opCode) {
    case 0:
      save.workersInField++;
      var finGoldGenMultiplier = save.workersInField*goldGenMultiplier;
      Log(finGoldGenMultiplier + " | " + save.workers);
      GPS = workers + save.workersInField*finGoldGenMultiplier;
      adjustLabel("T2_1L", "Committed workers: " + save.workersInField);

      break;
    case 1:
    adjustLabel("T2_2L", "Committed workers: " + save.workersInField);
      break;
    default:
      Log("Something went wrong?");
  }
}