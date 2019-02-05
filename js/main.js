//DECLARE GLOBAL VARS. STRINGS ARE IN STRINGS.JS
var gold = 0; //Global gold value
var workers = 0; //Global worker value. Soon to be obsolete.
var GPT = 0; //Global gold per tick value. 
var GPS = 0; //Global gold per second value, though this is just literally 60*GPT
var ticks = 0; //Global tick counter. Could have issues for really long games without closing window.
var wGPS = 0; //Worker gold per second
var resourceList = []; //Global list of resources. Should be redundant w.r.t save already tracking it.
var upgradesList = []; //Global upgrades list. Should also be redundant w.r.t save already tracking it.
var selectedTab = -1; //Global flag for what tab we have selected on the right side. Could... just not be global
var frameID; //Required global to hold the ID of the requested frame. This is used with pausing and unpausing.
var isPaused; //Are we paused or not? Could hold this somewhere else completely along with other gamestate vars.

//DECLARE GLOBAL CONSTS
const goldGenMultiplier = 1.05; //Global base gold gen multiplier.
const version = "0.02.00"; //Version number.
const KR1_TRIGGER_THRESHOLD = 500; //First key resource threshold
const T2_THRESHOLD = 2500;
const T3_THRESHOLD = 5000;
const T4_THRESHOLD = 7500;
const T5_THRESHOLD = 10000;
const FIRST_ASC_THRESHOLD = 20000;

/**
 * 
 * Loads the game. Is the first function called when you load the page. This loads the save from the save string
 * and applies the string to the game. [MAIN.JS]
 */
function load() {
  var cookieSaveString = cookieExists("save");
  setVersion();

  if(cookieExists("save") != "") {
    Log("Save file exists");
    decodeSave(cookieSaveString);

    initGame(); //This is in Utils.js
    initResources();

  }
  else {
    Log("Save file does not exist. Creating...");
    setCookie("save",gold.toString(),365);
    var goldRes = new Resource("Gold",0,false,1,0,1,1,true);
    addResource(goldRes);
    Log(resourceList);
    SaveGame();
  }
  adjustLabel("ManualGoldButton", "Gold: " + gold);
  gameLoop();
}

/**
 * This pauses the game. Any clickable buttons that interact with resources should be disabled. [MAIN.JS]
 */
function pause() {
  var pause1 = document.getElementsByClassName("T2_L");
  var pause2 = document.getElementsByClassName("T2_R");
  for(let i = 0; i<Math.max(pause1.length,pause2.length);i++) {
    Log("AA");
    if(pause1[i] == undefined) {
      if(pause2[i]==undefined) {
        break;
      }
      pause2[i].disabled = true;

    }
    else {
      pause1[i].disabled = true;
      Log("BB");
    }
}
isPaused = true;
}

/**
 * Unpauses the game.
 */
function start() {
  isPaused = false;
  gameLoop(frameID);
}
/**
 * Adds 1 gold per click.
 */
function recieveGold() {
  if(gold === undefined) {
    Log("Undefined?");
  }
  if(findResource("Gold") == -1) {
    resourceList.push(new Resource("Gold",gold,true,1,0,1,1,true));
    save.resourcesOwned = resourceList;
  }
  incrementResource("Gold",1);
}

/**
 * The loop of this game. This runs via requestAnimationFrame(), 
 * and a tick counter is kept for timekeeping purposes. It should run at 60 ticks per second
 */
function gameLoop() {
  ticks++;
  update(ticks);
  if(isPaused == true) {

    cancelAnimationFrame(frameID);
  }
  else {
    frameID = requestAnimationFrame(gameLoop);
  }
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
    setResource("Gold",Number.parseFloat(getResourceAmt("Gold"))+Number.parseFloat(GPT));
    gold = getResourceAmt("Gold");
    var displayGold = Number.parseInt(getResourceAmt("Gold"));
    var nextString = displayGold + "/" + CalculateCost("worker",save.workersRecieved);
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
    adjustLabel("ManualGoldButton", "Gold: " + Number.parseInt(getResourceAmt("Gold")));
    gold = getResourceAmt("Gold");

    document.getElementById("T2_1B").disabled = true;
    document.getElementById("T2_2B").disabled = true;

  }
  adjustLabel("TS2","Current time: " + getDate());

  unlockHandler();
  adjustButtons();
  checkCosts(displayGold);

}
/**
 * Calculates the cost, then hires a worker if you have enough gold. Could eventually become obsolete.
 */
function hireWorker() {
  var cost = CalculateCost("worker", save.workersRecieved);
  let g = Number.parseInt(getResourceAmt("Gold"));
  Log("Cost: " + cost + " Amt: " + g + " gold: " + gold);
  if(cost > g) {
    return;
  }
  else if(save.availableWorkers === 0) {
    return;
  }
  else {
    setResource("Gold",Number.parseInt(g-cost));
    workers++;
    save.workersRecieved++;
    incrementResource("Worker",1);
    GPS = Number.parseInt(workers)*wGPS;
    GPT = GPS/60;
    workers = getResourceAmt("Worker");
    save.availableWorkers--;
    adjustLabel("UL1_label", "Workers: " + getResourceAmt("Worker") + " (" + GPS + " gold per second)");
    adjustLabel("T1_1","Town info: " + save.availableWorkers + " available workers (Max: " + save.maxWorkers + ")")
    save.workersRecieved = save.workersInField + save.workersRecruiting + Number.parseInt(getResourceAmt("Worker"));

  }
}
/**
 * This removes one worker. Depending on the button clicked, this does one of two things:
 * 1. Gives a bonus to GPS per worker
 * 2. Gives a bonus to the percentage of workers generated.
 * @param {Number} opCode What button you would like to operate on.
 */
function deductWorkers(opCode) {
  if(isPaused) {
    return;
  }
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
  save.workersRecieved = save.workersInField + save.workersRecruiting + Number.parseInt(getResourceAmt("Worker"));
}

function prepMainAscend() {
  Log("Ascending...");
  pause();
  document.getElementById("InnerAscent").style.display = "block";
  var T2 = document.getElementById("Right_Panel");

  T2.style.visibility = "hidden";
}


function confirmAscend() {
  document.getElementById("InnerAscent").style.display = "none";
  var indexesToRemove = new Array();
  for(let i = 0; i<resourceList.length;i++) {
    if(resourceList[i].removeOnAscent === true) {
      indexesToRemove.push(i);
    }
  }
  for(let j=indexesToRemove.length-1;j>=0;j--) {
    setResource("Worker",0);
    resourceList.splice(indexesToRemove[j],1);
    Log("Removed " + j);
  }
  cleanSave();
  start();
}