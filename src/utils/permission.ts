export function isValidPermissionJson (jsonData: string): any {
  try {
    const data: any = JSON.parse(jsonData)
    const keys: string[] = Object.keys(data)
    if (keys.length === 0) {
      throw Error('No keys present in the json')
    }
    keys.forEach((item: string) => {
      const permission = data[item]

      if (permission['*'] === undefined) {
        const allPermission = ['read', 'write', 'delete', 'update']
        for (const key of allPermission) {
          if (permission[key] === undefined) throw Error(`${key} property not present in ${item}`)
        }
      }
    })
  } catch (e) {
    console.log(e)
    return {
      isValid: false,
      // @ts-expect-error/any
      error: e.message
    }
  }
  return {
    isValid: true,
    error: null
  }
}
