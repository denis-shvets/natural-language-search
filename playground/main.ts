import NaturalLanguageSearch, { ISO_TIMESTAMP, type Domains } from '../src';

const infoToggle = document.querySelector('#info-toggle');
const infoDetails = document.querySelector('#info-details');
const toggleIcon = document.querySelector('#toggle-icon');

if (infoToggle && infoDetails && toggleIcon) {
  infoToggle.addEventListener('click', () => {
    infoDetails.classList.toggle('collapsed');
    toggleIcon.textContent = infoDetails.classList.contains('collapsed')
      ? '▶'
      : '▼';
  });
}

const form = document.querySelector('.search-form');
const input = document.querySelector('#prompt');
const output = document.querySelector('#output');
const submitButton = document.querySelector('.search-button');

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

if (
  form &&
  input instanceof HTMLInputElement &&
  output &&
  submitButton instanceof HTMLButtonElement
) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const API_KEY = document.querySelector<HTMLInputElement>('#api-key')?.value;
    const MODEL = document.querySelector<HTMLInputElement>('#model')?.value;
    const nls =
      API_KEY && MODEL
        ? new NaturalLanguageSearch({
            apiKey: API_KEY,
            model: MODEL,
            domains,
          })
        : null;

    const prompt = input.value;

    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Searching...';
    output.innerHTML = '';

    try {
      if (!nls) {
        throw new Error(
          'NaturalLanguageSearch instance is not initialized. Please fill API key and Model',
        );
      }

      const result = await nls.search(prompt);
      output.innerHTML = JSON.stringify(result, null, 2);
    } catch (error) {
      output.innerHTML =
        error instanceof Error ? error.message : 'Something went wrong';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}
