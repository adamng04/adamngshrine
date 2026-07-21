function toggleMenuVisibility(menuId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('links-menu-toggle');
  if (menuButton) {
    menuButton.addEventListener('click', () => toggleMenuVisibility('links'));
  }

  const audio = document.getElementById('help');
  if (audio) {
    audio.volume = 0.3;
  }

  const footerText = document.querySelector('.footer');
  if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.textContent = `copyright CC BY-SA 4.0 adamngshrine ~ 2023 - ${currentYear}`;
  }
});
