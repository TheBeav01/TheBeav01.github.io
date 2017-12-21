var UL1 = false;
function unlockHandler() {
    if(gold > 25 || save.gold > 25) {
        UL1 = true;
        unlockWorker();
    }
}

function CalculateCost(resourceToCalculate, resourceGiven) {
    return 0;
}
function unlockWorker() {
    workers = 0;
    var worker_button = document.getElementById("UL1");
    var worker_label = document.getElementById("UL1_label");
    worker_button.style.visibility = "visible";
    worker_label.style.visibility = "visible";
}