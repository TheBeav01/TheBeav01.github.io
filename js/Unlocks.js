var UL1 = false;

/**
 * Handles unlocks at load or update.
 */
function unlockHandler() {
    var worker_button = document.getElementById("UL1");

    if((gold > 25 || save.gold > 25) && !save.workersUnlocked)  {
        workers = 0;
        UL1 = true;
        Log("Unlocking workers");
        unlockWorker(0);
    }
    else if((gold > 25 || save.gold > 25) && worker_button.style.visibility != "visible") {
        console.log("AA");
        unlockWorker(save);
    }
    // else if(gold > 25 && save.workersUnlocked) {
    //     save.workersUnlocked = true;
    //     unlockWorker(save);
    // }
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
    var cost = CalculateCost("worker", save.gold, save.workersRecieved);
    // Log("AMOWNED: " + costToCheck +" C: " + cost);
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
    Log("Unlocking workers: " + save.workers + " workers");
    if(fromSave === 0) {
        Log("Unlocking from natural play");
        GPS = save.workers;
    
        save.availableWorkers = 10;
        save.maxWorkers = 10;
    }
    if(save.maxWorkers === 0) {
        Log("max workers at 0");
        save.maxWorkers = 10;
    }
    save.workersUnlocked = true;
    save.workersRecieved = save.workers;
    lay_init(0);
}