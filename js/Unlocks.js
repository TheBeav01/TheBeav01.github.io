var story = 0;
var UL1 = false;
let TRIGGER_THRESHOLD = 500;
/**
 * Handles unlocks at load or update.
 */
function unlockHandler() {
    var worker_button = document.getElementById("UL1");
    handleStoryMessagesAndUnlocks();
    if((gold >= 25) && save.storyPos < 3)  {
        workers = 0;
        UL1 = true;
        Log("Unlocking workers");
    }
    else if((gold >= 25) && worker_button.style.visibility != "visible") {
        unlockWorker(save);
    }
}
/**
 * calculates the cost of a specific resource given how many of that you already own.
 * @param {*} resourceToCalculate The resource to calculate
 * @param {*} resourceGiven The resource that is used up in the process
 * @param {*} amOwned The amount of resources owned
 */
function CalculateCost(resourceToCalculate, amOwned) {
    var am = 0;
    if(resourceToCalculate === "worker") {
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
    var cost = CalculateCost("worker", save.workersRecieved);
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
    if(fromSave === 0) {
        Log("Unlocking from natural play");
        addResource(new Resource("Worker",0,false,false,true,0));        
        save.availableWorkers = 10;
        save.maxWorkers = 10;
        workers = 0;
    }
    if(save.maxWorkers === 0) {
        Log("max workers at 0");
        save.maxWorkers = 10;

    }
    if(fromSave > 0) {
        let index = res_GetIndexOfResFromSave("Worker");
        workers = save.resourcesOwned[index].amt;
    }
    save.workersRecieved = workers;

    lay_init(0);
}

function handleStoryMessagesAndUnlocks() {
    story = save.storyPos;
    if(gold == 0 && story == 0) {
        story++;
        displayStoryMessage("You gaze outside of the tower you call home. A gentle breeze"
        + " flutters through the window, displacing your royal robe. You feel... poor and pennnyless, though"
        + " you have a whole kingdom to run. Something will get you out of this state..."
        ,"Story");
        }
    if(gold == 1  && story == 1) {
        displayStoryMessage("You extend your hand out and concentrate for a moment. A gold coin"
        + " appears in the palm of your hand. Though plain, the coin's size and shape make it suitable"
        + " to use for purchasing things."
        ,"Story");
        story++;
    }
    if(gold == 25 && story == 2) {
        displayStoryMessage("You call for one of your aides. A mere moment passes before they head into your room."
        + " You place the gold coins in their hand and tell them to get more. They do your bidding. They always do your bidding."
        + "\n\rWorkers unlocked!"
        ,"Story");
        story++;
        unlockWorker(0);
    }
    if(gold >= TRIGGER_THRESHOLD && story == 3) {
        story++;
        //TODO: create these as items.

        Log("Create the leather bag, the mysterious sphere, and the chronometer as resources");
        displayStoryMessage("You curse under your breath as the golden coins tumble to the floor."
        + " One of your workers produces a leather bag, your own, in fact. Before you could ask"
        + " where they found it, they head out of your room. At least they found it!\n\n"
        + "Obtained:\n1x Bag of holding\n1x Chronometer (Inside)\n1x Mysterious red sphere"
        ,"Story");
        addResource(new Resource("Bag of Holding",1,false,false,false,0));
        addResource(new Resource("The Chronometer",1,false,false,false,0));
        addResource(new Resource("Mysterious Sphere",1,false,false,false));

    }
    save.storyPos = story;
}