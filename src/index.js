import "./index.css";
import { createSensor, TimeSeries } from "./models/sensors";
import { sensorAlreadyExist, findSensorIndex } from "./utils/sensorUtils";

const mqtt = require("mqtt");
const url = "ws://" + window.location.host + "/socket";
let client = mqtt.connect(url);
const sensors = [];

client.on("connect", function() {
  client.subscribe("#", err => {
    if (!err) {
      console.log("client connected to Mqtt server via ", url);
    }
  });
});

client.on("close", () => {
  console.log("mqtt connection closed");
});

client.on("error", () => {
  console.warn("Error found");
});

client.on("message", (topic, message) => {
  let id = parseInt(topic.split("/")[1]);

  let data = JSON.parse(message);
  let sensor = createSensor({ ...data, id });
  let timeSerie = new TimeSeries({
    value: data.value,
    label: new Date().toISOString()
  });
  if (sensorAlreadyExist(sensors, sensor)) {
    let sensorIndex = findSensorIndex(sensors, sensor.name);
    sensors[sensorIndex].addTimeSerie(timeSerie);
    updateSensorHTML(sensors[sensorIndex], timeSerie);
  } else {
    sensor.addTimeSerie(timeSerie);
    sensors.push(sensor);
    ajouterSensorHTML(sensor);
  }
});

function ajouterSensorHTML(sensor) {
  let tr = document.createElement("tr");
  tr.setAttribute("id", sensor.id);

  let cellId = document.createElement("td");
  cellId.innerText = sensor.id;

  let cellNom = document.createElement("td");
  cellNom.innerText = sensor.name;

  let cellType = document.createElement("td");
  cellType.innerText = sensor.type;

  let cellValeur = document.createElement("td");
  cellValeur.innerText = sensor.getTimeSerieAt(0).value;

  let cellValMoy = document.createElement("td");
  cellValMoy.innerText = sensor.timeSeriesMeanValue();

  tr.appendChild(cellId);
  tr.appendChild(cellNom);
  tr.appendChild(cellType);
  tr.appendChild(cellValeur);
  tr.appendChild(cellValMoy);

  let table = document.querySelector("#sensor-table");
  table.append(tr);
}

function updateSensorHTML(sensor, timeSerie) {
  let row = document.getElementById(sensor.id);
  row.cells[3].innerText = timeSerie.value;
  row.cells[4].innerText = sensor.timeSeriesMeanValue();
}
