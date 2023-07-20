export const dateNow = () => {
  const newDate: Date = new Date()
  const date = newDate.getDate().toString().padStart(2, '0')
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0')

  return `${date}-${month}-${newDate.getFullYear()}`
}

export const timeNow = () => {
  const newDate: Date = new Date()
  const hours = newDate.getHours().toString().padStart(2, '0')
  const minutes = newDate.getMinutes().toString().padStart(2, '0')
  const seconds = newDate.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}:${newDate.getMilliseconds()}`
}

export const timestamps = () => {
  return `${dateNow()} ${timeNow()}`
}
