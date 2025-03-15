export const colors: any = {
    transparent: 'transparent',

    bgColor: '#f5f6fa',
    bgDefault: 'rgba(73, 73, 73, 0.08)',
    button: 'rgba(73, 73, 73, 0.1)',

    white: '#ffffff',
    black: '#000000',

    base: '#7d7d7d',

    primary: '#042442',

    gray: '#cccccc',
    grayLight: '#eaeaea',

    blue: '#183bd0',
    blueLight: '#57bfdb',
    blueDim: '#616E82',

    green: '#24BE89',

    red: '#cc2b31',

    orange: '#fe9d06',
};

export const colorBases = [
    ['primary', '#042442'],
    ['error', '#cc2b31'],
    ['warning', '#fe9d06', '#feb729'],
    ['success', '#24BE89'],
    ['info', '#183bd0'],
    ['white', '#ffffff'],
    ['black', '#000000'],
    ['menu', '#24326d'],
    ['purple', '#a540b8'],
    ['purpleBlue', '#7140DE'],
    ['violet', '#6c63ff'],
    ['pink', '#e82a8f'],
    ['lightPink', '#E02876'],
    ['darkBlue', '#0966ff'],
    ['turquoise', '#57bfdb'],
    ['lightGreen', '#2bb3ec'],
    ['raspberryPink', '#f0557f'],
    ['grey', '#3b5998'],
    ['skyBlue', '#0868fe'],
    ['lightBlue', '#229fda'],
    ['darkGreen', '#10a37f'],
    ['greyish', '#212121'],
    ['second', '#f5f6fa'],
    ['slateGray', '#828387'],
];
const colorModes = [
    ['black', '#042442'],
    ['white', '#ffffff'],
];

const generateStyle = (prefix: 'text' | 'bg') =>
    Object.fromEntries(
        Object.entries(colors).map(([key, value]) => [
            key,
            value === 'transparent' ? `${prefix}-transparent` : `${prefix}-[${value}]`,
        ]),
    ) as Record<keyof typeof colors, string>;

export const colorStyle = generateStyle('text');

// export const colorStyle: Record<keyof typeof colors, string> = Object.keys(colors).reduce(
//     (acc, key) => {
//         const colorValue = colors[key as keyof typeof colors];

//         acc[key as keyof typeof colors] = colorValue === 'transparent' ? 'text-transparent' : `text-[${colorValue}]`;

//         return acc;
//     },
//     {} as Record<keyof typeof colors, string>,
// );

// export const colorStyle = {
//     base: "text-[#7d7d7d]",
//     bgColor: "text-[#f5f6fa]",
//     bgDefault: "text-[rgba(73, 73, 73, 0.08)]",
//     black: "text-[#000000]",
//     blue: "text-[#183bd0]",
//     blueDim: "text-[#616E82]",
//     blueLight: "text-[#57bfdb]",
//     button: "text-[rgba(73, 73, 73, 0.1)]",
//     gray: "text-[#cccccc]",
//     grayLight: "text-[#eaeaea]",
//     green: "text-[#24BE89]",
//     orange: "text-[#fe9d06]",
//     primary: "text-[#042442]",
//     red: "text-[#cc2b31]",
//     transparent: "text-transparent",
//     white: "text-[#ffffff]",
// }

export const bgStyle = generateStyle('bg');

export const variants: any = {
    primary: 'bg-[#042442]',
    secondary: 'bg-[#183bd0]',
    success: 'bg-[#24BE89]',
    warning: 'bg-[#fe9d06]',
    error: 'bg-[#cc2b31]',
    info: 'bg-[#57bfdb]',
    white: 'bg-[#ffffff]',
    black: 'bg-[#000000]',
};

export const cStyles = {
    textEllipsis: 'truncate',

    disabled: 'opacity-50 cursor-not-allowed',

    flexCenter: 'flex items-center justify-center',

    flexColCenter: 'flex flex-col items-center justify-center',

    flexSpaceBetween: 'flex items-center justify-between',

    noneUserSelect: 'select-none',

    flexColumn: 'flex flex-col',

    flexRowCenter: 'flex items-center',

    noClickOutlineHighlight: 'outline-none touch-manipulation',

    overlayAbsolute: 'absolute inset-0',

    overlayAbsoluteCenter: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',

    rotate: 'animate-spin',
};

