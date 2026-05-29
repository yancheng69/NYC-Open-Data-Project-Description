let data, output, result;
async function init(){
  //let link = "https://data.cityofnewyork.us/resource/43nn-pn8j.json"
  let link = "collision.json"
  info = await fetch(link);
  data = await info.json();
}