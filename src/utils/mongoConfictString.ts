export const getConflict = (obj: object) => {
  return Object.entries(obj)
    .map((key, i) => {
      return `${key[0]} "${key[1]}"`
    })
    .join(', ')
}
