
class Resource {
    constructor(name, amt, isGeneratable, isFindable, removeOnAscent, genPerSecond, isPrimary = false) {
    this.name = name;
    this.amt = amt;
    this.isGeneratable = isGeneratable;
    this.isFindable = isFindable;
    this.removeOnAscent = removeOnAscent;
    this.genPerSecond = genPerSecond;
    this.isPrimary = isPrimary;
    }

}
function addResource(resource) {
    Log("Finding resource " + resource.name);
    if(findResource(resource.name) == -1) {
        resourceList.push(resource);
        Log("Added resource");
    }
    save.resourcesOwned = resourceList;
}

function findResource(toFind) {
    if(resourceList.length == 0) {
        return -1;
    }
    for(var i = 0; i<resourceList.length;i++) {
        var name = resourceList[i].name;
        if(name == undefined) {
            Log("Undef at " + i);
            resourceList.splice(i,1);
        }
        if(name.toLowerCase() === toFind.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

function incrementResource(name, amt) {
    let index = findResource(name);
    if(index == -1) {
        
    }
    else {
        resourceList[index].amt += amt;
    }
}

function setResource(name, amt) {
    let index = findResource(name);
    if(index != -1) {
        resourceList[index].amt = amt; 
    }
    else {
    }
}

function getResourceAmt(name) {
    let index = findResource(name);
    if(index == -1) {
        return undefined;
    }
    else {
        Log(resourceList[index].amt);
        return resourceList[index].amt;
    }
}

function initResources() {
    resourceList = save.resourcesOwned;
    if(findResource("Gold") == -1) {
        resourceList.push(new Resource("Gold",gold,true,true,true,0,true));
        save.resourcesOwned = resourceList;
      }
}

function res_GetIndexOfResFromSave(res) {
    for(let i=0;i<save.resourcesOwned.length;i++) {
        if(res.toLowerCase() === save.resourcesOwned[i].name.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

// function createResObjs(save) {
//     var objectArray;
//     var slicedObj;
//     Log("Creating resource objects from save...");
//     for(props in save) {
//         if(props==="resourcesOwned") {
//             var str = JSON.stringify(save[props]);
//             Log("JSON string: " + str);
//             if(str[1] !== '[') {
//                 Log("No more parsing?");
//                 slicedObj = str;
//             }
//             else {
//                 slicedObj = str.slice(str.indexOf('[')+1,str.lastIndexOf(']'));
//             }
//             objectArray = JSON.parse(slicedObj);
//             Log("Found the right property. Sliced: " + slicedObj);
//             Log("Array size: " + objectArray.length);

//          }
//     }

//     for(var i=0;i<objectArray.length;i++) {
//         Log(resourceList);
//         addResource(objectArray[i]);
//         Log("Index " + i + " " + JSON.stringify(resourceList[i]));
//     }

// }
