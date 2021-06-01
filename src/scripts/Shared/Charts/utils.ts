import * as d3 from 'd3'
import { capitalizeFirstLetter } from '../../Utilities/index'

/* Get scale
  *  @aram {array} data
  *  @return {object}
  */
export const chartScale = (data: any[]): {xExtent: any, yExtent: any} => {
  const arr = data.map(d => d.values).reduce((a, b) => a.concat(b), [])
  const xExtent = d3.extent(arr, d => d.x)
  const yExtent = d3.extent(arr, d => d.y)

  if (yExtent[0] > 0) {
    yExtent[0] = 0
  }
  return { xExtent, yExtent }
}

/* Get axis direction
  *  @param {string} direction
  *  @return {d3Function}
  */
export const getAxisDirection = (direction: string) => d3[`axis${capitalizeFirstLetter(direction)}`]()

/** Orders datas according to keys
  * @param {object} chartObject
  * @param {array} datas
  * @return {array}
  */
export const setSeries = (chartObject, datas: any[]): [] => {
  if (!chartObject) throw new Error('chartObject is required')
  const that = chartObject
  const data = datas || that.data

  return d3.stack()
    .keys(that.data[0].keys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetDiverging)(data)
}

/** Return size of axis ticks
  * @param {array} array
  * @param {number} sHeight
  * @param {number} sWidth
  * @return {array}
  */
export const checkTickSize = (array: any[], sHeight: number, sWidth: number): any[] => array.map((item, i) => {
  let tempItem = item
  if (typeof item === 'string') {
    tempItem = i === 0 ? -sHeight : -sWidth
  }
  return tempItem
})
