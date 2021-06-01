import 'd3-selection'
import { Selection, select } from 'd3-selection'
import { mergeObject } from '../../Utilities'

import { ILegendConfig, ILegendStyle, IButtonConfig, IMarkerProps, IDropShadow, IGenericProps } from './types'

const defaultLegendConfig: ILegendConfig = {
  legendPos: [0, 0],
  legendColorSize: [6, 6],
  legendTextColor: '#000',

}

const defaultLegendStyles: ILegendStyle = {
  wrapCSS: `
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-size: 1rem;
  `,
  groupCSS: `
    display: flex;
    align-items: center;
  `,
  colorCSSRound: `
    width: 10px;
    height: 10px;
    border-radius: 50%;
  `,
  colorCSSRect: `
    height: 4px;
    width: 15px;
  `,
}

const defaultButtonConfig: IButtonConfig = {
  title: null,
  titleType: '',
  styles: {
    iconsCSS: `
      display: inline-block;
      width: 15px;
      height: 2px;
      margin-right: 0.4rem;
    `,
    btnCSS: `
      display: flex;
      align-items: center;
      font-size: 1rem;
    `,
    listCSS: 'display: flex;',
    titleCSS: 'margin: 0;',
  },
}

const defaultMarkerProps: IMarkerProps = {
  width: 5,
  height: 5,
  refX: 0,
  refY: 0,
  path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z',
  viewBox: '0 -5 10 10',
  id: 'stan__c__needleHead',
  fill: '#000',
}

const defaultDropShadowProps: IDropShadow = {
  id: 'stan__c__dropShadow',
  height: '150%',
  deviation: 5,
  dX: 3,
  dY: 3,
  units: 'objectBoundingBox',
}

/** Append legend */
export const appendLegend = (svg: Selection<SVGElement, any, any, any>, data: any[], cfg?: ILegendConfig): Selection<SVGElement, any, any, any> => {
  const conf = {
    ...defaultLegendConfig,
    ...cfg
  }

  const el = typeof svg !== 'object' ? select(svg) : svg;
  if (!el) throw new Error('svg must be typeof object or a string, for ex: "#myId"')
  if (!data || !Array.isArray(data)) throw new Error('data is undefined or not an Array')
  const svgEl = el?.node() as Element;
  const { width, height } = svgEl?.getBoundingClientRect()
  const spacing: number[] = [width / data.length, height / data.length]

  const legendWrap = el.append('g')
    .attr('class', 'stan__c__legendWrap stan__c__legendWrap--d3')
    .attr('transform', `translate(${conf.legendPos[0]}, ${conf.legendPos[1]})`)

  data.forEach((d, i) => {
    const legendGroup = legendWrap.append('g')
      .attr('class', 'stan__c__legendGroup')
      .attr('transform', `translate(0, ${spacing[1] / 2 + spacing[1] / 4 * i})`)
      .attr('width', spacing)
      .attr('height', spacing)

    legendGroup.append('text')
      .attr('class', 'stan__c__legendText')
      .attr('x', conf.legendColorSize[0] + 10)
      .attr('y', conf.legendColorSize[1] + 5)
      .style('fill', conf.legendTextColor)
      .text(d.name)

    if (d.round) {
      legendGroup.append('circle')
        .attr('class', 'stan__c__legendColor')
        .attr('r', conf.legendColorSize[0])
        .attr('cx', 4)
        .attr('cy', 4)
        .attr('fill', d.color)
    } else {
      legendGroup.append('rect')
        .attr('class', 'stan__c__legendColor')
        .attr('width', conf.legendColorSize[0])
        .attr('height', conf.legendColorSize[1])
        .attr('x', 4)
        .attr('y', 4)
        .attr('fill', d.color)
    }
  })

  return legendWrap
}

