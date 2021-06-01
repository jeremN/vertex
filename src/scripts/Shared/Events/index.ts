import { ScaleContinuousNumeric, scaleQuantize } from 'd3-scale'
import { bisector, Bisector } from 'd3-array'
import { event, mouse } from 'd3-selection'

import { IBisectNode, IDataNode } from './types'



/** Get x value from node, for ordinal scale */
export const getNodeOnOrdinalScale = (container: HTMLElement, scaleX: ScaleContinuousNumeric, correction: number = 0): number => {
  const coord = mouse(container)
  const s = scaleX
  s.invert = (x: any) => {
    const domain = scaleX.domain()
    const range = scaleX.range()
    const scale = scaleQuantize().domain(range).range(domain)
    return scale(x)
  }

  return s.invert(coord[0] + correction)
}

/** Get x value from node, for time scale
  * @param {HTMLElement} container
  * @param {ScaleContinuousNumeric} scaleX
  * @param {number} correction
  * @return {number}
  */
export const getNodeOnTimeScale = (container: HTMLElement, scale: ScaleContinuousNumeric<Range, Output, Unknown = never>, correction: number = 0): number => scale.invert(
  mouse(container)[0] + correction,
)

/** 
  * Get datas from hovered node with bisector
  * @param {any} x0
  * @param {Bisector} bisector
  * @param {array} data
  * @param {string} title
  * @param {array} scales [x, y]
  * @return {IBisectNode}
  */
export const getDatasFromNodeBisect = (x0: any | number, bisector: Bisector<any[], number>, data: any[], title: string, scales: any[] | [any, any] = []): IBisectNode => {
  const i = bisector(data, x0)
  const d0 = data[i - 1]
  const d1 = data[i]
  const node = {
    title,
    content: '',
    y: '',
    x: '',
  }

  if (d0 === undefined || d1 === undefined) return node

  if (x0 - d0.x > d1.x) {
    node.content = d1
    node.y = scales[1](d1.y)
    node.x = scales[0](d1.x)
  } else {
    node.content = d0
    node.y = scales[1](d0.y)
    node.x = scales[0](d0.x)
  }
  return node
}

/** 
  * Get datas from hovered node
  * @param {any} x0
  * @param {array} data
  * @param {string} title
  * @return {IDataNode}
  */
export const getDatasFromNode = (x0: any, data: any[], title: string): IDataNode => {
  const node = {
    title,
    content: '',
    index: 0
  }

  data.find((j, i: number) => {
    if (j.x === x0) {
      node.index = i
      node.content = j
      return node
    }
    return false
  })

  return node
}

export const addListeners = (chartObject: any, svgElement: SVGElement) => {
  const that = chartObject
  const { events } = that.cfg

  if (!events || !Array.isArray(events)) throw new Error('events parameter must be an array')

  if (Array.isArray(events) && events.length) {
    events.map(evt => svgElement.on(evt.type, (d: any, i: number, nodes: any) => {
      event.preventDefault()
      evt.action(d, i, nodes, that)
    }))
  }
}
