function convert2DArrayToObject(data: string[][]): Record<string, string>[] {
  const keys = data[0]
  const values = data.slice(1)
  const objects = values.map((row) => {
    return row.reduce((obj: Record<string, string>, value, index) => {
      obj[keys[index]] = value
      return obj
    }, {})
  })
  return objects
}

export { convert2DArrayToObject }
