let data;
let output;

async function init() {
  let link = "311.json";
  let info = await fetch(link);
  data = await info.json();
}

async function initFilterPage() {
  await init();
  output = document.getElementById("output");
  displayCards(data);
}

async function initAnalysisPage() {
  await init();
  makeCharts();
}

function displayCards(records) {
  output.innerHTML = "";

  let resultCount = document.getElementById("resultCount");
  resultCount.innerHTML = "Showing " + records.length + " records";

  for (let i = 0; i < records.length; i++) {
    let item = records[i];

    let restaurantName = item.dba || "No name listed";
    let borough = item.boro || "No borough listed";
    let cuisine = item.cuisine_description || "No cuisine listed";
    let grade = item.grade || "No grade listed";
    let score = item.score || "No score listed";
    let date = item.inspection_date ? item.inspection_date.substring(0, 10) : "No date listed";
    let violation = item.violation_description || "No violation description listed";

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${restaurantName}</h3>
      <p><strong>Borough:</strong> ${borough}</p>
      <p><strong>Cuisine:</strong> ${cuisine}</p>
      <p><strong>Grade:</strong> ${grade}</p>
      <p><strong>Score:</strong> ${score}</p>
      <p><strong>Inspection Date:</strong> ${date}</p>
      <p><strong>Violation:</strong> ${violation}</p>
    `;

    output.appendChild(card);
  }
}

function filterCards() {
  let boroughValue = document.getElementById("boroughSelect").value;
  let gradeValue = document.getElementById("gradeSelect").value;
  let nameValue = document.getElementById("nameInput").value.toLowerCase();

  let filteredData = data.filter(function(item) {
    let boroughMatch = boroughValue === "All" || item.boro === boroughValue;
    let gradeMatch = gradeValue === "All" || item.grade === gradeValue;
    let nameMatch = (item.dba || "").toLowerCase().includes(nameValue);

    return boroughMatch && gradeMatch && nameMatch;
  });

  displayCards(filteredData);
}

function makeCharts() {
  makeBoroughChart();
  makeGradeChart();
}

function makeBoroughChart() {
  let boroughCounts = {
    "Manhattan": 0,
    "Brooklyn": 0,
    "Queens": 0,
    "Bronx": 0,
    "Staten Island": 0
  };

  for (let i = 0; i < data.length; i++) {
    let borough = data[i].boro;
    if (boroughCounts[borough] !== undefined) {
      boroughCounts[borough]++;
    }
  }

  c3.generate({
    bindto: "#boroughChart",
    data: {
      columns: [
        ["Inspection Records", boroughCounts["Manhattan"], boroughCounts["Brooklyn"], boroughCounts["Queens"], boroughCounts["Bronx"], boroughCounts["Staten Island"]]
      ],
      type: "bar"
    },
    axis: {
      x: {
        type: "category",
        categories: ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]
      },
      y: {
        label: "Number of Records"
      }
    }
  });

  let highestBorough = "Manhattan";
  for (let borough in boroughCounts) {
    if (boroughCounts[borough] > boroughCounts[highestBorough]) {
      highestBorough = borough;
    }
  }

  document.getElementById("boroughFinding").innerHTML =
    "Finding: In the loaded sample, " + highestBorough + " has the most inspection records.";
}

function makeGradeChart() {
  let selectedBorough = document.getElementById("analysisBorough").value;
  let chartType = document.getElementById("chartType").value;

  let gradeCounts = {
    "A": 0,
    "B": 0,
    "C": 0,
    "N": 0,
    "Z": 0
  };

  for (let i = 0; i < data.length; i++) {
    let item = data[i];

    if (selectedBorough === "All" || item.boro === selectedBorough) {
      if (gradeCounts[item.grade] !== undefined) {
        gradeCounts[item.grade]++;
      }
    }
  }

  c3.generate({
    bindto: "#gradeChart",
    data: {
      columns: [
        ["A", gradeCounts["A"]],
        ["B", gradeCounts["B"]],
        ["C", gradeCounts["C"]],
        ["N", gradeCounts["N"]],
        ["Z", gradeCounts["Z"]]
      ],
      type: chartType
    },
    axis: {
      x: {
        type: "category"
      }
    }
  });

  let mostCommonGrade = "A";
  for (let grade in gradeCounts) {
    if (gradeCounts[grade] > gradeCounts[mostCommonGrade]) {
      mostCommonGrade = grade;
    }
  }

  document.getElementById("gradeFinding").innerHTML =
    "Finding: The most common grade in this filtered data is " + mostCommonGrade + ".";
}
