import { GenericData } from './../../Init/types';
import { timeFormat, timeParse } from 'd3-time-format'

/**
  * Parse string to date, then format date to string
  * @param {string} formatParse
  * @param {string} formatDate
  * @param {string} strToParse
  * @return {string}
  */
export const timeFormatter = (formatParse: string, formatDate: string, strToParse: string): (Date | null) => {
  const time = timeFormat(formatDate)
  const parse = timeParse(formatParse)
  return time(parse(strToParse))
}

/** 
  * Parse string to date
  * @param {string} formatParse
  * @param {String} string
  * @return {Date}
  */
export const dateParser = (formatParse: string, strToParse: string): (Date | null) => {
  const parser = timeParse(formatParse)
  return parser(strToParse)
}

/** 
  * Format date to string
  * @param {string} formatDate
  * @param {Date} date
  * @return {string}
  */
export const dateFormatter = (formatDate: string, date: Date): string => {
  const time = timeFormat(formatDate)
  return time(date)
}

/** 
  * Format data
  * @param {array} datas
  * @param {string} formatDate
  * @param {string} formatParse
  * @return {array}
  */
export const simpleDataFormatter = (datas: GenericData, formatDate: string, formatParse: string): GenericData => {
  datas.map((d: { values: any[]; }) => d.values.forEach((j: any) => {
    const i = j
    const { x, y } = j
    let formattedDate = x
    if (formatDate && formatParse) formattedDate = timeFormatter(formatParse, formatDate, x)
    else if (formatParse && !formatDate) formattedDate = dateParser(formatParse, x)
    else if (formatDate && !formatParse) formattedDate = dateFormatter(formatDate, x)
    const numVal = +y

    i.x = formattedDate
    i.y = numVal
  }))
  
  return datas
}

/** 
  * Convert data from cartesian coordinates
  * @param {number} width
  * @param {number} height
  * @param {number} x, y 
  * @param {number} y 
  * @return {array}
  */
export const fromCartesian = (width: number, height: number, x: number, y: number): [number, number] => {
  const originX = width / 2
  const originY = height / 2
  return [originX + x, originY - y]
}

/** 
  * Convert data to cartesian coordinates
  * @param {number} width
  * @param {number} height
  * @param {number} x, y 
  * @param {number} y 
  * @return {array}
  * @return {Array}
  */
export const toCartesian = (width: number, height: number, x: number, y: number): [number, number] => {
  const originX = width / 2
  const originY = height / 2
  return [x - originX, -y + originY]
}
