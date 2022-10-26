export function removeEmptyFromObject<T = any>(obj: {
  [key: string]: undefined | null | T
}): {
  [key: string]: T
} {
  return Object.keys(obj).reduce((prev, key) => {
    if (obj[key] === undefined || obj[key] === null) {
      return prev
    }
    return {
      ...prev,
      [key]: obj[key],
    }
  }, {})
}
