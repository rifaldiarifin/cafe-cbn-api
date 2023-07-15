export const newDate = new Date()

export const dateNow = () => {
  return `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`
}

export const timeNow = () => {
  return `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}:${newDate.getMilliseconds()}`
}

export const timestamps = () => {
  return `${dateNow()} ${timeNow()}`
}
