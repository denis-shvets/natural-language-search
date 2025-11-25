import type { Plugin } from 'vite';
import NaturalLanguageSearch, {
  ISO_TIMESTAMP,
  type Domain,
} from '../../../src';

const ordersDomain: Domain = {
  name: 'orders',
  parameters: {
    status: [
      'Authorized',
      'Captured',
      'Partially captured',
      'Expired',
      'Canceled',
    ],
    createdFrom: ISO_TIMESTAMP,
    createdTo: ISO_TIMESTAMP,
  },
};

const disputesDomain: Domain = {
  name: 'disputes',
  parameters: {
    reason: [
      'Return',
      'Unauthorized purchase',
      'Incorrect invoice',
      'High risk order',
      'Goods not received',
      'Faulty goods',
    ],
    status: ['Lost', 'Response required', 'Under review', 'Won'],
    deadline: ISO_TIMESTAMP,
  },
};

const settlementsDomain: Domain = {
  name: 'settlements',
  parameters: {
    currency: ['USD', 'EUR', 'GBP', 'SEK', 'PLN'],
    startDate: ISO_TIMESTAMP,
    endDate: ISO_TIMESTAMP,
  },
};

export default function demo(env: Record<string, string>): Plugin {
  const nls = new NaturalLanguageSearch({
    apiKey: env.NATURAL_LANGUAGE_SEARCH_API_KEY!,
    model: env.NATURAL_LANGUAGE_SEARCH_MODEL!,
    domains: [ordersDomain, disputesDomain, settlementsDomain],
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
