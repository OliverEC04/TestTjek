function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
}
const apiUrl = "http://localhost:8973/api";
let profile;
let date;
let times = [];
window.onload = () => {
    date = new Date();
};
async function getApi(search) {
    let response = await fetch("http://localhost:8973/api");
    let data = await response.json();
    console.log(data);
}
async function sendApi(data) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    return await fetch(apiUrl, options)
        .then(response => { return response.json(); });
}
async function submitTime() {
    let datetime = document.querySelector("#datetime").value;
    times.push({ unix: new Date(datetime).getTime() / 1000, str: datetime });
    times.sort((a, b) => (a.unix > b.unix) ? -1 : 1);
    if (profile === undefined) {
        console.log("Sign in to save test times");
    }
    else {
        console.log(await sendApi({
            pid: profile.getId(),
            name: profile.getName(),
            timestamp: date.getTime(),
            testTime: datetime,
        }));
    }
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
