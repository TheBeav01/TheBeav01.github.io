var lastTime = 0;
var gold = 0;
var workers = 0;
var isNewPlayer = true;
var s;
var GPT = 0;
var GPS = 0;
var ticks = 0;
var version = "0.02.0";
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
  
  //Just in case anything needs to fire once a second
  if(ticks%60 === 0) {
    // Log("Tick");
  }
  if(gold === NaN || gold === undefined) {
    Log("Setting gold to 0");
    gold = 0;
  }
  if(save.workersRecieved > 0) {
    if(save.workers > 0) {
      document.getElementById("T2_1B").disabled = false;
      document.getElementById("T2_2B").disabled = false;
    }
    else {
      document.getElementById("T2_1B").disabled = true;
      document.getElementById("T2_2B").disabled = true;
    }
    workers = save.workers;
    wGPS = getWorkerGoldPerSecond();
    GPS = wGPS; //Plus anything else!
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
    GPS = Number.parseInt(workers)*wGPS;
    GPT = GPS/60;
    save.workers = workers;
    save.availableWorkers--;
    adjustLabel("UL1_label", "Workers: " + save.workers + " (" + GPS + " gold per second)");
    adjustLabel("T1_1","Town info: " + save.availableWorkers + " available workers (Max: " + save.maxWorkers + ")")
  }
}
function deductWorkers(opCode) {
  if(save.workers === 0 ) {
    Log("Returning");
    return;
  }
  var Field = document.getElementById("T2_1B");
  var Recruit = document.getElementById("T2_2B");
 
  save.workers--;
  GPS--;
  var nextString = Number.parseInt(save.gold) + "/" + CalculateCost("worker", save.gold, save.workersRecieved);
  if(save.workers === 0) {
    adjustLabel("UL1_label", "Workers: " + save.workers + " (" + GPS + " gold per second) " + nextString);
    save.gold = Number.parseInt(save.gold);
  }
  switch(opCode) {
    case 0:
      save.workersInField++;
      workers--;
      var finGoldGenMultiplier = Math.pow(goldGenMultiplier,save.workersInField).toPrecision(5);
      wGPS = finGoldGenMultiplier;
      GPS = Number.parseInt(workers)*wGPS;
      adjustLabel("T2_1L", "Committed workers: " + save.workersInField);

      break;
    case 1:
      save.workersRecruiting++;
      var cm = getChanceMod() + 0.01;
      setChanceMod(cm);
      Log("Set chance to " + cm);
      adjustLabel("T2_2L", "Committed workers: " + save.workersRecruiting);
      break;
    default:
      Log("Something went wrong?");
      break;
  }
}