export function replacer (key: string, value: any): any {
  return value instanceof Map ? [...value] : value
}
