import 'dotenv/config';
import { resolve } from 'path';

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default () => {
    return defineConfig({
        root: './src',
        base: '',
        build: {
            chunkSizeWarningLimit: 100,
            rollupOptions: {
                onwarn(warning, warn) {
                    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                        return;
                    }
                    warn(warning);
                },
            },
        },
        plugins: [
            {
                name: 'override-config',
                config: () => ({
                    build: {
                        target: 'esnext',
                    },
                }),
            },
        ],
        resolve: {
            alias: {
                '@components': resolve(__dirname, './src/components'),
                '@constants': resolve(__dirname, './src/constants'),
                '@cores': resolve(__dirname, './src/cores'),
                '@styles': resolve(__dirname, './src/styles'),
                '@hocs': resolve(__dirname, './src/hocs'),
                '@hooks': resolve(__dirname, './src/hooks'),
                '@libs': resolve(__dirname, './src/libs'),
                '@models': resolve(__dirname, './src/models'),
                '@app': resolve(__dirname, './src/app'),
                '@static': resolve(__dirname, './src/static'),
                '@utils': resolve(__dirname, './src/utils'),
                '@services': resolve(__dirname, './src/services'),
                '@enums': resolve(__dirname, './src/enums'),
            },
        },
    });
};
