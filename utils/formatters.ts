export const fixHour = (strDate: string) => {
  const months = ['۱', '۲', '۳', '۴', '۵', '۶']
  const date = new Date(strDate)
  const month = date.toLocaleDateString('fa-IR', {
    timeZone: 'Asia/Tehran',
    dateStyle: 'short'
  }).split('/')[1]
  if (months.includes(month) && !process.dev) {
    console.log('+1H')
    return new Date(date.getTime() + 3600000)
  }
  return date
}
export const JDateTime = (_:any, __:any, cellValue:string):string => {
  if (cellValue) {
    const date = fixHour(cellValue)
    return date.toLocaleDateString('fa-IR', {
      timeZone: 'Asia/Tehran',
      dateStyle: 'short'
    }) + ' - ' + date.toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran', timeStyle: 'short' })
  }
  return '--'
}

export const JDate = (_:any, __:any, cellValue:string):string => {
  if (cellValue) {
    const date = fixHour(cellValue)
    return date.toLocaleDateString('fa-IR', {
      timeZone: 'Asia/Tehran',
      dateStyle: 'short'
    })
  }
  return '--'
}

export const JTime = (_:any, __:any, cellValue:string):string => {
  if (cellValue) {
    const date = fixHour(cellValue)
    return date.toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran', timeStyle: 'short' })
  }
  return '--'
}

export const FDigits = (num:string | number) => {
  return num.toString().replace(/\d/g, (d:string) => {
    return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][Number(d)]
  })
}
export const FFDigits = (num:string | number) => {
  return Number(PDigit(num)).toLocaleString('fa-IR')
}

export const FDigitsFormatter = (_:any, __:any, cellValue:string):string => FDigits(cellValue)

export const persianAlphabet = ['ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی']

export const PlateFormatter = (value: string | number):string => {
  let formatted = 'ایران/'
  value = String(value)
    .replace(formatted, '')
    .replace('-', '')
    .replace(/^[\u0600-\u06FF\uFB8A\u200C\u200F]+$/, '')
  const chars = value.split('')
  if (!isNaN(parseInt(chars[0]))) { formatted = `${formatted}${chars[0]}` }
  if (!isNaN(parseInt(chars[1]))) { formatted = `${formatted}${chars[1]}` }
  if (!isNaN(parseInt(chars[2]))) { formatted = `${formatted}-${chars[2]}` }
  if (!isNaN(parseInt(chars[3]))) { formatted = `${formatted}${chars[3]}` }
  if (!isNaN(parseInt(chars[4]))) { formatted = `${formatted}${chars[4]}` }
  if (isNaN(parseInt(chars[5])) && persianAlphabet.includes(chars[5])) { formatted = `${formatted}${chars[5]}` }
  if (!isNaN(parseInt(chars[6]))) { formatted = `${formatted}${chars[6]}` }
  if (!isNaN(parseInt(chars[7]))) { formatted = `${formatted}${chars[7]}` }
  return formatted
}
export const PDigit = (val:string| number):string => {
  return String(val).replaceAll('٬', '').replace(/[۰-۹]/g, function (match) {
    return String.fromCharCode(match.charCodeAt(0) - 1728)
  })
}

export const EDigit = (val:string| number):string => {
  return Number(String(val).replaceAll(',', '')).toLocaleString()
}
