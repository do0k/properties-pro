import { persianAlphabet } from './formatters'

export const plateValidator = (plate:string):boolean => {
  let validated = false
  const chars = String(plate)
    .replace('ایران/', '')
    .replace('-', '')
    .replace(/^[\u0600-\u06FF\uFB8A\u200C\u200F]+$/, '')
    .split('')
  chars.forEach((c, i) => {
    if ([0, 1, 2, 3, 4, 6, 7].includes(i) && isNaN(parseInt(c))) { validated = true }
    if (i === 6 && !persianAlphabet.includes(c)) { validated = true }
  })
  return validated
}

export const INCValidator = (input:string):boolean => {
  if (!/^\d{10}$/.test(input)) { return false }
  const check = +input[9]
  const sum = input.split('').slice(0, 9).reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11
  return sum < 2 ? check === sum : check + sum === 11
}

export const IranMobileValidator = (value:string):boolean => {
  return /^09\d{9}$/.test(value)
}
