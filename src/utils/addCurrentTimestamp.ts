function addCurrentTimestamp(prompt: string) {
  const timestamp = new Date().toISOString();
  return `${prompt}\n\nNow: ${timestamp}`;
}

export default addCurrentTimestamp;
