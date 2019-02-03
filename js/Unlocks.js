var story = 0;
var UL1 = false;
var canAscend;
class Upgrade {
    constructor(name, amt) {
        this.name = name;
        this.amt = amt;
    }
}
/**
 * Handles unlocks at load or update.
 */
function unlockHandler() {
    var worker_button = document.getElementById("UL1");
    handleStoryMessagesAndUnlocks();
    handleOneTimeUnlocks();
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
        addResource(new Resource("Worker",0,true,1));        
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
    if(story >= 6 && selectedTab == 3) {
        document.getElementById("T3_1").style.display = "inline-block";
        document.getElementById("T3_2").style.display = "inline-block";
    }
    else {
        document.getElementById("T3_1").style.display = "none";
        document.getElementById("T3_2").style.display = "none";

    }
    if(story >= 8 && !canAscend) {
        canAscend = true;
    }
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
    if(gold >= KR1_TRIGGER_THRESHOLD && story == 3) {
        story++;

        Log("Create the leather bag, the mysterious sphere, and the chronometer as resources");
        displayStoryMessage("You curse under your breath as the golden coins tumble to the floor."
        + " One of your workers produces a leather bag, your own, in fact. Before you could ask"
        + " where they found it, they head out of your room. At least they found it!\n\n"
        + "Obtained: 1x Bag of holding, 1x Chronometer, and 1x Mysterious red sphere"
        ,"Story");
         //TODO: create these as items.
        addResource(new Resource("Bag of Holding",1,false,0));
        addResource(new Resource("The Chronometer",1,false,0));
        addResource(new Resource("Mysterious Sphere",1,false,0));
    }
    if(gold >= T2_THRESHOLD && story == 4) {
        displayStoryMessage("Here you are, gathering all this wealth. You gathered so much, you forget to address the"
        + " strange feeling entering your mind. Something seems to be stirring.");
        story++;
    }
    if(gold >= T3_THRESHOLD && story == 5) {
        displayStoryMessage("By this point, something is seriously wrong. Your gaze turns to the walls bordering"
        + " your city. The wall guards seem to be readying their weapons. Not good.")
        story++;
    }
    if(gold >= T4_THRESHOLD && story == 6) {
        displayStoryMessage("From the distance, you see your wall guards fall. You bark at one of your workers to"
        + " investigate. From here, you can see that arrows pepper their bodies. From the arrowtip, they seem to be of"
        + " human origin. You extend your hand out to get more gold, but a loud boom from the gates reverberates through the city.")
        story++;
    }
    if(gold >= T5_THRESHOLD && story == 7) {
        displayStoryMessage("The invaders enter the city. Instinctively, you turn toward the only source of comfort, only to see"
        + " a fireball tear through the side of the tower you called home. Though the stained glass toward the top was preserved,"
        + " the normal purple glow behind it appears stronger.")
        story++;
    }
    if(gold >= FIRST_ASC_THRESHOLD && story == 8) {
        displayStoryMessage("Two explosions tear through the top of the towers. Two pulses rocket out from the source, moving past the horizon."
        + " You look toward your bag and open it, sticking your hand in. It brushes past something cold that gives you pause"
        + " You pull it out. It appears to be a golden pocketwatch, at least from the outside. When you open it up, a bright glow fills your vision."
        + " Everything stops around you.");
        pause();
        canAscend = true;
        story++;
    }
    save.storyPos = story;
}

function handleOneTimeUnlocks() {
        if(save.worldNum === 0) {
            if(gold > 500 && save.upgradesPos === 0) {
                let costArr = new Array();
                costArr.push(new Upgrade("Gold",500));
                createUpgrade(WORK_EFF,WORK_EFF_ID,costArr);
                costArr.pop;
                save.upgradesPos++;
            }
            if(gold > 1500 && save.upgradesPos === 1) {
                var costArr = new Array();
                costArr.push(new Upgrade("Gold",2000));
                createUpgrade(WORK_EFF,WORK_EFF_ID,costArr);
                save.upgradesPos++;
            }
    }
}

function deductResources(array) {
    for(let i = 0; i < array.length; i++) {
        let listElem = resourceList[findResource(array[i].name)];
        let amount = array[i].amt;
        setResource(listElem.name,listElem.amt-amount);
    }
}