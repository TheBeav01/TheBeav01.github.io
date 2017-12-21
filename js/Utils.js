UPS = 1;
function adjustLabel(ID,newLabel) {
  document.getElementById(ID).innerHTML = newLabel;
}

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
function setCookie(cookieName, cookieValue, expiresAt) {
  var date = new Date();
  date.setTime(date.getTime() + (expiresAt*1000*60*60*24));
  var expires = "expires=" + date.toUTCString();
  console.log(expires);
  document.cookie = cookieName + "=" + cookieValue + "=" + expires + ";path=/";
}

function initGame() { 
  var date = new Date();
  save.gameVersion = version;
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

function getDate() {
  var date = new Date();
  var dateStr = date.toTimeString().substring(0,9);
  return dateStr;
}