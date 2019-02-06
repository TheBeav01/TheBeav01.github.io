var story = 0;
var UL1 = false;
var canAscend;
class Upgrade {
    constructor(name, amt) {
        this.name = name;
        this.amt = amt;
    }
}

class UpgradeProto {
    constructor(name, cost, ID, B_ID, isPicked = false) {

        this.name = name;
        this.cost = cost;
        this.ID = ID;
        this.B_ID = B_ID;
        this.isPicked = isPicked;
    }
    flag() {
        isPicked = true;
    }
}
/**
 * Handles unlocks at load or update.
 */
function unlockHandler() {
    var worker_button = document.getElementById("UL1");
    handleStoryMessagesAndUnlocks();
    handleOneTimeUnlocks();
    if ((gold >= 25) && save.upgradesPos == 0) {
        workers = 0;
        UL1 = true;
    }
    else if ((gold >= 25) && worker_button.style.visibility != "visible") {
        unlockWorker(true);
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
    if (resourceToCalculate === "worker") {
        am = Math.floor(25 * Math.pow(1.10, amOwned));
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
    if (costToCheck < cost) {
        button.disabled = true;
    }
    else {
        button.disabled = save.availableWorkers === 0;
    }
}
/**
 * Unlocks the worker
 */
function unlockWorker(fromSave) {
    Log("UL worker");
    if (fromSave == false) {
        Log("Unlocking from natural play");
        addResource(new Resource("Worker", 0, true, 1));
        save.availableWorkers = 10;
        save.maxWorkers = 10;
        workers = 0;
    }
    else {
        let index = res_GetIndexOfResFromSave("Worker");
        if (index === -1) {
            addResource(new Resource("Worker", 0, true, 1));
        }
        else {
            workers = save.resourcesOwned[index].amt;
        }
    }
    if (save.maxWorkers === 0) {
        Log("max workers at 0");
        save.maxWorkers = 10;

    }

    save.workersRecieved = workers;

    lay_init(0);
}


function handleOneTimeUnlocks() {
    if (save.worldNum === 0) {

        if (save.upgradesPos === 0) {
            if (gold < 25) {
                var T2 = document.getElementById("Right_Panel");
                document.getElementById("UL1").style.visibility = "hidden";
                document.getElementById("UL1_label").style.visibility = "hidden";
                T2.visibility = "hidden";
            }
            else {
                UL1 = true;
                unlockWorker(true);
                lay_init(0);
                save.upgradesPos++;
            }

        }
        else {
            if (UL1 == false) {
                UL1 = true;
                unlockWorker(true);
                lay_init(0);
            }
        }
        if (gold > 500) {
            let costArr = new Array();
            costArr.push(new Upgrade("Gold", 500));
            var upg = new UpgradeProto(WORK_EFF, costArr, 0, WORK_EFF_ID, false);
            createUpgrade(WORK_EFF, WORK_EFF_ID, upg);
            costArr.pop;
            // save.upgradesPos++;
        }
        if (gold > 1500) {
            var costArr = new Array();
            costArr.push(new Upgrade("Gold", 2000));
            var upg = new UpgradeProto(WORK_EFF, costArr, 1, WORK_EFF_ID, false);
            createUpgrade(WORK_EFF, WORK_EFF_ID, upg);
            costArr.pop;
        }
    }
}

function deductResources(array) {
    let cost = array.cost;
    for (let i = 0; i < cost.length; i++) {
        let listElem = resourceList[findResource(cost[i].name)];
        let amount = cost[i].amt;
        setResource(listElem.name, listElem.amt - amount);
    }
}

function handleStoryMessagesAndUnlocks() {
    story = save.storyPos;
    if (story >= 6 && selectedTab == 3) {
        document.getElementById("T3_1").style.display = "inline-block";
        document.getElementById("T3_2").style.display = "inline-block";
    }
    else {
        document.getElementById("T3_1").style.display = "none";
        document.getElementById("T3_2").style.display = "none";

    }
    if (story >= 8 && !canAscend) {
        canAscend = true;
    }
    if (gold == 0 && story == 0) {
        story++;
        displayStoryMessage(getStory(1), "Story"); //IN STRINGS.JS
    }
    if (gold == 1 && story == 1) {
        displayStoryMessage(getStory(2), "Story");
        story++;
    }
    if (gold == 25 && story == 2) {
        displayStoryMessage(getStory(3), "Story");
        story++;
        unlockWorker(false);
    }
    if (gold >= KR1_TRIGGER_THRESHOLD && story == 3) {
        story++;

        displayStoryMessage(getStory(4), "Story");
        //TODO: create these as items.
        addResource(new Resource("Bag of Holding", 1, false, 0));
        addResource(new Resource("The Chronometer", 1, false, 0));
        addResource(new Resource("Mysterious Sphere", 1, false, 0));
    }
    if (gold >= T2_THRESHOLD && story == 4) {
        displayStoryMessage(getStory(5));
        story++;
    }
    if (gold >= T3_THRESHOLD && story == 5) {
        displayStoryMessage(getStory(6))
        story++;
    }
    if (gold >= T4_THRESHOLD && story == 6) {
        displayStoryMessage(getStory(7))
        story++;
    }
    if (gold >= T5_THRESHOLD && story == 7) {
        displayStoryMessage(getStory(8))
        story++;
    }
    if (gold >= FIRST_ASC_THRESHOLD && story == 8) {
        displayStoryMessage(getStory(9));
        pause();
        showTab(3);
        canAscend = true;
        story++;
    }
    save.storyPos = story;
}
