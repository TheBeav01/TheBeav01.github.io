function lay_init(segment) {
    Log("Initializing layout...");
    switch(segment) {
    case 0:
        var worker_button = document.getElementById("UL1");
        var worker_label = document.getElementById("UL1_label");
        var T2 = document.getElementById("Right_Panel");
        adjustLabel("UL1_label", "Workers: " + save.workers);
        adjustLabel("T1_1","Town info: " + save.availableWorkers + 
        " available workers (Max: " + save.maxWorkers + ")")
        worker_button.style.visibility = "visible";
        worker_label.style.visibility = "visible";
        T2.style.visibility = "visible";
        manageTabs(1);
        break;
    }

}

function manageTabs(tab) {
    var arrT1, arrT2, arrT3;
    arrT1 = document.getElementsByClassName("T1");
    arrT2 = document.getElementsByClassName("T2");
    arrT3 = document.getElementsByClassName("T3");
    switch(tab) {
        case 1:
            for(var i = 0; i < arrT1.length; i++) {
                var element = arrT1[i];
                element.style.display = "block";
            }
            for(var i = 0; i < arrT2.length; i++) {
                var element = arrT2[i];
                element.style.display = "none";
            }
            for(var i = 0; i < arrT3.length; i++) {
                var element = arrT3[i];
                element.style.display = "none";
            }

            // adjustLabel("T2_1L", "Committed workers: " + save.workersInField);
            // adjustLabel("T2_2L", "Committed workers: " + save.workersRecruiting);
            break;
        case 2:

            for(var i = 0; i < arrT1.length; i++) {
                var element = arrT1[i];
                element.style.display = "none";
            }
            for(var i = 0; i < arrT2.length; i++) {
                var element = arrT2[i];
                element.style.display = "inline-block";
            }
            
            for(var i = 0; i < arrT3.length; i++) {
                var element = arrT3[i];
                element.style.display = "none";
            }
            break;
        case 3:
            for(var i = 0; i < arrT1.length; i++) {
                var element = arrT1[i];
                element.style.display = "none";
            }
            for(var i = 0; i < arrT2.length; i++) {
                var element = arrT2[i];
                element.style.display = "none";
            }
            for(var i = 0; i < arrT3.length; i++) {
                var element = arrT3[i];
                element.style.display = "block";
            }
            break;
        default:
            window.alert("Something went wrong :(");
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

function testShow(tabNum) {
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
    
                    var cNode = testRec(childNodes[j]);
                    traverse = 1;
                    var doc = document.getElementById(cNode.id);
                    var thing = document.getElementById(cNode.id).getElementsByTagName('*');
                    if(thing.length == 0) {
                        if(counter == tabNum) {
                            Log("Show: " + doc.outerHTML);
                            if(counter != 2) {
                                doc.style.display = "block";
                            }
                            else {
                                doc.style.display = "inline-block";

                            }
                        }
                        else {
                            Log("Hide: " + doc.outerHTML);
                            doc.style.display = "none";

                        }
                    }
                    for(var elem = 0; elem < thing.length;elem++) {
                        if(counter == tabNum) {
                            Log("Show: " + thing[elem].outerHTML);
                            if(counter != 2) {
                                thing[elem].style.display = "block";
                            }
                            else {
                                thing[elem].style.display = "inline-block";

                            }
                        }
                        else {
                            Log("Hide: " + thing[elem].outerHTML);
                            thing[elem].style.display = "none";
                        }
                    }
                }
                var cNodeId = childNodes[j].className;
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
}
function testRec(start) {
    if(!start.children.hasChildNodes) {
        // Log("Outer HTML: " + start.outerHTML + ".\nInner HTML: " + start.innerHTML + ".\nID: " +
        // start.id);
        // Log("Root at " + start.tagName);
        // Log("Early term rec child size: " + start.length);
        // Log("Next sibling: " + start.nextSiblingElement);
        return start;

    }
    var childList = start.children;
    var count = 0;
    while(childList.hasChildNodes) {
        childList = childList.children;
        count++;
        // Log(count);
    }
    // Log("End rec child size: " + childList.length);
    return childList;
}

