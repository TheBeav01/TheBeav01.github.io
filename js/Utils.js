UPS = 1;
/**
 * Helper method that edits a given HTML label's inner text.
 * @param {*} ID The HTML ID
 * @param {*} newLabel What label you want to assign it.
 */
function adjustLabel(ID,newLabel) {
  document.getElementById(ID).innerHTML = newLabel;
}

/**
 * Helper method used on load that checks if a cookie with that name exists.
 * @param {*} cookieName 
 */
function cookieExists(cookieName) {
  var cookieN = cookieName+"=";
  var cookieList=decodeURIComponent(document.cookie);
  var cookieArr = cookieList.split(";");
  for(var x = 0; x < cookieArr.length; x++) {
    var particularC = cookieArr[x];
    var nameArr = particularC.split("=");
    var name = nameArr[0];
    if(name.charAt(0) == " ") {
      name = name.substring(1);
    }
    if(name.indexOf(cookieName) == 0) {
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
  date.setTime(date.getTime() + (expiresAt*1000*60*60*24));
  var expires = "expires=" + date.toUTCString();
  console.log(expires);
  document.cookie = cookieName + "=" + cookieValue + "=" + expires + ";path=/";
}

/**
 * Initializes the game
 */
function initGame() { 
  var date = new Date();
  save.gameVersion = version;
  manageTabs(1);
  if(save.gold === undefined) {
    save.gold = 0;
    console.log("SAVE GOLD: " + save.gold);
    gold = 0;
  }
  console.log(save.gold + " | " + save.gameVersion);
  adjustLabel("ManualGoldButton",save.gold);
  gold = save.gold;
  adjustLabel("TS1", "Game version: " + save.gameVersion);
  adjustLabel("TS2", "Current Time: " + getDate());
  adjustLabel("UL1_label", "Workers: " + save.workers);
  unlockHandler();
}

/**
 * Returns a date string in hh:mm:ss format.
 */
function getDate() {
  var date = new Date();
  var dateStr = date.toTimeString().substring(0,9);
  return dateStr;
}

/**
 * Returns the percentage chance to generate a new possible worker per second. Starts at 0 and scales
 * up as available workers decrease
 * @param {*} worker 
 */
function getGenChance(worker) {
 var chance = Math.pow(save.maxWorkers-save.availableWorkers,1/2)/2;
 chance = chance.toPrecision(2);
 if(chance === NaN) {
   console.log("Chance is nan");
   chance = 0;
 }
  return chance;
}
/**
 * Returns true if a worker is generated on this tick
 * @param {*} number NOTE: This number needs to be between 0 and 1. Random numbers are used.
 */
function genWorker(number) {
  if(save.availableWorkers === save.maxWorkers) {
    console.log("At max workers!");
    return;
  }
  var chance = getGenChance(save.availableWorkers) / 10;
  if(number > chance) {
    console.log("Not generated " + number + " " + chance)
  }
  else {
    console.log("generated" + number + " " + chance);
    save.availableWorkers++;
    adjustLabel("T1_1","Town info: " + save.availableWorkers + " available workers (Max: " + save.maxWorkers + ")")

  }
}