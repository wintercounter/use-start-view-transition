import { defineConfig } from 'tsdown'

const sharedConfig = {
    entry: ['src/index.ts'],
    outDir: 'dist',
    deps: {
        neverBundle: ['react']
    }
}

export default defineConfig([
    {
        ...sharedConfig,
        format: ['esm'],
        outExtensions: () => ({
            js: '.js'
        }),
        dts: true,
        clean: true
    },
    {
        ...sharedConfig,
        format: ['cjs'],
        outExtensions: () => ({
            js: '.cjs'
        }),
        dts: false,
        clean: false
    }
])
