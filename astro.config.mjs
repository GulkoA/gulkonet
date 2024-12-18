import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import pagefind from 'astro-pagefind';

import svelte from '@astrojs/svelte';

import sectionize from '@hbsnow/rehype-sectionize';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'

import sitemap from '@astrojs/sitemap';

import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: "https://gulko.net",
  integrations: [mdx(), svelte(), pagefind(), sitemap(), compress()],
  markdown: {
    rehypePlugins: [
      rehypeAccessibleEmojis,
      sectionize,
    ],
  }
});