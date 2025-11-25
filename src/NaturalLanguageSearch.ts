import type { Config, Domains, Message } from './types';
import getSystemPrompt from './utils/getSystemPrompt';
import addCurrentTimestamp from './utils/addCurrentTimestamp';
import parseDomainResponse from './utils/parseDomainResponse';

class NaturalLanguageSearch {
  model: string;
  apiKey: string;
  domains: Domains;
  systemPrompt: string;

  constructor({ apiKey, model, domains }: Config) {
    this.model = model;
    this.apiKey = apiKey;
    this.domains = domains;
    this.systemPrompt = getSystemPrompt(domains);
  }

  async search(prompt: string) {
    const systemPromptWithTimestamp = addCurrentTimestamp(this.systemPrompt);
    const messages: Message[] = [
      {
        role: 'system',
        content: systemPromptWithTimestamp,
      },
      {
        role: 'user',
        content: `Input:\n${prompt}`,
      },
    ];

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: this.model, messages }),
      },
    );
    const data = await response.json();

    return parseDomainResponse(data);
  }
}

export default NaturalLanguageSearch;
