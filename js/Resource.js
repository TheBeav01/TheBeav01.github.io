
class Resource {
    constructor(name, amt, isGeneratable, isFindable, removeOnAscent, genPerSecond) {
    this.name = name;
    this.amt = amt;
    this.isGeneratable = isGeneratable;
    this.isFindable = isFindable;
    this.removeOnAscent = removeOnAscent;
    this.genPerSecond = genPerSecond;
    }
}
function addResource(resource) {
    resourceList.push(resource);
    Log("Added resource");
    Log(resourceList);
    save.resourcesOwned = resourceList;
}

function findResource(name) {
    if(resourceList.indexOf(name,0) > -1) {
        Log("Ayy found resource");
    }
    else {
        Log("Oh?");
        Log(resourceList.indexOf(name,0));
    }
}

function printList() {
    Log(resourceList);
}

function createResObjs(save) {
    var obj2;
    for(props in save) {
        if(props==="resourcesOwned") {
            var str = JSON.stringify(save[props]);
            var slicedObj = str.slice(str.indexOf('[')+1,str.lastIndexOf(']'));
            var obj = JSON.parse(slicedObj);
            
            obj2 = obj[0];
         }
    }
    window.alert(obj2.name); //AAAAAAAAAAA

}
