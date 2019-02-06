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
function addResource(resource) {
    Log("Finding resource " + resource.name);
    if (findResource(resource.name) == -1) {
        resourceList.push(resource);
        Log("Added resource");
    }
    save.resourcesOwned = resourceList;
}

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
function getResourceAsObj(toFind) {
    return new Resource(resourceList[findResource(toFind)]);
}

function incrementResource(name, amt) {
    let index = findResource(name);
    if (index == -1) {

    }
    else {
        resourceList[index].amt += amt;
    }
}

function setResource(name, amt) {
    let index = findResource(name);
    if (index != -1) {
        resourceList[index].amt = amt;
    }
    else {
        Log("NF");
    }
}

function getResourceAmt(name) {
    let index = findResource(name);
    if (index == -1) {
        return undefined;
    }
    else {
        return resourceList[index].amt;
    }
}

function getResourceParam(name, param) {
    let obj = getResourceAsObj(name);

    return obj[param];
}

function writeResourceParam(name, param, value) {
    let obj = getResourceAsObj(name);
    let index = findResource(name);
    obj[param] = value;
    resourceList[index] = obj;
    return resourceList;
}

function initResources() {
    if (findResource("Gold") == -1) {
        resourceList.push(new Resource("Gold", gold, true, 1, 0, 1, 1, true));
        save.resourcesOwned = resourceList;
    }
}

function res_GetIndexOfResFromSave(res) {
    for (let i = 0; i < save.resourcesOwned.length; i++) {
        if (res.toLowerCase() === save.resourcesOwned[i].name.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

//SHARDS

function getSimpleShardBonusStr() {
    let bonusAmt = getShardAmt() * GOLD_SHD_AFF * save.darkShardEffectiveness;
    return bonusAmt + "";
}
function getShardAmt() {
    var amt = Number.parseInt(getResourceAmt("Dark Shard"));
    if(findResourceInSave("Dark Shard") === -1) {
        return 0;
    }
    Log("Shard: " + amt);
    if(amt == undefined || amt === NaN) {
        Log("Ret 0")
        return 0;
    }
    return Number.parseInt(getResourceAmt("Dark Shard"));
}

function getShardGoldBonus() {
    if(getShardAmt() == 0) {
        return 1;
    }
    return getShardAmt() * GOLD_SHD_AFF * 1.1;
}
