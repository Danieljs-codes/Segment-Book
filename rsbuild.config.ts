import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

export default defineConfig({
  plugins: [pluginReact(), pluginSvgr()],
  html: {
    template: './index.html',
  },
  source: {
    entry: { index: './src/main.tsx' },
  },
  tools: {
    rspack: {
      plugins: [TanStackRouterRspack()],
    },
  },
});
