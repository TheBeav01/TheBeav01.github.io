/**
 * Initializes the layout on the right side of the screen.
 * @param {Number} segment What section of the game the player is in. Currently only handles zero.
 */

function lay_init(segment) {
    Log("Initializing layout...");
    switch (segment) {
        case 0:
            var worker_button = document.getElementById("UL1");
            var worker_label = document.getElementById("UL1_label");
            var T2 = document.getElementById("Right_Panel");
            adjustUpgradeTooltips();
            if (workers == undefined) {
                workers = 0;
            }
            adjustLabel("UL1_label", "Workers: " + workers);
            adjustLabel("T1_1", "Town info: " + save.availableWorkers +
                " available workers (Max: " + save.maxWorkers + ")")
            worker_button.style.visibility = "visible";
            worker_label.style.visibility = "visible";
            T2.style.visibility = "visible";
            showTab(1);
            resizeTabs();
            break;
    }

}

/**
 * Resets the select bar on the top of the screen.
 */
function LayoutCloseOverflowDropdown() {
    var dd = document.getElementById("OverflowMenu");
    dd.selectedIndex = 0;
}
/**
 * Opens the changelog.
 */
function LoadChangelog() {
    window.open('/changelog.html', '_blank');
    LayoutCloseOverflowDropdown();
}

/**
 * Starts from the top of the right side document tree. From there, the function iterates through and
 * displays or hides elements depends on what the tab number is.
 * @param {Number} tabNum The tab number to show.
 */
function showTab(tabNum) {
    selectedTab = tabNum;
    var elements = document.getElementById("Right_Panel").children;
    var counter = 1;
    var traverse = 0;
    for (i = 0; i < elements.length; i++) {
        if (elements[i].className != "Tab" && elements[i].id != "") {
            traverse = 0;
            var id = elements[i].id;
            var newid = Number.parseInt(id.replace("Tab_", ""));
            var childNodes = elements[i].children;
            for (var j = 0; j < childNodes.length; j++) {
                if (childNodes[j].hasChildNodes) {

                    var cNode = tabRec(childNodes[j]);
                    traverse = 1;
                    if(cNode.id == "") {

                    }
                    var foundDoc = document.getElementById(cNode.id);
                    var elementList = document.getElementById(cNode.id).getElementsByTagName('*');
                    if (elementList.length == 0) {
                        if (counter == tabNum) {
                            if (counter != 2) {
                                foundDoc.style.display = "block";
                            }
                            else {
                                foundDoc.style.display = "inline-block";

                            }
                        }
                        else {
                            foundDoc.style.display = "none";

                        }
                    }
                    for (var elem = 0; elem < elementList.length; elem++) {
                        if (counter == tabNum) {
                            if (counter != 2) {
                                elementList[elem].style.display = "block";
                            }
                            else {
                                elementList[elem].style.display = "inline-block";

                            }
                        }
                        else {
                            elementList[elem].style.display = "none";
                        }
                    }
                }
            }
            counter++;

            //JUST IN CASE
            // if(traverse == 0 && newid == tabNum) {
            //     // Log("Show: " + elements[i].id);
            //     if(tabNum==2) {
            //         // Log("Special show");
            //         // elements[i].childNodes.style.display = "inline-block";
            //     }

            // }
            // else {
            //     // Log("Hide: " + elements[i].id);
            // }
            // Log("Result = " + newid);
            // if(newid!=tabNum-1) {
            //     elements[i].style.display = "none";
            // }
            // else {
            //     if(newid==2) {
            //         elements[i].style.display = "inline-block";
            //     }
            //     else {
            //         elements[i].style.display = "inline";
            //     }
            // }
        }
    }
    document.getElementById("RightSide").style.display = "table-cell"
}
/**
 * Iterates through the start node until there is no child list to be found. Returns the child list, or the parameter
 * if a child list does not exist.
 * @param {*} start The HTML parent node to start from.
 */
function tabRec(start) {
    if (!start.children.hasChildNodes) {
        return start;

    }
    var childList = start.children;
    var count = 0;
    while (childList.hasChildNodes) {
        childList = childList.children;
        count++;
    }
    return childList;
}

/**
 * Simple getter for the tab class.
 */
function getTabs() {
    return document.getElementsByClassName('Tab');
}
/**
 * On launch, the game gets the number of tabs and sets the width of them so they'll more or less
 * fill the container they are in.
 */
function resizeTabs() {
    var tabs = getTabs();
    for (var i = 0; i < tabs.length; i++) {
        var w = (100 / tabs.length) - 1;
        tabs[i].style.width = w + "%";
    }
}

/**
 * Shows a story popup created earlier.
 */
function createPopup() {
    var popup = document.getElementById("Popup");
    if (popup.style.display == "block") {
        return;
    }
    popup.style.display = "block"
}
/**
 * Destroys the story popup created earlier.
 */
function destroyPopup() {
    var popup = document.getElementById("Popup");
    popup.style.display = "none";
}
/**
 * Sets and displays a popup in the center of the screen with the specified message.
 * @param {String} message The message to display
 */
