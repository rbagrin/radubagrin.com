export function getTTM<T>(v1: T, v2: T, v3: T, v4: T): T {
  return ([v1, v2, v3, v4] as Record<string, number>[]).reduce((acc, obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "number" || obj[key] === null)
          acc[key] = (acc[key] || 0) + obj[key];
        // if obj[key] is string, assume all the key properties in all the objects have the same value
        else acc[key] = obj[key];
      }
    }
    return acc;
  }, {} as T);
}
