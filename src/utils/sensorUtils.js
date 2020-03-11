export const sensorAlreadyExist = (sensors, sensor) => {
  return selectSensor(sensors, sensor.name) !== undefined;
};

export const selectSensor = (sensors, sensorName) => {
  return sensors.find(s => s.name === sensorName);
};

export const findSensorIndex = (sensors, sensorName) => {
  return sensors.findIndex(s => s.name === sensorName);
};
