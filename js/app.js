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

document.addEventListener('DOMContentLoaded', function() {
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavLinks = document.getElementById('links');
  const footerText = document.querySelector('.footer');
  const currentYear = new Date().getFullYear();

  if (mobileNavToggle && mobileNavLinks && mobileNavToggle.dataset.initialized !== 'true') {
    mobileNavToggle.dataset.initialized = 'true';

    const setMobileNavState = (isOpen) => {
      mobileNavLinks.style.display = isOpen ? 'block' : 'none';
      mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    };

    setMobileNavState(false);

    mobileNavToggle.addEventListener('click', function(event) {
      event.stopPropagation();
      const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      setMobileNavState(!isOpen);
    });

    document.addEventListener('click', function() {
      setMobileNavState(false);
    });

    mobileNavToggle.parentElement.addEventListener('click', function(event) {
      event.stopPropagation();
    });

    mobileNavLinks.addEventListener('click', function(event) {
      if (event.target.closest('a')) {
        setMobileNavState(false);
      }
    });
  }

  if (footerText) {
    footerText.textContent = `copyright CC BY-SA 4.0 adamngshrine ~ 2023 - ${currentYear}`;
  }
});

