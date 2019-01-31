var lastTime = 0;
var gold = 0;
var goldRes = undefined;
var workers = 0;
var isNewPlayer = true;
var GPT = 0;
var GPS = 0;
var ticks = 0;
var version = "0.01.05";
var goldGenMultiplier = 1.05;
var wGPS = 0; //Worker gold per second
var segment = -1;
var resourceList = [];
/**
 * Loads the game. Is the first function called.
 */
function load() {
  var cookieSaveString = cookieExists("save");
  setVersion();

  if(cookieExists("save") != "") {
    Log("Save file exists");
    decodeSave(cookieSaveString);
    Log(save.resourcesOwned);

    initGame(); //This is in Utils.js
    initResources();

  }
  else {
    Log("Save file does not exist. Creating...");
    setCookie("save",gold.toString(),365);
    goldRes = new Resource("Gold",0,true,true,true,0);
    addResource(goldRes);
    Log(resourceList);
    SaveGame();
  }
  adjustLabel("ManualGoldButton", "Gold: " + gold);
  gameLoop(lastTime);
}
/**
 * Adds 1 gold per click.
 */
function recieveGold() {
  if(gold === undefined) {
    Log("Undefined?");
  }
  if(findResource("Gold") == -1) {
    resourceList.push(new Resource("Gold",gold,true,true,true,0,true));
    save.resourcesOwned = resourceList;
  }
  incrementResource("Gold",1);
  gold = getResourceAmt("Gold");
}

/**
 * The loop of this game. This runs via requestAnimationFrame(), 
 * and a tick counter is kept for timekeeping purposes. It should run at 60 ticks per second
 * @param {*} timeStamp Is the time that the frame was requested (in ms.)
 */
function gameLoop(timeStamp) {
  ticks++;
  update(ticks);
  requestAnimationFrame(gameLoop)
  }
  /**
   * Updates what is on the screen and what is in the backend. 
   */
function update(ticks) {
  
  if(gold === NaN || gold === undefined) {
    Log("Setting gold to 0");
    gold = 0;
  }
  if(save.workersRecieved > 0) {
    if(workers > 0) {
      document.getElementById("T2_1B").disabled = false;
      document.getElementById("T2_2B").disabled = false;
    }
    else {
      document.getElementById("T2_1B").disabled = true;
      document.getElementById("T2_2B").disabled = true;
    }
    wGPS = getWorkerGoldPerSecond();
    GPS = wGPS; //Plus anything else!
    GPT = GPS/60;
    gold += GPT;
    var displayGold = Number.parseInt(gold);
    var nextString = displayGold + "/" + CalculateCost("worker",save.workersRecieved);
    setResource("Gold",displayGold);
    checkCosts(displayGold);
    adjustLabel("ManualGoldButton", "Gold: " + displayGold);
    adjustLabel("UL1_label", "Workers: " + workers + " (" + GPS + " GPS) " + nextString);
    adjustLabel("T1_2", "Percentage chance of generation: " + getGenChance(save.availableWorkers));
    if(ticks%60 === 0) {
      var ranNumber = Math.random();
      genWorker(ranNumber);
    }
    if(ticks%3600 == 0) {
      SaveGame();
      Log("Game saved!");
    }
    }
  else {
    adjustLabel("ManualGoldButton", "Gold: " + gold);
    document.getElementById("T2_1B").disabled = true;
    document.getElementById("T2_2B").disabled = true;

  }
  adjustLabel("TS2","Current time: " + getDate());

  unlockHandler();
  adjustButtons();
  checkCosts(displayGold);

}
/**
 * Calculates the cost, then hires a worker if you have enough gold. Workers give a flat +1 GPS bonus.
 */
function hireWorker() {
  Log("G: " + Number.parseInt(gold) + " resource " + getResourceAmt("Gold"));
  var cost = CalculateCost("worker", save.workersRecieved);
  if(cost > gold) {
    return;
  }
  else if(save.availableWorkers === 0) {
    return;
  }
  else {
    gold -= cost;
    setResource("Gold",Number.parseInt(gold));
    workers++;
    save.workersRecieved++;
    incrementResource("Worker",1);
    GPS = Number.parseInt(workers)*wGPS;
    GPT = GPS/60;
    workers = getResourceAmt("Worker");
    save.availableWorkers--;
    adjustLabel("UL1_label", "Workers: " + getResourceAmt("Worker") + " (" + GPS + " gold per second)");
    adjustLabel("T1_1","Town info: " + save.availableWorkers + " available workers (Max: " + save.maxWorkers + ")")
  }
}
function deductWorkers(opCode) {
  if(getResourceAmt("Worker") === 0 ) {
    Log("Returning");
    return;
  }
  GPS--;
  incrementResource("Worker",-1);
  var nextString = Number.parseInt(gold) + "/" + CalculateCost("worker", save.workersRecieved);
  if(workers === 0) {
    adjustLabel("UL1_label", "Workers: " + workers + " (" + GPS + " gold per second) " + nextString);
    gold = Number.parseInt(gold);
  }
  switch(opCode) {
    case 0:
      save.workersInField++;
      workers--;
      var finGoldGenMultiplier = Math.pow(goldGenMultiplier,save.workersInField).toPrecision(5);
      wGPS = finGoldGenMultiplier;
      GPS = Number.parseInt(workers)*wGPS;

      editTooltip("T2_1B","This increases the gold that workers give per second. Workers working: " + save.workersInField);
      break;
    case 1:
      save.workersRecruiting++;
      workers--;
      var cm = getChanceMod() + 0.01;
      setChanceMod(cm);

      editTooltip("T2_2B","This increases the chance of workers appearing. Workers working: " + save.workersRecruiting);
      break;
    default:
      Log("Something went wrong?");
      break;
  }
}