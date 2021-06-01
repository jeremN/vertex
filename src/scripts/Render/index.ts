import { AxisIndex } from './types';
import { timeFormat } from 'd3-time-format';

import * as renderFunctions from './utils'

import { VertexConfig, VertexDefaultConfig, GenericData } from '../Init/types'
import { capitalizeFirstLetter, getValue, isFunction } from '../Utilities/index'
import { addListeners } from '../Shared/Events';
import { ILineChartConfig } from '../Charts/LineChart/types';

export const initialConfig: VertexDefaultConfig | ILineChartConfig = {
  data: [],
  container: null,
  containerName: '',
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  activeThirdRatio: true,
  dimension: [],
  className: 'vertex__chart',
  classModifier: '',
  chartTitle: '',
  hasAxis: true,
  axisDirection: ['bottom', 'left'],
  axisLabel: [],
  axisCentered: false,
  isResponsive: false,
  formatParse: null,
  formatDate: null,
  applyOnAxis: 'x',
  events: [],
  hasAnimation: false,
  animationDefault: {
    axisDuration: 250,
    delay: 100,
    duration: 800,
    easing: null // d3.easeExp
  },
  ticks: 5,
  tickSize: [6, -6],
  tickFormatter: [],
  colors: '',
  dropShadowId: '',
  clipPathId: '',
  isPieChart: false,
}

export default class Render {
  container: null | undefined | HTMLElement = null;
  data: GenericData = [];
  xScale: null | number = null;
  yScale: null | number = null;
  defaultAxis: [null, null] | [string, string] = [null, null];
  cfg: VertexDefaultConfig | ILineChartConfig;
  height: undefined | number;
  width: undefined | number;
  sWidth: undefined | number;
  sHeight: undefined | number;
  [key: string]: any;

  // todo: add a mandatory properties check (data, containerName ...)
  constructor(config: null | VertexConfig = null) {
    this.container = null
    this.data = []
    this.xScale = null
    this.yScale = null
    this.cfg = {
      ...initialConfig,
      ...config
    }
    this.defaultAxis = ['x', 'y']

    this.render()
  }

  private dataIsValid(data: GenericData): boolean {
    return Array.isArray(data) && data.length >= 1
  }

  updateConfig(updatedConfig: VertexConfig | ILineChartConfig): this {
    const newConfig = {
      ...this.cfg,
      ...updatedConfig
    }
    this.cfg = newConfig

    return this
  }

  getSvgProps(): void {
    const {
      data,
      dimension,
      containerName,
      isPieChart,
      activeThirdRatio,
      margin: {
        left,
        top,
        right,
        bottom,
      },
    } = this.cfg
    const aspectRatio: number = 1.78

    const isDataValid = this.dataIsValid(data)

    if (!isDataValid) throw new Error('Data must be an array')
    if (!containerName) throw new Error('containerName parameter in config is missing')

    this.container = document.querySelector<HTMLElement>(`${containerName}`)

    if (!this.container) throw new Error(`container doesn't exist with id or classname ${containerName}`)

    const { offsetWidth, offsetHeight }: {offsetWidth: number, offsetHeight: number } = this.container
    let [w, h]: [number, number] = [offsetWidth, offsetHeight]

    if (offsetHeight === 0) h = w / aspectRatio
    if (dimension?.length) [w, h] = [dimension[0] || w, dimension[1] || h]

    this.data = data
    this.width = w
    this.height = h

    if (this.height < this.width / 3 && activeThirdRatio) this.height = this.width / 3
    if (isPieChart && !dimension[1]) this.height = this.width

    this.sWidth = this.width - left - right
    this.sHeight = this.height - top - bottom
  }

  render() {
    this.getSvgProps()

    if (this.container) {
      this.container.innerHTML = ''
    }

    renderFunctions.renderSvg(this)
  }

  getResizedDimension() {
    const {
      dimension,
      margin: {
        left,
        top,
        right,
        bottom,
      },
    } = this.cfg
    const ratio = dimension.length ? dimension[0] / dimension[1] : 1.78
    const newWidth = this?.container?.getBoundingClientRect().width ?? 0
    let [newW, newH] = [newWidth, newWidth / ratio]

    if (dimension.length && newWidth >= dimension[0]) {
      [newW, newH] = [dimension[0], dimension[1]]
    }

    this.width = newW
    this.height = newH
    this.sWidth = this.width - left - right
    this.sHeight = this.height - top - bottom
    this.svg.attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])

    return this
  }

  renderAxes(axisName: 'x' | 'y' | 'both', isUpdating: boolean = false) {
    if (!this[`${axisName}Scale`]) return

    const {
      formatParse,
      formatDate,
      tickFormatter,
      applyOnAxis,
    } = this.cfg

    const axisIndex: AxisIndex = {
      x: 0,
      y: 1,
    }

    renderFunctions.setAxis(this, axisName)

    if (Array.isArray(tickFormatter) && tickFormatter[axisIndex[axisName]]) {
      this[`axis${capitalizeFirstLetter(axisName)}`].tickFormat(
        getValue(tickFormatter, axisIndex[axisName]),
      )
    }

    if (formatParse && formatDate && applyOnAxis === axisName) {
      this[`axis${capitalizeFirstLetter(axisName)}`].tickFormat(timeFormat(formatDate))
    }

    renderFunctions.setAxisCenter(this)

    if (isUpdating) renderFunctions.updateAxis(this, axisName)
    else renderFunctions.renderAxis(this, axisName)
  }

  renderAxis() {
    const {
      hasAxis,
      axisCentered,
    } = this.cfg
    const hasAxisType = typeof hasAxis

    this.defaultAxis.forEach((axis: any, index: number) => {
      if ((hasAxisType === 'boolean' && hasAxis && !axisCentered)
        || (Array.isArray(hasAxis) && hasAxis[index])) {
        this.renderAxes(axis)
      } else if (axisCentered && axisCentered === (axis || 'both')) {
        // const reversedAxis = this.defaultAxis.slice().reverse()
        this.renderAxes(axis)
      }
    })

    if (this.cfg.addCustomAxis && isFunction(this.cfg.addCustomAxis) && !this.cfg.axisCentered) {
      this.cfg.addCustomAxis(this)
    }

    return this
  }

  renderAxisLabels() {
    const {
      margin,
      axisDirection,
      axisLabel,
      hasAxis,
    } = this.cfg

    if (axisLabel.length) {
      let xAxisPos = [(this.width ?? 0) / 2, (this.height ?? 0) - margin.top / 4]
      let yAxispos = [-(this.height ?? 0) / 2, margin.left / 4]
      let yTransform = 'rotate(-90)'
      const xTransform = null

      if (axisDirection[1] === 'right') {
        yAxispos = [(this.height ?? 0) / 2, -(this.width ?? 0) + margin.right / 2]
        yTransform = 'rotate(90)'
      }

      if (axisDirection[0] === 'top') {
        xAxisPos = [(this.width ?? 0) / 2, margin.top / 2]
      }

      if (hasAxis[0] || hasAxis) {
        this.xAxis = appendAxisLabels(this.svg, axisLabel[0], xTransform, xAxisPos)
      }

      if (hasAxis[1] || hasAxis) {
        this.yAxis = appendAxisLabels(this.svg, axisLabel[1], yTransform, yAxispos)
      }
    }
  }

  updateAxis() {
    this.defaultAxis.forEach((axis: any) => { this.renderAxes(axis, true) })
    return this
  }

  listener(svgElement: SVGElement) {
    addListeners(this, svgElement)
    return this
  }
}
