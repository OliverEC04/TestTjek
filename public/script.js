function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
}
let date = new Date();
let times = [];
function submitTime() {
    let datetime = document.querySelector("#datetime").value;
    times.push({ unix: new Date(datetime).getTime() / 1000, str: datetime });
    times.sort((a, b) => (a.unix > b.unix) ? -1 : 1);
    updateTimeList();
    updateLabel();
}
function updateTimeList() {
    document.querySelector("#timeList").innerHTML = "";
    for (let i = 0; i < times.length; i++) {
        let newTimeElem = document.createElement("P");
        newTimeElem.innerText = times[i].str;
        document.querySelector("#timeList").appendChild(newTimeElem);
    }
}
function updateLabel() {
    if (times.length <= 0) {
        console.error("No times");
        return;
    }
    let checkElem = document.querySelector("#check");
    let testElem = document.querySelector("#test");
    if (rule72(times[0].unix) || rule168(times)) {
        checkElem.style.display = "block";
        testElem.style.display = "none";
    }
    else {
        checkElem.style.display = "none";
        testElem.style.display = "block";
    }
}
function rule72(unixTime) {
    date = new Date();
    return date.getTime() / 1000 - unixTime < 72 * 60 * 60;
}
function rule168(times) {
    date = new Date();
    let weekTimes = [];
    for (let i = 0; i < times.length; i++) {
        if (date.getTime() / 1000 - times[i].unix < 7 * 24 * 60 * 60) {
            weekTimes.push(times[i]);
        }
        else if (weekTimes.length < 2) {
            return false;
        }
        else {
            break;
        }
    }
    console.log(weekTimes);
    if (weekTimes[0].unix - weekTimes[weekTimes.length - 1].unix > 2 * 24 * 60 * 60) {
        return true;
    }
    else {
        return false;
    }
}
