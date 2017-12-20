UPS = 100;
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
  adjustLabel("ManualGoldButton",gold);
}