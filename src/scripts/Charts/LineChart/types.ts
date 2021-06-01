import { VertexConfig } from './../../Init/types';

export interface ILineChartConfig extends VertexConfig {
    strokeWidth: number;
    useLineConstructor: boolean;
    curveInterpolation: string; // https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
    classModifier: string;
    chartClassNames: IChartClassnames;
    lineConstructor: any;
    addAnimations?: any;
    addSvgElements?: any;
    addSvgFilter?: any;
}

export interface IChartClassnames {
  groupA: string;
  default: string;
}