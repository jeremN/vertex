import * as d3 from 'd3'

import { getAxisDirection, checkTickSize } from '../Shared/Charts/utils'
import { getValue, capitalizeFirstLetter } from '../Utilities/index'

export const renderSvg = (chartObject): void => {
  const that = chartObject
  const {
    classModifier,
    className,
    chartTitle,
    margin: {
      left,
      top,
    },
  } = that.cfg

  that.svg = d3.select(that.container).append('svg')
    .attr('width', that.width)
    .attr('height', that.height)
    .attr('viewBox', [0, 0, that.width, that.height])
    .attr('preserveAspectRatio', 'xMinYMid')
    .attr('class', `stan__c__chart ${classModifier ? `stan__c__chart--${classModifier}` : ''} ${className}`)
    .attr('aria-label', `${chartTitle ? `${chartTitle}` : `${classModifier}__chart`}`)
    .attr('role', 'group')

  that.g = that.svg.append('g')
    .attr('transform', `translate(${left}, ${top})`)
    .attr('role', 'list')
    .attr('aria-label', `${chartTitle ? `${chartTitle}__group` : `${classModifier}__group`}`)
}

export const setAxis = (chartObject, axisName): void => {
  if (!chartObject || !axisName) throw new Error('chartObject or axisName parameter are missing')
  const that = chartObject
  const {
    sHeight,
    sWidth,
    cfg: {
      ticks,
      tickSize,
      axisDirection,
    },
  } = that
  const tickSizing = checkTickSize(tickSize, sHeight, sWidth)
  const axisIndex = axisName === 'x' ? 0 : 1

  that[`axis${capitalizeFirstLetter(axisName)}`] = getAxisDirection(axisDirection[axisIndex])
    .scale(that[`${axisName}Scale`])
    .ticks(getValue(ticks, axisIndex))
    .tickSize(tickSizing[axisIndex])

  if (capitalizeFirstLetter(axisName) === 'Y') that[`axis${capitalizeFirstLetter(axisName)}`].tickSizeOuter(0)
}

export const renderAxis = (chartObject, axisName): void => {
  if (!chartObject || !axisName) throw new Error('chartObject or axisName parameter are missing')
  const that = chartObject
  that[`${axisName}Axis`] = that.g.append('g')
    .attr('class', `stan__c__axis--${axisName}`)
    .attr('transform', that[`center${capitalizeFirstLetter(axisName)}`] || null)
    .attr('aria-label', `${axisName}-axis`)
    .call(that[`axis${capitalizeFirstLetter(axisName)}`])
}

export const updateAxis = (chartObject, axisName): void => {
  const that = chartObject
  const { axisDuration } = that.cfg.animationDefault

  that[`${axisName}Axis`] = that.svg.selectAll(`.stan__c__axis--${axisName}`)
    .transition()
    .duration(axisDuration)
    .attr('transform', that[`center${capitalizeFirstLetter(axisName)}`])
    .call(that[`axis${capitalizeFirstLetter(axisName)}`])
}

export const setAxisCenter = (chartObject) => {
  const that = chartObject
  const {
    sHeight,
    sWidth,
    xScale,
    yScale,
    cfg: {
      axisDirection,
      axisCentered,
    },
  } = that

  that.centerX = `translate(0, ${sHeight})`
  that.centerY = null
  if (axisDirection[0] === 'top') that.centerX = 'translate(0, 0)'
  if (axisCentered === ('x' || 'both')) that.centerX = `translate(0, ${yScale(0)})`
  if (axisDirection[1] === 'right') that.centerY = `translate(${sWidth}, 0)`
  if (axisCentered === ('y' || 'both')) that.centerY = `translate(${xScale(0)}, 0)`
}
