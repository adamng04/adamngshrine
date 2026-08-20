import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

const appScript = readFileSync(resolve(process.cwd(), 'js/app.js'), 'utf8');

const originalConsole = console;

// Minimal fixture containing only the elements app.js touches. Deliberately
// avoids the full real index.html: that page contains real anchor hrefs and
// third-party iframes/scripts which make jsdom throw "Not implemented:
// navigation to another Document" and produce flaky test state.
function setupDom() {
  const dom = new JSDOM(`
    <body>
      <button id="mobile-nav-toggle" class="icon" aria-label="Toggle navigation" aria-expanded="false" aria-controls="links">
        <span class="burger-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <div id="links" role="menu">
        <a href="#" data-testid="nav-link">weeb corner</a>
      </div>
      <img id="reisen-trigger" />
      <img id="lain-trigger" />
      <audio id="reisen"></audio>
      <audio id="audio"></audio>
      <p class="footer"></p>
    </body>
  `, { url: 'https://example.com' });

  global.window = dom.window;
  global.document = dom.window.document;
  global.Event = dom.window.Event;
  global.console = { ...originalConsole, error: vi.fn() };

  // The test anchor uses href="#" (no real navigation), but guard anyway
  // so a future markup change here can't reintroduce jsdom navigation noise.
  document.querySelector('[data-testid="nav-link"]').addEventListener('click', (e) => e.preventDefault());

  const audio = document.getElementById('audio');
  const reisen = document.getElementById('reisen');
  Object.defineProperty(audio, 'play', { value: vi.fn() });
  Object.defineProperty(reisen, 'play', { value: vi.fn() });
}

describe('app.js', () => {
  beforeEach(() => {
    setupDom();
    vm.runInThisContext(appScript);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete global.window;
    delete global.document;
    delete global.Event;
    global.console = originalConsole;
  });

  it('smoke: initializes without runtime errors', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.querySelector('.footer').textContent).toContain(String(new Date().getFullYear()));
    expect(console.error).not.toHaveBeenCalled();
  });

  it('toggles the mobile navigation menu', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const toggle = document.getElementById('mobile-nav-toggle');
    const links = document.getElementById('links');

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(links.style.display).toBe('none');

    toggle.click();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(links.style.display).toBe('block');

    toggle.click();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(links.style.display).toBe('none');
  });

  it('uses accessible burger markup on the toggle button', () => {
    const toggle = document.getElementById('mobile-nav-toggle');
    const burger = toggle.querySelector('.burger-icon');

    expect(toggle.tagName).toBe('BUTTON');
    expect(toggle.getAttribute('aria-label')).toBe('Toggle navigation');
    expect(toggle.getAttribute('aria-controls')).toBe('links');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(burger.getAttribute('aria-hidden')).toBe('true');
    expect(burger.children).toHaveLength(3);
  });

  it('opens then closes the mobile navigation menu after a link is clicked', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const toggle = document.getElementById('mobile-nav-toggle');
    const links = document.getElementById('links');

    toggle.click();
    expect(links.style.display).toBe('block'); // confirms it actually opened first

    links.querySelector('a').click();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(links.style.display).toBe('none');
  });

  it('opens then closes the mobile navigation menu when clicking outside it', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const toggle = document.getElementById('mobile-nav-toggle');
    const links = document.getElementById('links');

    toggle.click();
    expect(links.style.display).toBe('block'); // confirms it actually opened first

    document.body.click();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(links.style.display).toBe('none');
  });
});