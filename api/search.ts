import type { VercelRequest, VercelResponse } from '@vercel/node';
import NaturalLanguageSearch, {
  ISO_TIMESTAMP,
  type Domains,
} from 'natural-language-search';

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

const nls = new NaturalLanguageSearch({
  apiKey: process.env.NATURAL_LANGUAGE_SEARCH_API_KEY!,
  model: process.env.NATURAL_LANGUAGE_SEARCH_MODEL!,
  domains,
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
