function lay_init(segment) {
    Log("Initializing layout...");
    switch(segment) {
    case 0:
        var worker_button = document.getElementById("UL1");
        var worker_label = document.getElementById("UL1_label");
        var T2 = document.getElementById("Right_Panel");
        if(workers == undefined) {
            workers = 0;   
        }
        adjustLabel("UL1_label", "Workers: " + workers);
        adjustLabel("T1_1","Town info: " + save.availableWorkers + 
        " available workers (Max: " + save.maxWorkers + ")")
        worker_button.style.visibility = "visible";
        worker_label.style.visibility = "visible";
        T2.style.visibility = "visible";
        showTab(1);
        resizeTabs();
        break;
    }

}

function LayoutCloseOverflowDropdown() {
    var dd = document.getElementById("OverflowMenu");
    dd.selectedIndex = 0;
}

function LoadChangelog() {
    window.open('/Changelog.html','_blank');
    LayoutCloseOverflowDropdown();
}

function showTab(tabNum) {
    selectedTab = tabNum;
    var elements = document.getElementById("Right_Panel").children;
    var counter = 1;
    var traverse = 0;
    for(i=0;i<elements.length;i++) {
        if(elements[i].className != "Tab" && elements[i].id != "") {
            traverse = 0;
            var id = elements[i].id;
            var newid = Number.parseInt(id.replace("Tab_",""));
            var childNodes = elements[i].children;
            for(var j = 0; j < childNodes.length; j++) {
                if(childNodes[j].hasChildNodes) {
    
                    var cNode = tabRec(childNodes[j]);
                    traverse = 1;
                    var foundDoc = document.getElementById(cNode.id);
                    var elementList = document.getElementById(cNode.id).getElementsByTagName('*');
                    if(elementList.length == 0) {
                        if(counter == tabNum) {
                            if(counter != 2) {
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
                    for(var elem = 0; elem < elementList.length;elem++) {
                        if(counter == tabNum) {
                            if(counter != 2) {
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
function tabRec(start) {
    if(!start.children.hasChildNodes) {
        return start;

    }
    var childList = start.children;
    var count = 0;
    while(childList.hasChildNodes) {
        childList = childList.children;
        count++;
    }
    return childList;
}

function getTabs() {
    return document.getElementsByClassName('Tab');
}
function resizeTabs() {
    var tabs = getTabs();
    for(var i=0; i<tabs.length; i++) {
        var w = (100/tabs.length) - 1;
        tabs[i].style.width = w + "%";
    }
}

function createPopup() {
    var popup = document.getElementById("Popup");
    if(popup.style.display == "block") {
        return;
    }
    popup.style.display = "block"
}

function destroyPopup() {
    var popup = document.getElementById("Popup");
    popup.style.display = "none";
}
function displayStoryMessage(message) {
    var popupText = document.getElementById("Popup_Text");
    popupText.innerHTML = message;
    var header = document.getElementById("Header_Text");
    header.innerHTML = "Story";
    Log(header.innerHTML);
    createPopup();


}

function displayStoryMessage(message,headerMsg) {
    var popupText = document.getElementById("Popup_Text");
    var header = document.getElementById("Header_Text");
    popupText.innerHTML = message;
    header.innerHTML = headerMsg;
    createPopup();
}

function adjustUpgradeTooltips() {
    editTooltip("T2_1B","This increases the gold that workers give per second. Workers working: " + save.workersInField);
    editTooltip("T2_2B","This increases the chance of workers appearing. Workers working: " + save.workersRecruiting);

}


function option_ClickTest(test) {
    var agent = navigator.userAgent.toLowerCase();
    if(agent.indexOf("chrome") > -1) {
        let selected = test.options[test.selectedIndex];
        let index = selected.index;
        switch(index) {
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

function getButtonAndExecute(event) {
    let button = event.target;
    if(button.id.indexOf("WorkerEff",0) != -1) {
        Log("Double worker eff");
    }
    Log("Clicked");
    removeElement(event.target);
}

function createUpgrade(title, tooltip, id) {
    let button = document.createElement("button");
    button.append(document.createTextNode(title));
    button.setAttribute("class","T2_R");
    button.setAttribute("id",id);
    button.setAttribute("title",tooltip);
    button.setAttribute("style","display: inline-block;width: 100%;")
    if(selectedTab != 2) {
        Log("None");
        button.style.display = "none";
    }
    Log(button.style.color);
    let element = document.getElementById("RightSide");
    element.append(button);
}

function removeElement(element) {
    element.parentNode.removeChild(element);
}