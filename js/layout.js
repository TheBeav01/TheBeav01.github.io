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
                element.style.display = "block";
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

