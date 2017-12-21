var UL1 = false;
function unlockHandler() {
    if((gold > 25 || save.gold > 25) && !save.workersUnlocked)  {
        workers = 0;
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
    }
    return am;
}

function checkCosts(costToCheck) {
    var button = document.getElementById("UL1");
    var cost = CalculateCost("worker", save.gold, workers);
    if(costToCheck < cost) {
        button.disabled = true;
    }
    else {
        button.disabled = false;
    }
}
function unlockWorker() {
    console.log("Unlocking workers: " + save.workers + "workers");
    GPS = save.workers;
    save.workersUnlocked = true;
    var worker_button = document.getElementById("UL1");
    var worker_label = document.getElementById("UL1_label");
    adjustLabel("UL1_label", "Workers: " + save.workers);
    worker_button.style.visibility = "visible";
    worker_label.style.visibility = "visible";
}