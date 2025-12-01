import type { Plugin } from 'vite';
import NaturalLanguageSearch, {
  ISO_TIMESTAMP,
  type Domains,
} from '../../../src';

const domains: Domains = [
  {
    name: 'playlist',
    parameters: {
      region: ['US', 'SE', 'DE', 'BR', 'IN'],
      mood: ['Chill', 'Focus', 'Hype', 'Melancholic'],
      device: ['Mobile', 'Desktop', 'TV'],
      from: ISO_TIMESTAMP,
      to: ISO_TIMESTAMP,
    },
  },
  {
    name: 'listening-session',
    parameters: {
      subscription: ['Free', 'Premium', 'Family'],
      skipRate: ['High', 'Medium', 'Low'],
      from: ISO_TIMESTAMP,
      to: ISO_TIMESTAMP,
    },
  },
];

export default function demo(env: Record<string, string>): Plugin {
  const nls = new NaturalLanguageSearch({
    apiKey: env.NATURAL_LANGUAGE_SEARCH_API_KEY!,
    model: env.NATURAL_LANGUAGE_SEARCH_MODEL!,
    domains,
  });

  return {
    name: 'demo',
    configureServer(server) {
      server.middlewares.use('/api/search', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const body = Buffer.concat(chunks).toString('utf-8');
        const { prompt } = body ? JSON.parse(body) : {};

        if (!prompt) {
          res.statusCode = 400;
          res.end('Missing prompt');
          return;
        }

        try {
          const result = await nls.search(prompt);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (error) {
          console.error('Search error:', error);
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      });
    },
  };
}
