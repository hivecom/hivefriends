import { omit } from 'lodash'

export function getRanMinMax(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function formatDate(date: Date | number, toOmit?: Array<any>) {
  if (typeof date === 'number')
    date *= 1000

  const d = new Date(date)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

  return d.toLocaleDateString('en-GB', toOmit ? omit(options, toOmit) : options)
}

export function sameDate(date: string | number | Date, compare: string | number | Date) {
  const d1 = new Date(date).setHours(0, 0, 0, 0)
  const d2 = new Date(compare).setHours(0, 0, 0, 0)
  return d1 === d2
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

export function HEX_to_RGB(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)] : [0, 0, 0]
}

export function TEXT_CONTRAST(r: number, g: number, b: number): string {
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'black' : 'white'
}

export function RGB_TO_HEX(r: number | string, g?: number | string, b?: number | string) {
  if (!g && !b && typeof r === 'string') {
    const [_r, _g, _b] = r.split(',')

    r = _r
    g = _g
    b = _b
  }

  r = Number(r)
  g = Number(g)
  b = Number(b)

  return (
    `#${[r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? `0${hex}` : hex
      })
      .join('')}`
  )
}

export function formatFileSize(bytes: string | number, round?: boolean) {
  if (typeof bytes === 'string')
    bytes = Number(bytes)

  if (Number.isNaN(bytes))
    return 0

  if (bytes / 1000000 > 1)
    return round ? `${Math.round(bytes / 1000000)}MB` : `${bytes / 1000000}MB`
  return round ? `${Math.round(bytes / 1000)}KB` : `${bytes / 1000}KB`
}

export function flag(code: string) {
  return `https://flagsapi.com/${code}/flat/32.png`
  // return `https://countryflagsapi.com/${type}/${code}`
}

export function median(numbers: Array<number>) {
  const sorted = Array.from(numbers).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0)
    return (sorted[middle - 1] + sorted[middle]) / 2

  return sorted[middle]
}

export function sanitize(text: string) {
  if (!text)
    return null

  const regex = /\bon\w+="?[\w:()']+"?/g
  return text.replaceAll(regex, '')
}

export const formats = ['.jpeg', '.gif', '.png', '.apng', '.svg', '.bmp', '.bmp', '.ico', '.jpg', '.webp']

export function isValidImage(text: string) {
  return formats.some(format => text.endsWith(format))
}

export function formatTimestamp(date: number) {
  date *= 1000
  const d = new Date(date)

  return `${padTo2Digits(d.getUTCHours())}:${padTo2Digits(d.getUTCMinutes())}, ${d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}`
}

export function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0')
}

export function randomSeed(seed: string) {
  function alphabetPosition(text: string) {
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const code = text.toUpperCase().charCodeAt(i)
      if (code > 64 && code < 91)
        result += code - 64
    }
    return Number(result.slice(0, result.length - 1))
  }
  let a = alphabetPosition(seed)
  let t = a += 0x6D2B79F5
  t = Math.imul(t ^ t >>> 15, t | 1)
  t ^= t + Math.imul(t ^ t >>> 7, t | 61)
  return ((t ^ t >>> 14) >>> 0) / 4294967296
}
export function seedRndMinMax(min: number, max: number, seed: string) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(randomSeed(seed) * (max - min + 1)) + min
}

export const storageKeys = {
  NEW_ALBUM_FROM_IMAGES: 'create_album_from_images',
  TO_ALBUM_FROM_IMAGES: 'add_to_album_from_images',
}
