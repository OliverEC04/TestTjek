const apiUrl: string = "http://localhost:8973/api";

let profile;
let date: Date;
let times = [];

window.onload = () => {
    date = new Date();

    // let data = {test: "jatak"};
    // let options = {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(data)
    // };

    // fetch("http://localhost:8973/api", options)
    // .then((response) => {
    //     let json = response.json();
    //     return json;
    // })
    // .then((result) => {
    //     console.log(result);
    // });

    // getApi();
};

async function getApi(search?)
{
    let response = await fetch("http://localhost:8973/api");
    let data = await response.json();
    console.log(data);    
}

async function sendApi(data: object)
{
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    return await fetch(apiUrl, options)
    .then(response => { return response.json() });
}

async function submitTime()
{
    let datetime: string = document.querySelector("#datetime").value;

    times.push({unix: new Date(datetime).getTime() / 1000, str: datetime});
    times.sort((a, b) => (a.unix > b.unix) ? -1 : 1);

    console.log(await sendApi({hej: "hej"}));
    updateTimeList();
    updateLabel();
}

function updateTimeList(): void
{
    document.querySelector("#timeList").innerHTML = "";

    for (let i: number = 0; i < times.length; i++)
    {
        let newTimeElem: HTMLElement = document.createElement("P");
        newTimeElem.innerText = times[i].str;
        document.querySelector("#timeList").appendChild(newTimeElem);
    }
}

function updateLabel(): void
{
    if (times.length <= 0)
    {
        console.error("No times");
        return;
    }

    let checkElem = document.querySelector("#check");
    let testElem = document.querySelector("#test");

    if (rule72(times[0].unix) || rule168(times))
    {
        checkElem.style.display = "block";
        testElem.style.display = "none";
    }
    else
    {
        checkElem.style.display = "none";
        testElem.style.display = "block";
    }
}

function rule72(unixTime): boolean
{
    date = new Date();

    return date.getTime() / 1000 - unixTime < 72 * 60 * 60;
}

function rule168(times): boolean
{
    date = new Date();
    let weekTimes = [];

    for (let i: number = 0; i < times.length; i++)
    {
        if (date.getTime() / 1000 - times[i].unix < 7 * 24 * 60 * 60)
        {
            weekTimes.push(times[i]);
        }
        else if (weekTimes.length < 2)
        {            
            return false;
        }
        else
        {
            break;
        }
    }
    
    console.log(weekTimes);    

    if (weekTimes[0].unix - weekTimes[weekTimes.length - 1].unix > 2 * 24 * 60 * 60)
    {
        return true;
    }
    else
    {
        return false;
    }
}
