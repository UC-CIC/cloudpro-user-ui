export const snakeToCamelCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const mapObjectKeys = (
  obj: any | any[],
  transform: (str: string) => string,
): any | any[] => {
  if (Array.isArray(obj)) {
    return obj.map((val) => mapObjectKeys(val, transform));
  } else if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      acc[transform(key)] = mapObjectKeys((obj as any)[key], transform);
      return acc;
    }, {});
  } else {
    return obj;
  }
};
