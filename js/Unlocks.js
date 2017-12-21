var UL1 = false;
function unlockHandler() {
    if((gold > 25 || save.gold > 25) && !save.workersUnlocked)  {
        UL1 = true;
        console.log("Unlocking workers");
        unlockWorker();
    }
}

function CalculateCost(resourceToCalculate, resourceGiven, amOwned) {
    var am = 0;
    if(resourceToCalculate === "worker") {
        // am = 25 + Math.floor(4.5*amOwned);
        //TODO: Fix this.
        //NOTE: These numbers are experimental!
        am = Math.floor(25 * Math.pow(1.10,amOwned));
        console.log("Calculated the cost of buying 1 worker when " + amOwned + " exist: " + am);
    }
    return am;
}
function unlockWorker() {
    workers = save.workers;
    save.workersUnlocked = true;
    var worker_button = document.getElementById("UL1");
    var worker_label = document.getElementById("UL1_label");
    worker_button.style.visibility = "visible";
    worker_label.style.visibility = "visible";
}