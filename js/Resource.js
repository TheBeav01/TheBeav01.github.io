class Resource {

    /**
     * Any resource is some material good the player comes across, wether it be gold or some key item.
     * @param {String} name The name of the resource
     * @param {Number} amt The amount currently owned
     * @param {Boolean} removeOnAscent Whether
     * @param {Number} shardAffinity How receptive this resource is to the prestige currency.
     * Range: .0 to 1. Any numbers outside of this range will snap to the nearest extreme.
     * @param {Number} genPerSecond The resource initially generates x resources per second. -1 to disable generation
     * @param {Number} genMult A multiplier to the amount generated per second. Default: 1
     * @param {Number} effectMult A multiplier to whatever effect this resource gives. Default: 1
     * @param {Boolean} isPrimary Whether or not the resource is a key one.
     */
    //TODO: KEy items
    constructor(name, amt, removeOnAscent, shardAffinity, genPerSecond = -1,
        genMult = 1, effectMult = 1, isPrimary = false) {

        //CW: Really bad code
        if (name !== undefined && name.hasOwnProperty("name")) {
            Object.assign(this, name);
            return;
        }
        this.name = name;
        this.amt = amt;
        this.removeOnAscent = removeOnAscent;
        this.genPerSecond = genPerSecond;
        this.isPrimary = isPrimary;
        this.genMult = genMult;
        this.effectMult = effectMult;
        this.shardAffinity = shardAffinity;
    }

}
/**
 * Adds a resource to the save list. Ensures that there are no duplicates.
 * @param {Resource} resource The resource to add to the save list
 */
function addResource(resource) {
    Log("Finding resource " + resource.name);
    if (findResource(resource.name) == -1) {
        resourceList.push(resource);
        Log("Added resource");
    }
    save.resourcesOwned = resourceList;
}

/**
 * Finds a specified resource in the save file by name. Returns the index. -1 if not found
 * @param {Resource} toFind The resource to look for
 */
function findResource(toFind) {
    if (resourceList.length == 0) {
        return -1;
    }
    for (var i = 0; i < resourceList.length; i++) {
        var name = resourceList[i].name;
        if (name == undefined) {
            Log("Undef at " + i);
            resourceList.splice(i, 1);
        }
        if (name.toLowerCase() === toFind.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

/**
 * Looks for a specified resource in the save file. Returns -1 if not found. Otherwise, it returns the index
 * the resource was found in.
 * @param {Resource} toFind The reosurce to find.
 */
function findResourceInSave(toFind) {
    if (save.resourcesOwned.length == 0) {
        return -1;
    }
    for (var i = 0; i < save.resourcesOwned.length; i++) {
        var name = save.resourcesOwned[i].name;
        if (name == undefined) {
            Log("Undef at " + i);
            save.resourcesOwned.splice(i, 1);
        }
        if (name.toLowerCase() === toFind.toLowerCase()) {
            return i;
        }
    }
    return -1;
}
/**
 * Looks through the local resource list and returns a new resource object.
 * @param {Resource} toFind Resource to look for
 */
function getResourceAsObj(toFind) {
    return new Resource(resourceList[findResource(toFind)]);
}

/**
 * Adds or subtracts a specified number from a specified resource name. This uses the local resource list.
 * @param {String} name The name of the resource to look for.
 * @param {Number} amt The amount of resource you want to add or subtract.
 */
function incrementResource(name, amt) {
    let index = findResource(name);
    if (index == -1) {

    }
    else {
        resourceList[index].amt += amt;
    }
}

/**
 * Searches for a resource by name and sets the amount to what's specified.
 * @param {String} name The name of the resource.
 * @param {Number} amt The non-zero amount to set the resource to.
 */
function setResource(name, amt) {
    if(amt < 1) {
        return;
    } 
    let index = findResource(name);
    if (index != -1) {
        resourceList[index].amt = amt;
    }
}

/**
 * Searches through the local resource list and returns the amount of a specified resource.
 * @param {String} name Name to search for
 */
function getResourceAmt(name) {
    let index = findResource(name);
    if (index == -1) {
        return undefined;
    }
    else {
        return resourceList[index].amt;
    }
}

/**
 * Searches for the resource within the local resource list and returns the specified parameter. 
 * Returns undefined if not found
 * @param {String} name The name to search for.
 * @param {String} param The parameter to find within the resource itself
 */
function getResourceParam(name, param) {
    let obj = getResourceAsObj(name);

    return obj[param];
}

/**
 * Searches through the local resource list, finds the specifed parameter, 
 * and writes the value to the parameter.
 * @param {String} name The name to search for.
 * @param {String} param The parameter to write to.
 * @param {*} value The value to write to the resource parameter.
 */
function writeResourceParam(name, param, value) {
    let obj = getResourceAsObj(name);
    let index = findResource(name);
    obj[param] = value;
    resourceList[index] = obj;
    return resourceList;
}

/**
 * The main entry point for the game's resources. Currently just adds gold to the list if not found.
 */
function initResources() {
    setWGPS();
    if (findResource("Gold") == -1) {
        resourceList.push(new Resource("Gold", gold, true, 1, 0, 1, 1, true));
        save.resourcesOwned = resourceList;
    }
}

/**
 * Looks through the save's resource list and returns the index. -1 if not found.
 * @param {String} res The name of the resource to find.
 */
function res_GetIndexOfResFromSave(res) {
    for (let i = 0; i < save.resourcesOwned.length; i++) {
        if (res.toLowerCase() === save.resourcesOwned[i].name.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

//SHARDS

/**
 * Returns a simplied form of the shard bonus string used in the first tab.
 */
function getSimpleShardBonusStr() {
    let bonusAmt = getShardAmt() * GOLD_SHD_AFF * save.darkShardEffectiveness;
    return bonusAmt + "";
}

/**
 * Pulls the shard amount from the save. Returns 0 if not found.
 */
function getShardAmt() {
    var amt = Number.parseInt(getResourceAmt("Dark Shard"));
    if(findResourceInSave("Dark Shard") === -1) {
        return 0;
    }
    if(amt == undefined || amt === NaN) {
        Log("Ret 0")
        return 0;
    }
    return Number.parseInt(getResourceAmt("Dark Shard"));
}

/**
 * Gives a shard to the player. Adjusts both the save file and the labels on the screen.
 */
function giveShard() {
    save.resourcesOwned[findResource("Dark Shard")].amt += 1;
    adjustLabelsOnScreen();
}

/**
 * Returns the gold bonus the shards give.
 */
function getShardGoldBonus() {
    if(getShardAmt() == 0) {
        return 1;
    }
    return getShardAmt() * GOLD_SHD_AFF * 1.1;
}

/**
 * Returns the amount of gold to the next shard.
 */
function getGoldToNextShard() {
    var shards = getShardAmt();
    return Math.floor((Math.pow(1+shards,1.25)*BASE_GLD_AMT) - getResourceAmt("Gold"));
}

function setUpgradeFlag(upgrade) {
    for(let i = 0; i < save.unlockedUpgrades.length; i++) {
        if(save.unlockedUpgrades[i].ID === upgrade.ID) {
            save.unlockedUpgrades.isPicked = true;
        }
    }
}
