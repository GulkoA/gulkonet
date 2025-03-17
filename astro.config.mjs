import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import pagefind from 'astro-pagefind';

import svelte from '@astrojs/svelte';

// import sectionize from '@hbsnow/rehype-sectionize';
import sectionize from 'remark-sectionize';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeKatex from 'rehype-katex';

import remarkMermaid from 'remark-mermaidjs';
import remarkMath from 'remark-math';

import sitemap from '@astrojs/sitemap';

import compress from 'astro-compress';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: "https://gulko.net",
  integrations: [svelte({ extensions: ['.svelte'] }), expressiveCode(), mdx(), pagefind(), sitemap(), compress() ],
  markdown: {
    rehypePlugins: [
      rehypeAccessibleEmojis,
      rehypeKatex
    ],
    remarkPlugins: [
      [remarkMermaid, {}],
      sectionize,
      [remarkMath, {inlineMathDoubleDollar: true}],
    ],

  }
});