/** Append HTML Legend */
export const appendHtmlLegend = (container: string, data: any[], insert: InsertPosition = 'afterbegin', cssStyles: ILegendStyle) => {
  if (!container) throw new Error('container parameter is missing')
  if (!data || !Array.isArray(data) || !data.length) throw new Error('data parameter is empty, missing or not an array')
  const styles = { 
    ...defaultLegendStyles, 
    ...cssStyles
  }

  const html = `
    <div
      class="stan__c__legendWrap stan__c__legendWrap--html"
      style="${styles.wrapCSS}">
      ${data.map(legend => `
        <div
          class="stan__c__legendGroup"
          style="${styles.groupCSS}">
          <span
            class='stan__c__legendColor stan__c__legendColor__${legend.round ? 'circle' : 'rect'}'
            style="${legend.round ? styles.colorCSSRound : styles.colorCSSRect} background-color: ${legend.color};"></span>
          <span style="margin-left: 0.5rem;">${legend.name}</span>
        </div>
      `).join('')}
    </div>
  `

  document.querySelector<Element>(`${container}`)?.insertAdjacentHTML(insert, html)
}

/* Append buttons */
export const appendButtons = (container: HTMLElement, datas: any[], insert: InsertPosition = 'afterbegin', cfg: IButtonConfig) => {
  const options = {
    ...defaultButtonConfig,
    ...cfg,
    styles: {
      ...defaultButtonConfig.styles,
      ...cfg?.styles
    }
  }

  if (!container) throw new Error('container parameter is missing')
  if (!datas || !datas.length) throw new Error('datas parameter is missing or is empty')
  if (options.title && !options.titleType) throw new Error('titleType parameter is required if you use title parameter')

  const html = `
    <div class="stan__c__buttons">
      ${options.title ? `<${options.titleType} style="${options.styles.titleCSS}">${options.title}</${options.titleType}>` : ''}
      <div class="stan__c__buttons__list" style="${options.styles.listCSS}">
        ${datas.map(({ name, color, isActive }) => `
          <button
            class="stan__c__button stan__c__buttons__button ${isActive ? 'is__active' : ''}"
            data-value="${name}"
            style="${options.styles.btnCSS}">
            <span class="stan__c__button__icon" style="${options.styles.iconsCSS} background-color: ${color};"></span>
            ${name}
          </button>
        `).join('')}
      </div>
    </div>
  `
  document.querySelector(`${container}`)?.insertAdjacentHTML(insert, html)
}

/* Toggle chart Item */
export const toggleChartItem = (chartObject: any, selectors: any[]): void => {
  if (!chartObject) throw new Error('chartObject parameter is missing')
  if (!selectors
    || !Array.isArray(selectors)
    || !selectors.length) throw new Error('selectors parameter is missing, not an array or empty')

  const that = chartObject
  const {
    chartClassNames,
  } = that.cfg

  selectors.forEach((select) => {
    const value = select.getAttribute('data-value')

    select.addEventListener('click', () => {
      const selectClasses = select.classList
      const wrap = that.g.select(`.${chartClassNames.groupA}`)
      const item = wrap.select(`.${chartClassNames.default}[data-title="${value}"]`)

      selectClasses.toggle('is__active')

      item.style('display', () => (selectClasses.contains('is__active') ? 'block' : 'none'))
    })
  })
}

/* Append axis labels */
export const appendAxisLabels = (svg: Selection<SVGElement, any, any, any>, text: string, transform: null | string = null, pos: [number, number] = [0, 0]): Selection<SVGTextElement, any, any, any> => {
  if (!svg || !text) throw new Error('svg or text parameter is missing')

  const label = svg.append('text')
    .attr('x', pos[0])
    .attr('y', pos[1])
    .style('text-anchor', 'middle')
    .text(text)

  if (transform) {
    label.attr('transform', transform)
  }

  return label
}

/* Append graph title */
export const appendGraphTitle = (svg: Selection<SVGElement, any, any, any>, text: string, className: null | string = null, pos: [number, number] = [0, 0]): Selection<SVGTextElement, any, any, any> => {
  if (!svg || !text) throw new Error('svg or text parameter is undefined')

  const title = svg.append('text')
    .attr('x', pos[0])
    .attr('y', pos[1])
    .attr('text-anchor', 'middle')
    .attr('class', `stan__c__chartTitle ${className}`)

  if (Array.isArray(text) && text.length) {
    for (let i = 0; i < text.length; i += 1) {
      title.append('tspan')
        .attr('class', `stan__c__chartTitle__span c__chartTitle__span${i}`)
        .attr('x', pos[0])
        .attr('dy', i * 10)
        .text(text[i])
    }
  } else {
    title.text(text)
  }

  return title
}

