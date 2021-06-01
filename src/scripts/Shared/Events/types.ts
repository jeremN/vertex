import { ScaleContinuousNumeric } from "d3-scale";
import { Output } from "webpack";

export interface IDataNode {
  title: string;
  content: any | string;
  index?: number ;
}

export interface IBisectNode {
  title: string;
  content: string;
  y: ScaleContinuousNumeric<Range, Output, never>;
  x: ScaleContinuousNumeric<Range, Output, never>;
}
