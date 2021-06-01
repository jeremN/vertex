import { scaleLinear, scaleTime } from 'd3-scale'
import { bisector, Bisector } from 'd3-array'

import { ILineChartConfig } from './types'
import { VertexConfig } from '../../Init/types'

import * as lineFunctions from './utils'
import Render, { initialConfig} from '../../Render'
import { chartScale } from '../../Shared/Charts/utils'
import { isFunction } from '../../utilities'
import { simpleDataFormatter } from '../../Shared/Formatters'

const lineInitialConfig: ILineChartConfig = {
  ...initialConfig,
  strokeWidth: 2,
  lineConstructor: null,
  useLineConstructor: false,
  curveInterpolation: 'Linear', // https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
  classModifier: 'line',
  chartClassNames: {
    groupA: 'stan__c__chart__lineGroup',
    default: 'stan__c__chart__line',
  },
}

/**  Line chart
  *  @param {Object} config - see RenderChart
  *  @param {Function} lineConstructor - used for line charts render if useLineConstructor is true
  *  @param {String} curveInterpolation - first letter uppercase !important
  *  @param {Bool} useLineConstructor - enable / disabled use of lineConstructor
  *  @param {Number} strokeWidth - stroke width for line element
  */
class LineChart extends Render {
  lines: null | HTMLElement;
  bisectDate?: any;


  constructor(config: ILineChartConfig) {
    const conf = {...lineInitialConfig, ...config }
    super(conf)
    this.lines = null

    this.getScale()
      .renderAxis()
  }

  // Get scale for chart, see: https://github.com/d3/d3-scale/blob/master/README.md
  getScale() {
    const { formatParse, formatDate } = this.cfg
    const xIsNan = typeof this.cfg.data[0]?.values[0].x !== 'number'
    // Use scaleTime if x is not a number AND formatParse is not empty
    const scale = xIsNan && formatParse ? scaleTime() : scaleLinear()

    // if x is not a number AND formatParse is not empty, we format datas,
    // String in x transformed into Date
    if (xIsNan && formatParse) {
      const tempData = simpleDataFormatter(this.data, formatDate, formatParse)
      this.data = tempData
    }

    // Get max & min for x, y
    const { xExtent, yExtent } = chartScale(this.data)

    // Set x scale
    this.xScale = scale
      .range([0, this.sWidth ?? 0])
      .domain(xExtent)

    // Set y scale
    this.yScale = scaleLinear()
      .range([this.sHeight ?? 0, 0])
      .domain(yExtent)
      .nice()

    // Add bisector if formatParse not empty
    if (formatParse) {
      this.bisectDate = bisector(({ x }) => x).left
    }

    return this
  }

  get chartObject() {
    return this
  }

  renderLineChart() {
    const {
      lineConstructor,
      useLineConstructor,
      hasAnimation,
      addAnimations,
      addSvgElements,
      addSvgFilter,
      isResponsive,
      axisCentered,
      addCustomAxis,
    } = this.cfg

    if (useLineConstructor && !lineConstructor) throw new Error('lineConstructor required')

    if (addSvgFilter) addSvgFilter(this)

    lineFunctions.renderLines(this)
    lineFunctions.animatedLine(this, hasAnimation)

    if (!hasAnimation && isFunction(addAnimations)) addAnimations(this)
    if (addSvgElements && isFunction(addSvgElements)) addSvgElements(this)

    if (axisCentered && axisCentered !== 'both') this.renderAxes(axisCentered)

    if (addCustomAxis && isFunction(addCustomAxis) && axisCentered) addCustomAxis(this)

    this.addUI()
      .listener(this.lines)

    if (isResponsive) this.onResize()

    return this
  }

  onResize() {
    window.addEventListener('resize', () => {
      this.resizeChart()
    })
  }

  resizeChart() {
    const { addResponsiveFn } = this.cfg

    this.getResizedDimension()
      .getResizedScale()
      .updateAxis()
      .getResizedLineChart()

    if (addResponsiveFn && isFunction(addResponsiveFn)) addResponsiveFn(this)
  }

  getResizedLineChart() {
    const {
      useLineConstructor,
      lineConstructor,
      chartClassNames,
    } = this.cfg

    this.lines = this.g.selectAll(`.${chartClassNames.default}`)
      .attr('d', ({ interpol, type, values }) => {
        if (useLineConstructor) {
          return lineConstructor(this, type)(values)
        }
        return lineFunctions.defaultLineConstructor(this, interpol)(values)
      })

    return this
  }

  getResizedScale() {
    this.xScale?.range([0, this.sWidth])
    this.yScale?.range([this.sHeight, 0])
    return this
  }

  /* Update line chart
    *  @param {Array} newData
    *  @param {Function} callback
    */
  updateLine(newData, callback) {
    this.data = newData
    this.getScale()
      .updateAxis()

    lineFunctions.updateLine(this)
    lineFunctions.animatedLine(this, this.cfg.hasAnimation)

    this.listener(this.lines)
    if (isFunction(callback)) callback(this)

    return this
  }

  addUI() {
    const { addChartUI } = this.cfg
    this.renderAxisLabels()
    if (addChartUI && isFunction(addChartUI)) addChartUI(this)
    return this
  }
}

export default LineChart
