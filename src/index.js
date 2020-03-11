import "./index.css";
import { createSensor } from "./models/sensors";
import { sensorAlreadyExist, findSensorIndex } from "./utils/sensorUtils";

const mqtt = require("mqtt");
const url = "ws://" + window.location.host + "/socket";
let client = mqtt.connect(url);
const sensors = [];
const buffer = [];

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
  if (sensorAlreadyExist(sensors, sensor)) {
    let sensorIndex = findSensorIndex(sensors, sensor.name);
    let value = data.value;
    sensors[sensorIndex].addTimeSerie({
      value,
      label: new Date().toISOString()
    });
  } else {
    sensors.push(sensor);
  }
});
