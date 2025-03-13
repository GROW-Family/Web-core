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
