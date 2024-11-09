import { addResource, removeResource } from "../../resource/resource-manager.svelte"

export abstract class Resource {
    
    constructor() {
        this.createNew()
    }
    /**
     * The name of the resource
     */
    protected _name = ""
    
    get name() : string {
        return this._name
    }

    set name(name: string) {
        this._name = name
        // this.updateStore()
    }
    /**
     * The description of the resource
     */
    protected _description = ""
    get description() : string {
        return this._description
    }

    set description(description: string) {
        this._description = description
        // this.updateStore()
    }
    /**
     * The amount of the resource
     */
    protected _amt = $state(0)
    get amt() : number {
        return this._amt
    }

    set amt(amt: number) {
        this._amt = amt
        // this.updateStore()
    }
    /**
     * True to remove the resource on ascencion
     */
    protected _removeOnAscent = true
    get removeOnAscent() : boolean {
        return this._removeOnAscent
    }

    set removeOnAscent(removeOnAscent: boolean) {
        this._removeOnAscent = removeOnAscent
        // this.updateStore()
    }
    /**
     * true if this resource can be consumed
     */
    protected _consumable = false
    get consumable() : boolean {
        return this._consumable
    }

    set consumable(consumable: boolean) {
        this._consumable = consumable
        // this.updateStore()
    }
    /**
     * True if this resource is a key one
     */
    protected _isKey = false;
    get isKey() : boolean {
        return this._isKey
    }

    set isKey(isKey: boolean) {
        this._isKey = isKey
        // this.updateStore()
    }

    // private updateStore = () => {
    //     addResource(this)
    // }
    
    
    public addNewToStore = () => {
        const resource = this.createNew()
        addResource(resource)
    }

    public removeFromStore = () => {
        removeResource(this._name)
    }

    public add(amt: number) {
        let amtToAdd = amt ?? 0
        amtToAdd = amtToAdd < 0 ? 0 : amtToAdd
        this.amt += amtToAdd
    }

    public abstract createNew(): Resource

    protected abstract apply(toResource: Resource): void

}
// function addResource(resource) {
//     Log("Finding resource " + resource.name);
//     if (findResource(resource.name) == -1) {
//         resourceList.push(resource);
//         Log("Added resource");
//     }
//     save.resourcesOwned = resourceList;
// }

// function findResource(toFind) {
//     if (resourceList.length == 0) {
//         return -1;
//     }
//     for (var i = 0; i < resourceList.length; i++) {
//         var name = resourceList[i].name;
//         if (name == undefined) {
//             Log("Undef at " + i);
//             resourceList.splice(i, 1);
//         }
//         if (name.toLowerCase() === toFind.toLowerCase()) {
//             return i;
//         }
//     }
//     return -1;
// }

// function getResourceAsObj(toFind) {
//     return new Resource(resourceList[findResource(toFind)]);
// }

// function incrementResource(name, amt) {
//     let index = findResource(name);
//     if (index == -1) {

//     }
//     else {
//         resourceList[index].amt += amt;
//     }
// }

// function setResource(name, amt) {
//     let index = findResource(name);
//     if (index != -1) {
//         resourceList[index].amt = amt;
//     }
//     else {
//         Log("NF");
//     }
// }

// function getResourceAmt(name) {
//     let index = findResource(name);
//     if (index == -1) {
//         return undefined;
//     }
//     else {
//         return resourceList[index].amt;
//     }
// }

// function getResourceParam(name, param) {
//     let obj = getResourceAsObj(name);

//     return obj[param];
// }

// function writeResourceParam(name, param, value) {
//     let obj = getResourceAsObj(name);
//     let index = findResource(name);
//     Log(obj[param]);
//     obj[param] = value;
//     Log(obj[param]);
//     resourceList[index] = obj;
//     return resourceList;
// }

// function initResources() {
//     resourceList = save.resourcesOwned;
//     if (findResource("Gold") == -1) {
//         resourceList.push(new Resource("Gold", gold, true, 1, 0, 1, 1, true));
//         save.resourcesOwned = resourceList;
//     }
// }

// function res_GetIndexOfResFromSave(res) {
//     for (let i = 0; i < save.resourcesOwned.length; i++) {
//         if (res.toLowerCase() === save.resourcesOwned[i].name.toLowerCase()) {
//             return i;
//         }
//     }
//     return -1;
// }