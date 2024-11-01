import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

import svelte from '@astrojs/svelte';

import tailwind from '@astrojs/tailwind';

import sectionize from '@hbsnow/rehype-sectionize';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react(), svelte(), tailwind()],
  markdown: {
    rehypePlugins: [
      rehypeAccessibleEmojis,
      sectionize,
    ],
  }
});