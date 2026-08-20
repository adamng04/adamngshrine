import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

const appScript = readFileSync(resolve(process.cwd(), 'js/app.js'), 'utf8');
const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

const originalConsole = console;

function setupDom() {
  const dom = new JSDOM(indexHtml, { url: 'https://example.com', runScripts: 'outside-only' });

  global.window = dom.window;
  global.document = dom.window.document;
  global.Event = dom.window.Event;
  global.console = { ...originalConsole, error: vi.fn() };

  const audio = document.getElementById('audio');
  const reisen = document.getElementById('reisen');
  if (audio) Object.defineProperty(audio, 'play', { value: vi.fn() });
  if (reisen) Object.defineProperty(reisen, 'play', { value: vi.fn() });
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

  it('uses accessible burger markup in the page', () => {
    const toggle = document.getElementById('mobile-nav-toggle');
    const burger = toggle.querySelector('.burger-icon');

    expect(toggle.tagName).toBe('BUTTON');
    expect(toggle.getAttribute('aria-label')).toBe('Toggle navigation');
    expect(toggle.getAttribute('aria-controls')).toBe('links');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(burger.getAttribute('aria-hidden')).toBe('true');
    expect(burger.children).toHaveLength(3);
  });

  it('closes the mobile navigation menu after a link is clicked', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const toggle = document.getElementById('mobile-nav-toggle');
    const links = document.getElementById('links');

    toggle.click();
    links.querySelector('a').click();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(links.style.display).toBe('none');
  });

  it('closes the mobile navigation menu when clicking outside it', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const toggle = document.getElementById('mobile-nav-toggle');
    const links = document.getElementById('links');

    toggle.click();
    expect(links.style.display).toBe('block');

    document.body.click();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(links.style.display).toBe('none');
  });
});