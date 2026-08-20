function playAudio(audioId) {
  const audio = document.getElementById(audioId);
  if (audio) audio.play();
}

document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('mobile-nav-toggle');
  const links = document.getElementById('links');
  const footerText = document.querySelector('.footer');

  if (toggle && links) {
    const setOpen = (isOpen) => {
      links.style.display = isOpen ? 'block' : 'none';
      toggle.setAttribute('aria-expanded', String(isOpen));
    };

    setOpen(false);

    toggle.addEventListener('click', function(event) {
      event.stopPropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('click', function(event) {
      if (!links.contains(event.target)) setOpen(false);
    });

    links.addEventListener('click', function(event) {
      if (event.target.closest('a')) setOpen(false);
    });
  }

  if (footerText) {
    footerText.textContent = `copyright CC BY-SA 4.0 adamngshrine ~ 2023 - ${new Date().getFullYear()}`;
  }
});

