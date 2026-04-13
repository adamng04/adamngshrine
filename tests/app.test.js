import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

const appScript = readFileSync(resolve(process.cwd(), 'app.js'), 'utf8');

function setupDom() {
  const dom = new JSDOM(`
    <body>
      <button id="mobile-nav-toggle"></button>
      <div id="links"></div>
      <img id="reisen-trigger" />
      <img id="lain-trigger" />
      <audio id="reisen"></audio>
      <audio id="audio"></audio>
      <div id="articles-container"></div>
      <p class="footer"></p>
      <a class="button active" data-section="index"></a>
      <a class="button" data-section="about"></a>
      <main id="index" class="content active"></main>
      <section id="about" class="content"></section>
    </body>
  `, { url: 'https://example.com' });

  global.window = dom.window;
  global.document = dom.window.document;
  global.Event = dom.window.Event;
  global.KeyboardEvent = dom.window.KeyboardEvent;
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ username: 'adam', content: 'hello', timestamp: 'now' }]
  });
  global.console = { ...console, error: vi.fn() };

  Object.defineProperty(document.getElementById('audio'), 'play', { value: vi.fn() });
  Object.defineProperty(document.getElementById('reisen'), 'play', { value: vi.fn() });
}

async function flushAsync() {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 0));
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 0));
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
    delete global.KeyboardEvent;
    delete global.fetch;
  });

  it('smoke: initializes without runtime errors', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushAsync();

    expect(fetch).toHaveBeenCalled();
    expect(document.querySelector('.footer').textContent).toContain('2023');
    expect(console.error).not.toHaveBeenCalled();
  });
});
