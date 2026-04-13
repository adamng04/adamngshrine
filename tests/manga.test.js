import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

const mangaScript = readFileSync(resolve(process.cwd(), 'manga.js'), 'utf8');

function createData(title) {
  return [{
    image: { src: '/img.png', alt: 'cover' },
    description: {
      header: {
        image: { src: '/head.png', alt: 'header' },
        name: { title, author: 'author' }
      }
    },
    descriptionContent: { status: 'reading', comment: 'good' }
  }];
}

async function flushAsync() {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 0));
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 0));
}

describe('manga.js', () => {
  beforeEach(() => {
    const dom = new JSDOM(`
      <body>
        <div id="manga-container"></div>
        <div id="anime-container"></div>
      </body>
    `, { url: 'https://example.com' });

    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
    global.fetch = vi.fn((url) => Promise.resolve({
      json: async () => url.includes('manga') ? createData('manga one') : createData('anime one')
    }));

    vm.runInThisContext(mangaScript);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete global.window;
    delete global.document;
    delete global.Event;
    delete global.fetch;
  });

  it('smoke: renders list items from fetched json', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushAsync();

    expect(fetch).toHaveBeenCalled();
    expect(document.querySelectorAll('#manga-container .list-item')).toHaveLength(1);
    expect(document.querySelectorAll('#anime-container .list-item')).toHaveLength(1);
  });
});
