import { Selection } from 'd3-selection'

export interface SvgArgs {
  classModifier: string;
  className: string;
  chartTitle: string;
  margin: {
    left: number;
    top: number;
  }
  width: number;
  height: number;
  container: string;
}

export interface VertexSvg {
  svg: Selection<SVGSVGElement, unknown, HTMLElement, any>;
  g: Selection<SVGGElement, unknown, HTMLElement, any>;

}

export interface VertexAxis {
  [keyX: string]: string;
}

export interface AxisIndex {
  x: number;
  y: number;
}

export interface RenderAxesArgs {
  formatParse?: any; // d3.timeParse
  formatDate?: any; // d3.formatDate
  applyOnAxis?: string;
  tickFormatter?: [];
  axisName: string;
  isUpdating: boolean;
}