export type ButtonProps = {
  text?: string;
  width?: number;
  height?: number;
  size?: number | string; // 'small' | 'medium' | 'large' | Number | String
  color?: string;
  variant?: string; // 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  tooltip?: string;
  outlined?: boolean;
  blank?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  href?: string;
  startIcon?: ImageViewerProps;
  endIcon?: ImageViewerProps;
  icon?: ImageViewerProps;
  loading?: boolean;
  align?: 'start' | 'end';
  children?: any;
  onClick?: () => void;
  hover?: boolean;
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

export type InputProps = {
  isCurrency?: boolean;
  inputType?: string;
  value?: string;
  placeholder?: string;
  plh?: string;
  typeTypePlh?: string;
  pattern?: string;
  multiline?: boolean;
  label?: string;
  required?: boolean;
  noMaxLength?: boolean;
  autoFocus?: boolean;
  isError?: boolean;
  helperText?: string;
  isSearch?: boolean;
  isNumber?: boolean;
  isDisabled?: boolean;
  softDisabled?: boolean;
  removeable?: boolean;
  isOutLine?: boolean;
  inputRef?: any;
  styles?: any;
  className?: any;
  startIcon?: ImageViewerProps;
  endIcon?: ImageViewerProps;
  endComp?: any;
  heightArea?: number;
  maxLength?: number;
  isToolText?: boolean;
  isAutoHeight?: boolean;
  subTitle?: React.ReactElement;
  onChange?: Function;
  onFocus?: Function;
  onChangeText?: Function;
  onRemove?: Function;
  onBlur?: Function;
  onKeyDown?: Function;
  onEnter?: Function;
  isMoney?: boolean;
  isNoSpace?: boolean;
  isUppercase?: boolean;
};

export type LineProps = {
  width?: number | string;
  height?: number | string;
  vertical?: boolean;
  className?: any;
  style?: any;
  noMargin?: boolean;
};

export type AvatarProps = {
  className?: string;
  src?: string | ArrayBuffer;
  name?: string;
  style?: any;
  size?: number;
  txtSize?: number;
  border?: string;
  borderSize?: number;
  borderColor?: string;
  borderRadius?: number;
  isCustomed?: boolean;
  isDueTime?: boolean;
  isPreview?: boolean;
  isSvg?: boolean;
  clickable?: boolean;
  whiteBg?: boolean;
  onClick?: Function;
  imageProps?: any;
};

type TooltipPlacement =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top';


export type TooltipProps = {
  title?: string | boolean;
  placement?: TooltipPlacement;
  noneWrap?: boolean;
  center?: boolean;
  hidden?: boolean;
  className?: string;
  delayAfterChange?: number;
  disableInteractive?: boolean;
  children: React.ReactNode;
};

type TextType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
type TextSize = 'text' | 'small' | 'smallBold' | 'medium' | 'mediumBold' | 'large' | 'largeBold' | 'extra' | 'bigextra' | 'header';
type TextColor = 'primary' | 'success' | 'error' | 'info' | 'warning';

export type TextProps = {
  text: React.ReactNode;
  color?: TextColor;
  size?: TextSize;
  type?: TextType;
  className?: string;
  style?: React.CSSProperties;
};

export type TextButtonProps = {
  text: string;
  color?: string;
  tooltip?: any;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: "new" | "replace" | "push";
  onClick?: (event: React.MouseEvent) => void;
  noUnderline?: boolean;
};