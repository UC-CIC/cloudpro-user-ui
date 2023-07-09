/**
 * Helper method to map values using the specified callback function.
 * Transforms values in arrays and objects recursively.
 */
export const mapValues = (val: any, cb: (v: any) => any): any => {
  if (Array.isArray(val)) {
    return val.map((v: any) => mapValues(v, cb));
  } else if (val?.constructor === Object) {
    return Object.entries(val).reduce((obj: any, [key, v]) => {
      obj[key] = mapValues(v, cb);
      return obj;
    }, {});
  } else {
    return cb(val);
  }
};
