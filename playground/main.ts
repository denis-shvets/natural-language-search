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

if (
  form &&
  input instanceof HTMLInputElement &&
  output &&
  submitButton instanceof HTMLButtonElement
) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = input.value;

    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Searching...';
    output.innerHTML = '';

    try {
      const result = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await result.json();
      output.innerHTML = JSON.stringify(data, null, 2);
    } catch {
      output.innerHTML = 'Something went wrong';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}
