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

loadArticles();