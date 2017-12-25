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
            adjustLabel("T2_1L", "Committed workers: " + save.workersInField);
            adjustLabel("T2_2L", "Committed workers: " + save.workersRecruiting);
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