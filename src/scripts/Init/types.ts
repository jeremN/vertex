export interface GenericData {
  [key: string]: GenericData | any | object[] | any[];
}

export interface VertexDefaultConfig {
  data: GenericData;
  containerName: string;
  container: null | Element;
  margin: Margins;
  activeThirdRatio?: boolean;
  dimension: [] | [number, number];
  className: string;
  classModifier: string;
  chartTitle: string;
  hasAxis: boolean | [boolean, boolean]; // or [true, true]
  axisDirection: [string, string]; // Direction des axes [x, y]
  axisLabel: [];
  axisCentered: boolean | 'x' | 'y' | 'both'; // x, y or both, center axis (for negative data)
  isResponsive: boolean;
  formatParse: any; // d3.timeParse
  formatDate: any; // d3.formatDate
  applyOnAxis: string;
  events?: RenderEventsArray; // ex: [{type: 'mousemove', action: (d, i, nodes) => { doSemething }},]
  hasAnimation: boolean;
  animationDefault: AnimationProps;
  ticks: number| []; // Nbre de tick
  tickSize?: [number, number];
  tickFormatter: [any, any] | [];
  colors: string | [] | void;
  dropShadowId: string;
  clipPathId: string;
  isPieChart: boolean;
  addCustomAxis?: Function;
}

export interface VertexConfig {
  data: GenericData;
  containerName: string;
  container: null | Element;
  margin?: Margins;
  activeThirdRatio?: boolean;
  dimension?: [] | [number, number];
  className?: string;
  classModifier?: string;
  chartTitle?: string;
  hasAxis?: boolean | [boolean, boolean]; // or [true, true]
  axisDirection?: [string, string]; // Direction des axes [x, y]
  axisLabel?: [];
  axisCentered?: boolean | 'x' | 'y' | 'both'; // x, y or both, center axis (for negative data)
  isResponsive?: boolean;
  formatParse?: any; // d3.timeParse
  formatDate?: any; // d3.formatDate
  applyOnAxis?: string;
  events?: RenderEventsArray; // ex: [{type: 'mousemove', action: (d, i, nodes) => { doSemething }},]
  hasAnimation?: boolean;
  animationDefault?: AnimationProps;
  ticks?: number| []; // Nbre de tick
  tickSize?: [number, number];
  tickFormatter?: [any, any] | [];
  colors?: string | [] | void;
  dropShadowId?: string;
  clipPathId?: string;
  addCustomAxis?: Function;
}

export class RenderEventsArray extends Array<RenderEvents> {}
type RenderEventsValue = string | Function;
export interface RenderEvents {
  [k: string]: RenderEventsValue;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface AnimationProps {
  axisDuration?: number;
  duration?: number;
  delay?: number;
  easing?: any;
}

export interface SvgBoundaries {
  width: number;
  height: number;
}

export interface SvgInnerBoundaries {
  inWidth: number;
  inHeight: number;
}

export interface Render {
  container: null | undefined | HTMLElement;
  data: null | any[];
  xScale: null | number;
  yScale: null | number;
  defaultAxis: [null, null] | [string, string];
  cfg: VertexDefaultConfig;
  height: undefined | number;
  width: undefined | number;
  sWidth: undefined | number;
  sHeight: undefined | number;

}