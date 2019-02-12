UPS = 1;
var chanceMod = 0.0;
/**
 * Helper method that edits a given HTML label's inner text.
 * @param {*} ID The HTML ID
 * @param {*} newLabel What label you want to assign it.
 */
function adjustLabel(ID, newLabel) {
  document.getElementById(ID).innerHTML = newLabel;
}

function editTooltip(ID, newTooltip) {
  document.getElementById(ID).title = newTooltip;
}


function Log(string) {
  console.log(getDate() + " " + string);
}
/**
 * Helper method used on load that checks if a cookie with that name exists.
 * @param {*} cookieName 
 */
function cookieExists(cookieName) {
  var cookieN = cookieName + "=";
  var cookieList = decodeURIComponent(document.cookie);
  var cookieArr = cookieList.split(";");
  for (var x = 0; x < cookieArr.length; x++) {
    var particularC = cookieArr[x];
    var nameArr = particularC.split("=");
    var name = nameArr[0];
    if (name.charAt(0) == " ") {
      name = name.substring(1);
    }
    if (name.indexOf(cookieName) == 0) {
      return nameArr[1];
    }

  }
  return "";
}
/**
 * Sets a cookie in the browser
 * @param {*} cookieName The cookie name
 * @param {*} cookieValue THe value of the cookie
 * @param {*} expiresAt How many days it will take for it to expire.
 */
function setCookie(cookieName, cookieValue, expiresAt) {
  var date = new Date();
  date.setTime(date.getTime() + (expiresAt * 1000 * 60 * 60 * 24));
  var expires = "expires=" + date.toUTCString();
  Log("Cookie expires at: " + expires);
  document.cookie = cookieName + "=" + cookieValue + "; " + expires + "; path=/";
}

/**
 * Initializes the game
 */
function initGame() {
  var date = new Date();
  showTab(1);
  resizeTabs();
  var index = res_GetIndexOfResFromSave("Gold");
  if (save.resourcesOwned[index].amt === undefined) {
    gold = 0;
    save.resourcesOwned[index].amt = 0;
  }
  if(getShardAmt() > 0) {
    Log("Shards!");
    createResourceInfoLabel("You have: " + getShardAmt() + " shards. This gives you a " + getSimpleShardBonusStr() 
    + "x increase in gold","T1_3");
    createResourceInfoLabel(goldToShardString(), "T1_3_AMT")
    Log(getGoldToNextShard());
    FL_DSTEXT = true;
  }
  gold = save.resourcesOwned[index].amt;

  adjustLabel("ManualGoldButton", Math.floor(gold));
  workers = getResourceAmt("Worker");
  adjustLabel("TS2", "Current Time: " + getDate());
  adjustLabel("UL1_label", "Workers: " + getResourceAmt("Worker"));
  adjustUpgradeTooltips();
  unlockHandler();
}

/**
 * Returns a date string in hh:mm:ss format.
 */
function getDate() {
  var date = new Date();
  var dateStr = date.toTimeString().substring(0, 9);
  return dateStr;
}

function setVersion() {
  save.gameVersion = version;
  adjustLabel("TS1", "Game version: " + save.gameVersion);
}

/**
 * Returns the percentage chance to generate a new possible worker per second. Starts at 0 and scales
 * up as available workers decrease
 * @param {*} worker 
 */
function getGenChance(worker) {
  var chance = Math.pow(save.maxWorkers - save.availableWorkers, 1 / 2) / 2;
  var adjChance = Number.parseFloat(chance);
  var adjMod = Number.parseFloat(chanceMod);
  chance = (adjChance + adjMod).toPrecision(3);
  if (chance === NaN) {
    chance = 0;
  }
  return chance;
}

function setChanceMod(newMod) {
  if (newMod >= 1 || newMod < 0) {
    return;
  }
  chanceMod = newMod;
}
function getChanceMod() {
  return chanceMod;
}
/**
 * Returns true if a worker is generated on this tick
 * @param {*} number NOTE: This number needs to be between 0 and 1. Random numbers are used.
 */
function genWorker(number) {
  if (save.availableWorkers === save.maxWorkers) {
    return;
  }
  var chance = getGenChance(save.availableWorkers) / 10;
  if (number > chance) {
  }
  else {
    Log("Worker generated");
    WK_GEN_FLG = 1;
    save.availableWorkers++;

  }
}
function getWorkerGoldPerSecond() {
  var multiplier = Number.parseFloat(getResourceParam("Worker", "effectMult"));
  var shardEff = Number.parseFloat(getResourceParam("Worker","shardAffinity"));
  if (save.workersInField === 0) {
    let x = workers * multiplier + (getShardAmt() * save.darkShardEffectiveness * shardEff);
    return workers * multiplier + (getShardAmt() * save.darkShardEffectiveness * shardEff);
  }
  else {

    return (Math.pow(goldGenMultiplier, save.workersInField) * workers * multiplier
    + (getShardAmt() * save.darkShardEffectiveness * shardEff)).toPrecision(3);
  }
}

function adjustButtons() {
  if (isPaused) {
    return;
  }
  var div = document.getElementById("RightSide");
  var divChildren = div.children;
  for (let i = 0; i < div.childElementCount; i++) {
    if (divChildren[i].tagName === "BUTTON") {
      var costArr = JSON.parse(divChildren[i].getAttribute("upg"));
      for (let j = 0; j < costArr.cost.length; j++) {
        var cost = costArr.cost[j].amt;

        if (cost >= resourceList[findResource(costArr.cost[j].name)].amt) {
          divChildren[i].disabled = true;
        }
        else {
          divChildren[i].disabled = false;
        }
      }
    }
  }
  if (save.availableWorkers == 0) {
    var workerButton = document.getElementById("UL1");
    workerButton.disabled = true;
  }
  else {
    var workerButton = document.getElementById("UL1");
    workerButton.disabled = false;
  }
}
function printCookie() {
  Log(cookie);
}

//TODO: Balance shennanigans
function simulateShardCost(fromShard, fromGold, spread) {
  for(let i = 0; i < spread; i++) {
    let GTNS = Math.floor((Math.pow(1.5,fromShard+i)*BASE_GLD_AMT) - fromGold);
    Log("SIMULATED: Shard number: " + Number.parseInt(1+fromShard+i) + " Gold: " + GTNS);
  }
}