import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import pagefind from 'astro-pagefind';

import svelte from '@astrojs/svelte';

import sectionize from '@hbsnow/rehype-sectionize';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), svelte(), pagefind()],
  markdown: {
    rehypePlugins: [
      rehypeAccessibleEmojis,
      sectionize,
    ],
  }
});