function toggleMenuVisibility(menuId, toggleButtonId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  const isOpen = menu.style.display === 'block';
  menu.style.display = isOpen ? 'none' : 'block';

  const toggleButton = document.getElementById(toggleButtonId);
  if (toggleButton) {
    toggleButton.setAttribute('aria-expanded', String(!isOpen));
  }
}

function playAudio(audioId) {
  const audio = document.getElementById(audioId);
  if (audio) audio.play();
}

function attachActionEvents(elementId, action) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.addEventListener('click', action);
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  });
}

function handleNav(event) {
  if (event) event.preventDefault();

  const targetSection = document.getElementById(this.dataset.section);
  if (!targetSection) return;

  document.querySelectorAll('.content').forEach((section) => section.classList.remove('active'));
  document.querySelectorAll('.button').forEach((button) => {
    button.classList.remove('active');
    button.removeAttribute('aria-current');
  });

  targetSection.classList.add('active');
  this.classList.add('active');
  this.setAttribute('aria-current', 'page');
}

function setContainerMessage(container, className, text) {
  const message = document.createElement('div');
  message.className = className;
  message.textContent = text;
  container.replaceChildren(message);
}

async function loadArticles(endpoint = '/json/update.json') {
  const container = document.getElementById('articles-container');
  
  try {
    const posts = await fetch(endpoint).then(r => r.ok ? r.json() : Promise.reject(r));
    
    if (!Array.isArray(posts) || !posts.length) {
      setContainerMessage(container, 'empty', 'No articles available');
      return;
    }
    
    container.replaceChildren();
    const fragment = document.createDocumentFragment();
    
    posts.forEach(p => {
      if (!p) return;
      
      const article = document.createElement('article');
      article.setAttribute('data-time', p.timestamp || '');
      
      const userDiv = document.createElement('div');
      userDiv.className = 'status_username';
      const username = document.createElement('h3');
      username.textContent = p.username || 'Anonymous'; // Safe - uses textContent
      userDiv.appendChild(username);
      
      const content = document.createElement('p');
      content.className = 'status_content';
      content.textContent = p.content || ''; // Safe - uses textContent
      
      article.append(userDiv, content);
      fragment.appendChild(article);
    });
    
    container.appendChild(fragment);
    
  } catch (error) {
    console.error('Failed to load:', error);
    setContainerMessage(container, 'error', 'Failed to load articles');
  }
}

document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.button[data-section]');
    navButtons.forEach((btn) => {
      btn.addEventListener('click', handleNav);
      btn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleNav.call(btn, event);
        }
      });
    });

    attachActionEvents('mobile-nav-toggle', () => toggleMenuVisibility('links', 'mobile-nav-toggle'));
    attachActionEvents('reisen-trigger', () => playAudio('reisen'));
    attachActionEvents('lain-trigger', () => playAudio('audio'));

    if (document.getElementById('articles-container')) {
      loadArticles();
    }

    const footerText = document.querySelector('.footer');
    if (footerText) {
      const currentYear = new Date().getFullYear();
      footerText.textContent = `copyright CC BY-SA 4.0 adamngshrine ~ 2023 - ${currentYear}`;
    }
});