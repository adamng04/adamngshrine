function play(){
    let audio = document.getElementById("audio");
    audio.play();
}

function button(){
    let reisen = document.getElementById("reisen");
    reisen.play();
}

function myFunction() {
    var x = document.getElementById("links");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

document.querySelectorAll('.button[data-section]').forEach(btn => {
    btn.addEventListener('click', handleNav);
    btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') handleNav.call(btn, e);
    });
});

function handleNav() {
    document.querySelectorAll('.content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.button').forEach(b => {
        b.classList.remove('active');
        b.removeAttribute('aria-current');
    });

    document.getElementById(this.dataset.section).classList.add('active');
    this.classList.add('active');
    this.setAttribute('aria-current', 'page');
}

async function loadArticles(endpoint = '/json/update.json') {
  const container = document.getElementById('articles-container');
  
  try {
    const posts = await fetch(endpoint).then(r => r.ok ? r.json() : Promise.reject(r));
    
    if (!Array.isArray(posts) || !posts.length) {
      container.innerHTML = '<div class="empty">No articles available</div>';
      return;
    }
    
    container.innerHTML = '';
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
    container.innerHTML = '<div class="error">Failed to load articles</div>';
  }
}

loadArticles();

document.addEventListener('DOMContentLoaded', function() {
    const footerText = document.querySelector('.footer');
    const currentYear = new Date().getFullYear();
    footerText.textContent = `copyright CC BY-SA 4.0 adamngshrine ~ 2023 - ${currentYear}`;
});