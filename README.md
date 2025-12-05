# Natural Language Search

A lightweight library for natural language search functionality.

Demo recording: https://www.youtube.com/watch?v=ucxk594awBU

## Installation

```bash
npm install natural-language-search
# or
pnpm add natural-language-search
# or
yarn add natural-language-search
```

## Usage

### Basic Usage

The library is designed to be used in a server‑side environment to keep your API keys secure.

```typescript
import { ISO_TIMESTAMP, NaturalLanguageSearch, type Domains } from 'natural-language-search';

// 1. Define your domains and their queryable parameters
const domains: Domains = [
  {
    name: 'orders',
    parameters: {
      status: ['Authorized', 'Captured', 'Partially captured', 'Expired', 'Canceled'],
      createdFrom: ISO_TIMESTAMP,
      createdTo: ISO_TIMESTAMP,
    },
  },
  // ... add more domains
];

// 2. Initialize the search client
const search = new NaturalLanguageSearch({
  apiKey: '<OPENROUTER_API_KEY>', // https://openrouter.ai/settings/keys
  model: '<OPENROUTER_MODEL>', // https://openrouter.ai/models
  domains: domains,
});

// 3. Perform a search
async function handleSearch(userQuery: string) {
  const result = await search.search(userQuery);
  console.log(result);
}
```

### Server‑Side Integration (Recommended)

It is highly recommended to use this library on your backend (e.g., Express, Fastify, Next.js API routes) to avoid exposing your API keys to the client.

#### API Route (Server‑Side)

The `api/search.ts` file provides a ready‑made Express handler that forwards requests to the OpenRouter API using the library.

```typescript
import express from 'express';
import { NaturalLanguageSearch, type Domains } from 'natural-language-search';

const app = express();
app.use(express.json());

const domains: Domains = [
  // ... your domain definitions
];

const searchClient = new NaturalLanguageSearch({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'openai/gpt-4o-mini',
  domains,
});

app.post('/api/search', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    const result = await searchClient.search(prompt);
    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Client‑Side Usage

From your frontend, simply POST the user's natural‑language query to the `/api/search` endpoint.

```typescript
const prompt = 'Show me all pending orders from last week';

const response = await fetch('/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt }),
});

const data = await response.json();
// Use `data` to filter your data or display results
```

## Playground UI

A full-featured playground lives in the `playground` directory. It demonstrates the library in action with a live UI built with Vite. The development server for the playground is configured via `configs/vite/plugins/demo.ts`. Running `pnpm dev` starts both the library dev server and the playground UI.

The playground is compiled to `dist/playground` when you run the `build:playground` script.

## Live demos

- Library playground (music/search example): https://natural-language-search-playground.vercel.app/
- E-commerce demo: https://natural-language-search-public.vercel.app/

## Future vision

- Pluggable providers: keep the same API while swapping in OpenRouter, OpenAI SDK, Azure OpenAI, Anthropic, Groq, or Together - configure base URL/headers once and go.
- Multi-select enums: allow parameters to accept one or many whitelisted values (e.g., `region: ['US', 'SE']`), not just a single choice.
- Production hardening: richer error handling, timeouts/retries, rate-limit awareness, and clearer fallbacks for malformed model responses.

Contributions are welcome - feel free to open issues or PRs for providers, multi-select support, or production-hardening improvements.

## API Reference

### `NaturalLanguageSearch`

The main class for performing searches.

#### Constructor

```typescript
new NaturalLanguageSearch(config)
```

**Config Options:**

| Option    | Type      | Description                                                    |
| --------- | --------- | -------------------------------------------------------------- |
| `apiKey`  | `string`  | Your OpenRouter API key (https://openrouter.ai/settings/keys). |
| `model`   | `string`  | The LLM model to use (https://openrouter.ai/models).           |
| `domains` | `Domains` | An array of domain definitions.                                |

#### Methods

- `search(prompt: string): Promise<any>` – Processes the natural language prompt and returns structured search parameters based on your defined domains.

### Types

#### `Domain`

Defines a search domain and its available parameters.

```typescript
type Domain = {
  name: string; // e.g., 'orders', 'products'
  parameters: Record<string, string[] | 'ISO-8601 UTC timestamp'>;
};
```

- `parameters`: A key‑value map where keys are parameter names. Values can be:
  - An array of strings for enum‑like values (e.g., `['pending', 'shipped']`).
  - The string `'ISO-8601 UTC timestamp'` for date/time fields.

## Development

### Setup

```bash
pnpm install
```

### Dev Server

```bash
pnpm dev
```

The dev command starts Vite for Library development: `vite.config.ts`.

### Build

```bash
pnpm build            # Builds the library to ./dist
pnpm build:playground # Builds the playground UI to ./dist/playground
```

### Linting & Formatting

```bash
pnpm lint
pnpm format
```

## Scripts Overview

- `dev` – Starts Vite dev server for both library and playground.
- `build` – Compiles TypeScript and bundles the library.
- `build:playground` – Bundles the playground UI.
- `preview` – Runs Vite preview.
- `release` – Builds and publishes the package.
- `lint` – Runs ESLint.
- `format` – Runs Prettier.
