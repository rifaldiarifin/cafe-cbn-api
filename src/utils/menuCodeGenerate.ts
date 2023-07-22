import { hours, minutes } from './date'

const { firstLabel, rangeRandomStringNumber } = {
  firstLabel: 'PRDCT',
  rangeRandomStringNumber: 10
}

const menuCode = () => {
  const text: [string[], string[]] = [[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'], [...'1234567890']]
  let randomStringNumber = ''
  let select
  for (let x = 0; x < rangeRandomStringNumber; x++) {
    const random = (numRandom: number) => {
      return Math.round(Math.random() * numRandom)
    }
    Math.round(random(10) > 8 ? (select = 1) : (select = 0))
    // randomStringNumber += text[Math.round(Math.random() * text.length)]
    randomStringNumber += text[select][random(text[select].length - 1)]
  }
  return `${firstLabel}${hours()}${minutes()}${randomStringNumber}`
}

export default menuCode
