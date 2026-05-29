// https://data.cityofnewyork.us/resource/43nn-pn8j.json

let data;

async function init(){

 
let link = "311.json"

    let info = await fetch(link);

    data = await info.json();

    displayCards(data);
}