export const genTheme = (mode: 'light' | 'dark') => {
    const isDark = mode === 'dark';

    return {
        mode,
        isDark,
        palette: {
            background: {
                card: isDark ? 'bg-white/20' : 'bg-gray-100',
                main: isDark ? 'bg-black' : 'bg-white',
                default: 'bg-[#fbfbfc]',
                primary: 'bg-[#f5f6fa]',
                warning: colors.yellow ?? '#FFCC00', 
                error: colors.red ?? '#FF0000', 
                success: colors.green ?? '#00CC66', 
                info: colors.blue ?? '#0099FF',
            },
            text: isDark ? 'text-white' : 'text-gray-800',
            purple: { main: colors.purple ?? '#800080' },
            boxIcon: isDark ? 'text-white' : 'text-blue-500',
            iconColor: {
                info: isDark ? 'text-white' : 'text-blue-500',
            },
        },
        fontSize: {
            semiSmall: 'text-[8px]',
            small: 'text-sm',
            normal: 'text-base',
            large: 'text-lg',
            semiLarge: 'text-xl',
            extraLarge: 'text-2xl',
        },
        fontWeight: {
            normal: 'font-normal',
            bold: 'font-bold',
            black: 'font-black',
        },
        borderRadius: {
            supperSmall: 'rounded-[6px]',
            semiSmall: 'rounded-[8px]',
            small: 'rounded-md',
            medium: 'rounded-lg',
            large: 'rounded-xl',
        },
    };
};

// Default theme (light mode)
export const theme: any = genTheme('light');

export const avatarColors = {
    A: theme.palette.background.warning,
    B: theme.palette.purple.main,
    C: theme.palette.background.error,
    D: theme.palette.background.warning,
    E: theme.palette.background.success,
    F: theme.palette.background.info,
    G: theme.palette.background.warning,
    H: theme.palette.purple.main,
    I: theme.palette.background.error,
    J: theme.palette.background.warning,
    K: theme.palette.background.success,
    L: theme.palette.background.info,
    M: theme.palette.purple.main,
    N: theme.palette.purple.main,
    O: theme.palette.background.warning,
    P: theme.palette.background.success,
    Q: theme.palette.background.error,
    R: theme.palette.background.info,
    S: theme.palette.background.info,
    T: theme.palette.background.warning,
    U: theme.palette.background.error,
    V: theme.palette.background.success,
    W: theme.palette.background.info,
    X: theme.palette.background.warning,
    Y: theme.palette.background.error,
    Z: theme.palette.background.success,
    '1': theme.palette.background.warning,
    '2': theme.palette.purple.main,
    '3': theme.palette.background.error,
    '4': theme.palette.background.warning,
    '5': theme.palette.background.success,
    '6': theme.palette.background.info,
    '7': theme.palette.background.warning,
    '8': theme.palette.purple.main,
    '9': theme.palette.background.error,
    '+': 'rgb(189,189,189)',
};

export const textSizes = {
    text: [18, 400, [['400', [15, 400]]]],
    textBold: [18, 500, [['400', [15, 500]]]],
    small: [18, 900, [['600', [15, 900]]]],
    smallBold: [18, 500, [['600', [15, 500]]]],
    small600: [18, 600],
    smallRegular: [18, 400, [['600', [15, 400]]]],
    medium: [20, 900, [['600', [18, 900]]]],
    mediumRegular: [20, 400, [['600', [15, 400]]]],
    medium600: [20, 600],
    mediumBold: [20, 500],
    large: [
        32,
        900,
        [
            ['600', [24, 900]],
            ['400', [20, 900]],
        ],
    ],
    largeBold: [
        32,
        500,
        [
            ['600', [24, 500]],
            ['400', [20, 500]],
        ],
    ],
    extra: [
        38,
        900,
        [
            ['500', [36, 900]],
            ['400', [32, 900]],
        ],
    ],
    bigextra: [
        44,
        900,
        [
            ['1024', [42, 900]],
            ['600', [38, 900]],
            ['400', [32, 900]],
        ],
    ],
    header: [
        68,
        900,
        [
            ['1024', [54, 900]],
            ['600', [54, 900]],
            ['450', [32, 900]],
            // ['1024', [54, 900]],
            // ['600', [54, 900]],
            // ['400', [48, 900]],
        ],
    ],
};
