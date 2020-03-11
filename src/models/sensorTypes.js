const SensorTypes = [
  "POSITIVE_NUMBER",
  "PERCENT",
  "TEMPERATURE",
  "ON_OFF",
  "OPEN_CLOSE"
];

const Enumeration = function(keys) {
  const enumeration = Object.create(null);
  for (const key of keys) {
    enumeration[key] = key;
  }
  enumeration[Symbol.iterator] = function*() {
    for (const key of keys) {
      yield enumeration[key];
    }
  };
  Object.freeze(enumeration);
  return enumeration;
};

const SensorType = new Enumeration(SensorTypes);

export default SensorType;
