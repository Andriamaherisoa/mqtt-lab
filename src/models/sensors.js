export const SensorType = [
  "TEMPERATURE",
  "HUMIDITY",
  "LIGHT",
  "SWITCH",
  "DOOR",
  "FAN_SPEED",
  "POSITIVE_NUMBER",
  "PERCENT",
  "ON_OFF",
  "OPEN_CLOSE"
];

export function TimeSeries({ value, label }) {
  this.value = value;
  this.label = label;
}

export function createSensor(attributes = {}) {
  let id = attributes.id;
  let name = attributes.name || "";
  let type = "";
  let timeSeries = [];
  let sensorValue;

  const addTimeSerie = value => {
    if (value instanceof TimeSeries) {
      timeSeries.push(value);
    } else {
      timeSeries.push(new TimeSeries(value));
    }
  };

  const removeTimeSerieAt = idx => {
    timeSeries.splice(idx, 1);
  };

  const clearTimeSeries = () => (timeSeries = []);

  const updateTimeSerieAt = (idx, newValue) => {
    if (newValue instanceof TimeSeries) {
      timeSeries[idx] = newValue;
    } else {
      if (
        newValue.hasOwnProperty("value") &&
        newValue.hasOwnProperty("label")
      ) {
        timeSeries[idx] = new TimeSeries(newValue);
      }
    }
  };

  const getTimeSeries = () => timeSeries;

  if (attributes.hasOwnProperty("data")) {
    if (
      Array.isArray(attributes.data.values) &&
      Array.isArray(attributes.data.labels)
    ) {
      attributes.data.values.map((value, idx) =>
        addTimeSerie({
          value: value,
          label: attributes.data.labels[idx]
        })
      );
    } else {
      sensorValue = attributes.data;
    }
  }

  if (
    attributes.hasOwnProperty("type") &&
    attributes.type.length > 0 &&
    !SensorType.includes(attributes.type)
  ) {
    throw `Sensor type not found ${attributes.type}`;
  } else {
    type = attributes.type;
  }

  const toJSON = () => {
    let labels = [];
    let values = [];
    if (!sensorValue) {
      timeSeries.forEach(({ value, label }, index) => {
        labels[index] = label;
        values[index] = value;
      });
    }
    return {
      id: id,
      name: name,
      type: type,
      data: sensorValue
        ? sensorValue
        : {
            values: values,
            labels: labels
          }
    };
  };

  const toString = () => JSON.stringify(toJSON());

  return {
    id,
    name,
    type,
    getTimeSeries,
    addTimeSerie,
    removeTimeSerieAt,
    clearTimeSeries,
    updateTimeSerieAt,
    toJSON,
    toString
  };
}

export function loadSensors(source) {
  if (!Array.isArray(source)) {
    throw "source must be JSON obejct array or url";
  }
  let sensors = [];
  source.forEach(sensorItem => {
    sensors.push(createSensor(sensorItem));
  });
  return sensors;
}
