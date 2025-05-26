document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('urlForm');
    const longUrlInput = document.getElementById('longUrl');
    const resultDiv = document.getElementById('result');

    urlForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const longUrl = longUrlInput.value;
        resultDiv.textContent = 'Processing...';


        setTimeout(() => {
            if (longUrl) {
                resultDiv.innerHTML = `Long URL: ${longUrl}<br>Short URL will appear here once backend is ready!`;
            } else {
                resultDiv.textContent = 'Please enter a URL.';
            }
        }, 1000);
    });
});