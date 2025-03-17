import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const projects = await getCollection('projects');
  return rss({
    // `<title>` field in output xml
    title: 'Alex Gulko’s Blog',
    // `<description>` field in output xml
    description: 'Thoughts on software development, design, and other things.',
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: projects.sort(post => new Date(post.data.created).getTime()).map((post: any) => ({
      title: post.data.title,
      pubDate: post.data.created,
      description: post.data.description,
      categories: post.data.tags,
      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/projects/${post.slug}/`,
    })),

    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}