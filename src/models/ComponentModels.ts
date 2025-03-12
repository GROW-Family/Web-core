export type ButtonProps = {
  text?: string;
  width?: number;
  height?: number;
  size?: number | string; // 'small' | 'medium' | 'large' | Number | String
  color?: string;
  variant?: string; // 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  background?: string;
  tooltip?: string;
  outlined?: boolean;
  blank?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  href?: string;
  startIcon?: any;
  endIcon?: any;
  icon?: any;
  loading?: boolean;
  align?: 'start' | 'end';
  children?: any;
  onClick?: () => void;
  unHover?: boolean;
  isActive?: boolean;
  className?: string;
  style?: any;
  target?: string;
  startAdornment?: any;
  endAdornment?: any;
};

export type ImageViewerProps = {
  id?: any;
  src: any;
  useRatio?: any;
  fallbackSrc?: any;
  theme?: any;
  className?: any;
  style?: any; // boolean | object,
  size?: any;
  width?: any;
  height?: any;
  children?: any;
  clickable?: boolean;
  isObectFit?: boolean;
  draggable?: boolean;
  disable?: boolean;
  isLazyLoad?: boolean;
  softDisabled?: boolean;
  circle?: boolean;
  lazyload?: boolean;
  bgImg?: boolean;
  minimum?: boolean;
  selectable?: boolean; // not disbale userSelect css;
  svg?: any; // boolean | object, // https://github.com/tanem/react-svg/tree/master/examples/external-stylesheet
  attributes?: any;
  crossOrigin?: any;
  color?: any;
  isSvg?: boolean;
  customKey?: string;
  selector?: string;
  alt?: string;
  resizeMode?: string;
  rotate?: number;
  isCircle?: boolean;
  overflow?: boolean;
  defaultSrc?: boolean;
  onMouseOver?: Function;
  onMouseDown?: Function;
  onRef?: Function;
  onClick?: Function;
  onError?: Function;
  onMouseLeave?: Function;
};
