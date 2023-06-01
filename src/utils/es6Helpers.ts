type Indexable = Record<string, any>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ES6MapToObject (map: Map<any, any>) {
  const obj: Indexable = {}
  map.forEach((val, key) => {
    if (val instanceof Map) obj[key] = ES6MapToObject(val)
    else if (typeof val === 'object') obj[key] = ConvertTupleToSingleValue(val)
    else obj[key] = val
  })
  return obj
}

export function ConvertTupleToSingleValue (val: any): any {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (typeof val === 'object' && !val.length && !(val instanceof Date)) { return ConvertTupleToSingleValue(val) } else if (typeof val === 'object' && val.length && val.length === 1) return val[0]
  else return val
}
