export interface ILegendConfig {
  legendPos: [number, number];
  legendColorSize: [number, number];
  legendTextColor: string;
}

export interface ILegendStyle {
  wrapCSS: string;
  groupCSS: string;
  colorCSSRound: string;
  colorCSSRect: string;
}

export interface IButtonStyle {
  iconsCSS: string;
  btnCSS: string;
  listCSS: string;
  titleCSS: string;
}

export interface IButtonConfig {
  title: null | string;
  titleType: string;
  styles?: IButtonStyle;
}

export interface IMarkerProps {
  width: number;
  height: number;
  refX: number;
  refY: number;
  path: string;
  viewBox: string;
  id: string;
  fill: string;
}

export interface IDropShadow {
  id: string;
  height: string;
  deviation: number;
  dX: number;
  dY: number;
  units: string;
}

export interface IGenericProps {
  [key: string]: any;
}

