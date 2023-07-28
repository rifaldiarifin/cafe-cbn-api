import { hours, minutes } from './date'

const { firstLabel, rangeRandomStringNumber } = {
  firstLabel: 'TR',
  rangeRandomStringNumber: 13
}

const transactionCode = () => {
  const text: [string[], string[]] = [[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'], [...'1234567890']]
  let randomStringNumber = ''
  let select
  for (let x = 0; x < rangeRandomStringNumber; x++) {
    const random = (numRandom: number) => {
      return Math.round(Math.random() * numRandom)
    }
    Math.round(random(10) > 8 ? (select = 1) : (select = 0))
    randomStringNumber += text[select][random(text[select].length - 1)]
  }
  return `${firstLabel}${hours()}${minutes()}${randomStringNumber}`
}

export default transactionCode