function displayStoryMessage(message) {
    var popupText = document.getElementById("Popup_Text");
    popupText.innerHTML = message;
    var header = document.getElementById("Header_Text");
    header.innerHTML = "Story";
    Log(header.innerHTML);
    createPopup();


}

/**
 * Sets and displays a popup in the center of the screen with the specified message and header message.
 * @param {String} message The message to display.
 * @param {String} headerMsg The header message.
 */
function displayStoryMessage(message, headerMsg) {
    var popupText = document.getElementById("Popup_Text");
    var header = document.getElementById("Header_Text");
    popupText.innerHTML = message;
    header.innerHTML = headerMsg;
    createPopup();
}
/**
 * Adjusts the two main upgrade tooltips (for now)
 */
function adjustUpgradeTooltips() {
    editTooltip("T2_1B", "This increases the gold that workers give per second. Workers working: " + save.workersInField);
    editTooltip("T2_2B", "This increases the chance of workers appearing. Workers working: " + save.workersRecruiting);

}

/**
 * Figures out what labels or text is on the screen, then adjusts them accordingly. Fires per tick.
 * @param {Number} displayGold The gold to show.
 */
function adjustLabelsOnScreen(displayGold) {
    var nextString = displayGold + "/" + CalculateCost("worker", save.workersRecieved);
    adjustLabel("ManualGoldButton", "Gold: " + displayGold);
    adjustLabel("UL1_label", "Workers: " + workers + " (" + GPS + " GPS) " + nextString);
    if(getShardAmt() > 0) {
        adjustLabel("T1_3_AMT", goldToShardString());
    }
    if(selectedTab == 1) {
        if(WK_GEN_FLG == 1 || WK_BUY_FLG == 1) {
            adjustLabel("T1_2", "Percentage chance of generation: " + getGenChance(save.availableWorkers));
            adjustLabel("T1_1", "Town info: " + save.availableWorkers + " available workers (Max: " + save.maxWorkers + ")")
            WK_GEN_FLG = 0;
            WK_BUY_FLG = 0;
        }

    }
}

/**
 * Checks the browser used and pretends to "click" on the selected item.
 * @param {*} test The dropdown
 */
function option_ClickTest(test) {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("chrome") > -1) {
        let selected = test.options[test.selectedIndex];
        let index = selected.index;
        switch (index) {
            case 1:
                SaveGame();
                break;
            case 2:
                Import();
                break;
            case 3:
                Export();
                break;
            case 4:
                LoadChangelog();
                break;
            default:
                Log("Invalid option");
        }
    }
}

/**
 * Gets the click event from the upgrade button and applies the correct upgrade depending on the
 * button ID.
 * @param {} event The click event fired
 */
function getButtonAndExecute(event) {

    if (event.target.tagName !== "DIV") {
        let resourceArr = JSON.parse(event.target.getAttribute("upg"));
        deductResources(resourceArr);
        let button = event.target;
        let effect = resourceArr.B_ID;
        if (effect.indexOf(WORK_EFF_ID, 0) != -1) {
            Log("Inc worker eff");
            var work = resourceList[findResource("Worker")];
            work.effectMult *= 1.5;
        }
        if(effect.indexOf(DBL_WORK_EFF,0) != -1) {
            Log("DBL");
            var work = resourceList[findResource("Worker")];
            work.effectMult *= 3;
        }
        removeElement(event.target);
    }
}

function createUpgrade(title, id, upgTag) {
    for (let i = 0; i < save.unlockedUpgrades.length; i++) {
        if (save.unlockedUpgrades[i].ID === upgTag.ID) {
            return;
        }
    }
    upgradesList.push(upgTag);
    save.unlockedUpgrades = upgradesList;
    let button = document.createElement("button");
    var Att = document.createAttribute("upg");
    let tooltip = "";
    Att.value = JSON.stringify(upgTag);
    button.setAttribute("upg", Att.value);
    button.append(document.createTextNode(title));
    button.setAttribute("class", "T2_R");
    button.setAttribute("id", id);
    button.setAttribute("title", tooltip);
    button.setAttribute("style", "display: inline-block;width: 100%;");
    if (selectedTab != 2) {
        button.style.display = "none";
    }
    let element = document.getElementById("RightSide");
    element.append(button);
}

function createResourceLabel(text, id) {
    let label = document.createElement("label");
    label.append(document.createTextNode(text));
    label.setAttribute("class", "T1");
    label.setAttribute("id", id);
    label.style.display = "inherit";
    if (selectedTab != 1) {
        label.style.display = "none";
    }
    let element = document.getElementById("Tab_1");
    element.append(label);
}

function createResourceInfoLabel(text, id) {
    let label = document.createElement("label");
    label.append(document.createTextNode(text));
    label.setAttribute("id",id);
    label.setAttribute("class","T1");
    let element = document.getElementById("Tab_1");
    element.append(label);
}
function removeElement(element) {
    element.parentNode.removeChild(element);
}

function hideAscendDiv() {
    document.getElementById("InnerAscent").style.display = "none";
    start();
    isPaused = false;
}