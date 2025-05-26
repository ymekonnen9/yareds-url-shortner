document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('urlForm');
    const longUrlInput = document.getElementById('longUrl');
    const resultDiv = document.getElementById('result');

    const API_BASE_URL = 'https://5ck84mr1ai.execute-api.us-east-1.amazonaws.com/dev';

    urlForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const longUrl = longUrlInput.value.trim();
        resultDiv.textContent = 'Processing...';
        resultDiv.style.color = '#333'; // Reset color

        if (!longUrl) {
            resultDiv.textContent = 'Please enter a URL.';
            resultDiv.style.color = 'red';
            return;
        }

        try {
            // Basic URL validation (browser often does this with type="url", but good to have)
            new URL(longUrl);
        } catch (_) {
            resultDiv.textContent = 'Invalid URL format. Please include http:// or https://';
            resultDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ longUrl: longUrl }),
            });

            const data = await response.json();

            if (response.ok) { // Typically 200-299 status codes
                const shortLink = `${API_BASE_URL}/${data.shortId}`; // Construct the full short link
                resultDiv.innerHTML = `
                    Shortened! <br>
                    Original: ${data.longUrl} <br>
                    Short Link: <a href="${shortLink}" target="_blank">${shortLink}</a>
                `;
            } else {
                resultDiv.textContent = `Error: ${data.message || 'Could not shorten URL.'}`;
                resultDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error submitting URL:', error);
            resultDiv.textContent = 'An error occurred. Please try again.';
            resultDiv.style.color = 'red';
        }
    });
});