/* Add arrow marker */
export const addMarker = (chartObject: any, { ...props }) => {
  const that = chartObject
  const conf = mergeObject(defaultMarkerProps, { ...props })

  that.marker = that.svg.append('defs')
    .append('marker')
    .attr('id', conf.id)
    .attr('class', 'stan__c__arrow')
    .attr('viewBox', conf.viewBox)
    .attr('refY', conf.refY)
    .attr('refX', conf.refX)
    .attr('markerWidth', conf.width)
    .attr('markerHeight', conf.height)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', conf.path)
    .attr('fill', conf.fill)
}

export const addDropShadow = (chartObject: any, { ...props }: IGenericProps): void => {
  const that = chartObject
  const conf = mergeObject(defaultDropShadowProps, { ...props })
  const def = that.svg.append('defs')

  const filter = def.append('filter')
    .attr('id', conf.id)
    .attr('height', conf.height)
    .attr('filterUnits', conf.units)

  if (conf.units !== 'objectBoundingBox') {
    if (!conf.uX
      || !conf.uY
      || !conf.uW
      || !conf.uH) throw new Error('You must specified uX, uY, width && height for "userSpaceOnUse"')
    filter.attr('x', conf.uX)
      .attr('y', conf.uY)
      .attr('width', conf.uW)
      .attr('height', conf.uH)
  }

  filter.append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', conf.deviation)
    .attr('result', 'blur')

  filter.append('feOffset')
    .attr('in', 'blur')
    .attr('dx', conf.dX)
    .attr('dy', conf.dY)
    .attr('result', 'offsetBlur')

  const merge = filter.append('feMerge')
  merge.append('feMergeNode')
    .attr('in', 'offsetBlur')
  merge.append('feMergeNode')
    .attr('in', 'SourceGraphic')
}

/* Append clip-path to svg element */
export const appendClipPath = (chartObject: any, id: string = 'stan__c__clipPath', correction: IGenericProps = {}): void => {
  const that = chartObject

  that.svg.append('defs')
    .append('clipPath')
    .attr('id', id)
    .append('rect')
    .attr('width', that.sWidth + (correction.w || 0))
    .attr('height', that.sHeight + (correction.h || 0))
    .attr('x', 0)
    .attr('y', 0)
}

/* Remove graph overlay */
export const removeGraphRectOverlay = (container: Selection<SVGElement, any, any, any>): void => {
  const overlay = container.selectAll('.stan__c__overlay')
  overlay?.node()?.remove()
}

export interface IGraphRectOverlayProps {
  g: Selection<SVGElement, any, any, any>;
  data: any[];
  width: number;
  height: number;
  events?: any[];

}

/* Append graph overlay (rect) */
export const appendGraphRectOverlay = (config: IGraphRectOverlayProps): Selection<SVGRectElement, any, SVGElement, any> => {
  if (!config || !Object.keys(config).length) {
    throw new Error('Config parameter required')
  }

  const overlay = config.g.selectAll('.stan__c__overlay')
    .data(config.data)
    .enter()
    .append('rect')
    .attr('width', config.width)
    .attr('height', config.height)
    .attr('data-id', (d, i) => d.id || `${d.name}-${i}`)
    .attr('fill', 'none')
    .attr('class', 'stan__c__overlay')
    .attr('pointer-events', 'all')

  if (config.events && config.events.length) {
    config.events.map(evt => overlay.on(evt.type, evt.action))
  }

  return overlay
}


/* Append circles */
export const appendGraphCircles = (chartObject: any): void => {
  const that = chartObject
  const {
    customX,
    customY,
    data,
    colors,
    r,
    xScale,
    yScale,
  } = that
  const { color, values } = data[0]
  if (!that.r) that.r = 12

  that.dotGroup = that.g.append('g')
    .attr('class', 'stan__c__chart__circleGroup')

  that.dots = that.dotGroup.selectAll('.stan__c__chart__circle')
    .data(values, (({ x }) => x))
    .enter()
    .append('circle')
    .attr('class', 'stan__c__chart__circle')
    .attr('r', ({ y }) => (typeof r !== 'number' ? r(y) : r))
    .attr('cx', ({ x }) => (!customX ? xScale(x) : customX(x)))
    .attr('cy', ({ y }) => (!customY ? yScale(y) : customY(y)))
    .style('fill', (d, i) => {
      if (!color) {
        const elColor = Array.isArray(colors) ? colors[i] : colors
        return elColor
      }
      return color
    })
}
