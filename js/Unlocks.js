var UL1 = false;

/**
 * Handles unlocks at load or update.
 */
function unlockHandler() {
    if((gold > 25 || save.gold > 25) && !save.workersUnlocked)  {
        workers = 0;
        UL1 = true;
        console.log("Unlocking workers");
        unlockWorker();
    }
}
/**
 * calculates the cost of a specific resource given how many of that you already own.
 * @param {*} resourceToCalculate The resource to calculate
 * @param {*} resourceGiven The resource that is used up in the process
 * @param {*} amOwned The amount of resources owned
 */
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

/**
 * Checks the cost of a generic resource
 * @param {*} costToCheck The amount of a resource you already own.
 */
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
/**
 * Unlocks the worker
 */
function unlockWorker(fromSave) {
    console.log("Unlocking workers: " + save.workers + "workers");
    if(fromSave === 0) {
        GPS = save.workers;
    
        save.availableWorkers = 10;
        save.maxWorkers = 10; 
    }
    save.workersUnlocked = true;
    var worker_button = document.getElementById("UL1");
    var worker_label = document.getElementById("UL1_label");
    var T2 = document.getElementById("Right_Panel");
    adjustLabel("UL1_label", "Workers: " + save.workers);
    adjustLabel("T1_1","Town info: " + save.availableWorkers + " available workers (Max: " + save.maxWorkers + ")")
    worker_button.style.visibility = "visible";
    worker_label.style.visibility = "visible";
    T2.style.visibility = "visible";
}