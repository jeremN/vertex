import * as d3 from 'd3'
import { isFunction } from '../../utilities'

export const defaultLineConstructor = (chartObject, interpolation) => {
  const {
    xScale,
    yScale,
    cfg: {
      curveInterpolation,
    },
  } = chartObject

  return d3.line()
    .x(({ x }) => xScale(x))
    .y(({ y }) => yScale(y))
    .curve(d3[`curve${interpolation || curveInterpolation}`])
}

/* Render path line
  *  @param {Object} chartObject
  */
export const renderLines = (chartObject) => {
  const that = chartObject
  const {
    colors,
    lineConstructor,
    useLineConstructor,
    strokeWidth,
    chartClassNames,
    clipPathId,
    dropShadowId,
    addSvgFilter,
    filterDatas,
  } = that.cfg

  if (!that.linesWrap) {
    that.linesWrap = that.g.append('g')
      .attr('class', chartClassNames.groupA)
      .attr('role', 'listitem')
  }

  that.lines = that.linesWrap.selectAll(`.${chartClassNames.default}`)
    .data(that.data.filter((d, i, nodes) => {
      if (isFunction(filterDatas) && filterDatas) return filterDatas(d, i, nodes)
      return d
    }), ({ name }) => name)
    .enter()
    .append('path')
    .attr('class', chartClassNames.default)
    .attr('d', ({ interpol, type, values }) => {
      if (useLineConstructor) {
        return lineConstructor(that, type)(values)
      }
      return (that.defaultLineType ? that.defaultLineType(interpol)(values)
        : defaultLineConstructor(that, interpol)(values))
    })
    .attr('data-id', ({ id, name }, i) => id || `${name}-${i}`)
    .attr('data-title', ({ name }) => name)
    .style('fill', 'none')
    .style('display', (d) => {
      const { isActive } = d
      const disp = (typeof isActive === 'boolean' && !isActive) ? 'none' : null
      return disp
    })
    .style('stroke', (d, i) => {
      if (!d.color) {
        const color = Array.isArray(colors) ? colors[i] : colors
        return color
      }
      return d.color
    })
    .style('stroke-width', (d) => {
      if (d.strokeWidth) {
        return d.strokeWidth
      }
      return strokeWidth
    })

  if (clipPathId) that.lines.attr('clip-path', `url(${clipPathId})`)
  if (addSvgFilter) that.lines.attr('filter', `url(${dropShadowId})`)
}

/* Animate path line
  *  @param {Object} chartObject
  *  @param {Bool} isAnimated
  */
export const animatedLine = (chartObject, isAnimated) => {
  const that = chartObject
  if (!isAnimated) {
    return that.lines.style('stroke-dasharray', ({ dashArray }) => (!dashArray
      ? 0 : `${dashArray[0]}, ${dashArray[1]}`))
  }

  const { duration, delay, easing } = that.cfg.animationDefault
  return that.lines.style('stroke-dasharray', 2000)
    .style('stroke-dashoffset', 2000)
    .transition()
    .ease(easing || d3.easeLinear)
    .delay((d, i) => i * delay)
    .duration(duration)
    .style('stroke-dashoffset', 0)
    .on('end', () => {
      that.lines.style('stroke-dasharray', ({ dashArray }) => (!dashArray
        ? 0 : `${dashArray[0]}, ${dashArray[1]}`))
    })
}

/* Update path line
  *  @param {Object} chartObject
*/
export const updateLine = (chartObject) => {
  const that = chartObject
  const {
    colors,
    lineConstructor,
    useLineConstructor,
    strokeWidth,
    chartClassNames,
    clipPathId,
    dropShadowId,
    addSvgFilter,
    filterDatas,
  } = that.cfg

  that.lines = that.linesWrap.selectAll(`.${chartClassNames.default}`)
    .data(that.data.filter((d, i, nodes) => {
      if (isFunction(filterDatas) && filterDatas) return filterDatas(d, i, nodes)
      return d
    }), ({ name }) => name)

  that.lines.enter()
    .append('path')
    .merge(that.lines)
    .attr('class', chartClassNames.default)
    .attr('d', ({ interpol, type, values }) => {
      if (useLineConstructor) {
        return lineConstructor(that, type)(values)
      }

      return (that.defaultLineType ? that.defaultLineType(interpol)(values)
        : defaultLineConstructor(that, interpol)(values))
    })
    .style('fill', 'none')
    .style('stroke', (d, i) => {
      if (!d.color) {
        const color = Array.isArray(colors) ? colors[i] : colors
        return color
      }
      return d.color
    })
    .style('display', (d) => {
      const { isActive } = d
      const disp = (typeof isActive === 'boolean' && !isActive) ? 'none' : null
      return disp
    })
    .style('stroke-width', strokeWidth)
    .attr('data-id', ({ id, name }, i) => id || `${name}-${i}`)
    .attr('data-title', ({ name }) => name)

  that.lines.exit().remove()

  that.lines = that.linesWrap.selectAll(`.${chartClassNames.default}`)
    .data(that.data, ({ name }) => name)

  if (clipPathId) that.lines.attr('clip-path', `url(${clipPathId})`)
  if (addSvgFilter) that.lines.attr('filter', `url(${dropShadowId})`)
}
