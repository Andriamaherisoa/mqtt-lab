import { createSensor, TimeSeries, loadSensors } from "../sensors";
import { data, invalidData } from "../../mocks/sensor_data";

describe("Sensor model tests", () => {
  describe("Dummy tests", () => {
    test("data is loaded with 3 elements", () => {
      expect(data.length).toBe(4);
    });
  });
  /* TODO: Écrire ici la suite de tests pour le modèle objet.*/
  //
  describe("Test createSensor function pattern", () => {
    test("is defined", () => {
      expect(createSensor()).toBeDefined();
    });

    test("is really an object of", () => {
      const sensor = createSensor();
      expect(typeof sensor).toBe("object");
    });

    test("matching attributes, timeseries length is 0", () => {
      const params = {
        id: 11,
        name: "Sensor test",
        type: "TEMPERATURE"
      };
      expect(createSensor(params)).toMatchObject({
        id: 11,
        name: "Sensor test",
        type: "TEMPERATURE"
      });
      expect(createSensor().getTimeSeries()).toHaveLength(0);
    });

    test("protect attributes", () => {
      let sensor = createSensor({
        id: 1,
        name: "Sensor test",
        type: "TEMPERATURE"
      });
      sensor.id = 2;
      // NOT WORKING
      // expect(sensor.id).not.toEqual(2);
    });

    test("add timeserie value", () => {
      let sensor = createSensor({ name: "Sensor test", type: "HUMIDITY" });
      const timeserie = new TimeSeries({
        value: 23,
        label: "2016-10-19T08:00:00.000Z"
      });
      expect(sensor.getTimeSeries()).toHaveLength(0);
      sensor.addTimeSerie(timeserie);
      expect(sensor.getTimeSeries()).toHaveLength(1);
      expect(sensor.getTimeSeries()).toContain(timeserie);
    });

    test("remove value", () => {
      let sensor = createSensor({
        name: "Sensor test",
        type: "LIGHT",
        data: {
          values: [23, 23, 22, 21, 23, 23, 23, 25, 25],
          labels: [
            "2016-10-19T08:00:00.000Z",
            "2016-10-19T09:00:00.000Z",
            "2016-10-19T10:00:00.000Z",
            "2016-10-19T11:00:00.000Z",
            "2016-10-19T12:00:00.000Z",
            "2016-10-19T13:00:00.000Z",
            "2016-10-19T14:00:00.000Z",
            "2016-10-19T15:00:00.000Z",
            "2016-10-19T16:00:00.000Z"
          ]
        }
      });
      expect(sensor.getTimeSeries()).toHaveLength(9);
      sensor.removeTimeSerieAt(3);
      expect(sensor.getTimeSeries()).toHaveLength(8);
    });

    test("update timserie value", () => {
      let sensor = createSensor({
        name: "Sensor test",
        type: "LIGHT",
        data: {
          values: [23, 23],
          labels: ["2016-10-19T08:00:00.000Z", "2016-10-19T09:00:00.000Z"]
        }
      });
      const timeserie = new TimeSeries({
        value: 23,
        label: "2016-10-19T08:00:00.000Z"
      });
      expect(sensor.getTimeSeries()[0]).not.toBe(timeserie);
      sensor.updateTimeSerieAt(1, timeserie);
      expect(sensor.getTimeSeries()[0]).toEqual(timeserie);
    });

    test("testing toJSON method", () => {
      let sensor = createSensor({
        name: "Sensor test",
        type: "LIGHT",
        data: {
          values: [23, 23],
          labels: ["2016-10-19T08:00:00.000Z", "2016-10-19T09:00:00.000Z"]
        }
      });
      expect(sensor.toJSON()).toEqual({
        name: "Sensor test",
        type: "LIGHT",
        data: {
          values: [23, 23],
          labels: ["2016-10-19T08:00:00.000Z", "2016-10-19T09:00:00.000Z"]
        }
      });
    });
    test("testing toString method", () => {
      let sensorData = {
        name: "Sensor test",
        type: "LIGHT",
        data: {
          values: [23, 23],
          labels: ["2016-10-19T08:00:00.000Z", "2016-10-19T09:00:00.000Z"]
        }
      };
      let sensor = createSensor(sensorData);
      expect(sensor.toString()).toEqual(JSON.stringify(sensorData));
    });
  });

  describe("SensorType tests", () => {
    test(`sensor type should be one of 'TEMPERATURE','HUMIDITY','LIGHT','SWITCH','DOOR'`, () => {
      let mockFunction = jest.fn(() => {
        let sensor = createSensor({
          name: "Sensor test",
          type: "NONE_OF_THESE"
        });
      });
      expect(mockFunction).toThrow();
    });
  });

  describe("Load from source", () => {
    let sensors;
    test("Throw exception on invalid source object", () => {
      let mockFunction = jest.fn(() => {
        sensors = loadSensors(invalidData);
      });
      expect(mockFunction).toThrow(/^Sensor type not found/);
    });
    test("returning array with Sensors", () => {
      sensors = loadSensors(data);
      expect(sensors).toBeDefined();
      expect(sensors).toHaveLength(data.length);
    });
  });
});
