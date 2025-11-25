import type { VercelRequest, VercelResponse } from '@vercel/node';
import NaturalLanguageSearch, {
  ISO_TIMESTAMP,
  type Domain,
} from 'natural-language-search';

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

const nls = new NaturalLanguageSearch({
  apiKey: process.env.NATURAL_LANGUAGE_SEARCH_API_KEY!,
  model: process.env.NATURAL_LANGUAGE_SEARCH_MODEL!,
  domains: [ordersDomain, disputesDomain, settlementsDomain],
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const result = await nls.search(prompt);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
