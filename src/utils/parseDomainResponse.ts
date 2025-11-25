import { DEFAULT_RESPONSE } from '../constants';

function parseDomainResponse(data: unknown) {
  if (
    !data ||
    typeof data !== 'object' ||
    !('choices' in data) ||
    !Array.isArray(data.choices) ||
    data.choices.length === 0 ||
    !('message' in data.choices[0]) ||
    !('content' in data.choices[0].message)
  ) {
    return DEFAULT_RESPONSE;
  }

  const message: string | undefined = data.choices[0].message.content;

  try {
    const json = message ? JSON.parse(message) : DEFAULT_RESPONSE;
    return json;
  } catch {
    return DEFAULT_RESPONSE;
  }
}

export default parseDomainResponse;
