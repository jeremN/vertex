import { VertexConfig, SvgBoundaries, Margins, SvgInnerBoundaries } from './types';

const initialConfig: VertexConfig = {
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
  clipPathId: ''
}

export default function init (config: VertexConfig): VertexConfig {
  const datas: any[] = config.data 
  if (!Array.isArray(datas) && !config.data.length > 0) {
    throw new Error('Data parameter is not an array or/and is empty')
  }
  
  if (!config.containerName) {
    throw new Error('containerName parameter is missing')
  }

  const container: HTMLElement | null = document.querySelector<HTMLElement>(`${config.containerName}`);

  if (!container) {
    throw new Error(`Cannot find an element with classname or id: ${config.containerName}`)
  }

  const vertexCfg: VertexConfig = { 
    ...initialConfig,  
    ...config,
    container
  }

  return vertexCfg
}

export function getContainerBoundaries(container: HTMLElement): [number, number] {
  const { offsetWidth, offsetHeight }: { offsetWidth: number, offsetHeight: number} = container
  const [w, h]: [w: number, h: number] = [offsetWidth, offsetHeight]
  return [w, h]
}

export function getSvgBoundaries(containerBoundaries: [number, number], dimension?: [] | [number, number], activeThirdRatio: boolean = false, chartType: string = ''): SvgBoundaries {
  const chartTypes: string[] = ['pie']
  let [w, h]: [w: number, h: number] = containerBoundaries
  let [width, height]: [width: number, height: number] = [0, 0]

  if (h === 0) h = w / 1.78
  if (Array.isArray(dimension) && dimension.length) {
    const [dWidth, dHeight]: [dWidth: number, dHeight: number] = dimension
    w = dWidth || w
    h = dHeight || h
  }
  
  if (h < w / 3 && activeThirdRatio) height = w / 3
  if (chartType && chartTypes.includes(chartType) && dimension && !dimension[1]) {
    height = w
  }

  return { width, height }
}

export function getSvgInnerBoundaries({ width, height }: SvgBoundaries, {left, right, top, bottom}: Margins): SvgInnerBoundaries {
  return {inWidth: width - left - right, inHeight: height - top - bottom }
}

