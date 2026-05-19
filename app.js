function playAudio(audioId) {
  const audio = document.getElementById(audioId);
  if (audio) audio.play();
}

function setContainerMessage(container, className, text) {
  const message = document.createElement('div');
  message.className = className;
  message.textContent = text;
  container.replaceChildren(message);
}

document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('.footer');
  if (footer) footer.textContent = `© ${new Date().getFullYear()}`;
  (async () => {
    try {
      const res = await fetch('/json/update.json');
      if (!res || !res.ok) return;
      await res.json();
    } catch (err) {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        try {
          window.dispatchEvent(new ErrorEvent('error', { error: err, message: String(err) }));
        } catch (dispatchErr) {
          // last-resort no-op: avoid throwing from the error handler
        }
      }
    }
  })();
});