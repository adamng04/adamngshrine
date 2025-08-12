let mangaData = [];
let animeData = [];

// Load CSS file
function loadCSS() {
    const link = document.createElement('link');
    Object.assign(link, {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'styleweeb.css'
    });
    document.head.appendChild(link);
}

// Generic JSON loader
async function loadData(url) {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (err) {
        console.error(`Error loading ${url}:`, err);
        return [];
    }
}

// Safe DOM helper
function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

// XSS-safe renderer (keeps HTML layout)
function renderList(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return console.error(`Container "${containerId}" not found`);
    container.innerHTML = '';

    data.forEach(item => {
        const listItem = createEl('div', 'list-item');

        // Image section
        const imageDiv = createEl('div', 'image');
        const img = document.createElement('img');
        img.src = item.image.src;
        img.alt = item.image.alt;
        imageDiv.appendChild(img);

        // Description section
        const descDiv = createEl('div', 'description');
        const descHeader = createEl('div', 'description-header');

        const headerImg = document.createElement('img');
        headerImg.src = item.description.header.image.src;
        headerImg.alt = item.description.header.image.alt;

        const nameDiv = createEl('div', 'name');
        nameDiv.appendChild(createEl('h3', null, item.description.header.name.title));
        nameDiv.appendChild(createEl('small', null, item.description.header.name.author));

        descHeader.appendChild(headerImg);
        descHeader.appendChild(nameDiv);
        descDiv.appendChild(descHeader);

        // Description content section
        const descContent = createEl('div', 'description-content');

        const statusDiv = createEl('div', 'status', item.descriptionContent.status);
        statusDiv.style.borderBottom = '1px solid gray';
        statusDiv.style.paddingBottom = '8px';

        descContent.appendChild(statusDiv);
        descContent.appendChild(createEl('h4', null, "Reader's comment:"));
        descContent.appendChild(createEl('p', null, item.descriptionContent.comment));

        // Assemble list item
        listItem.appendChild(imageDiv);
        listItem.appendChild(descDiv);
        listItem.appendChild(descContent);

        container.appendChild(listItem);
    });
}

// Single "get by title" for any dataset
function getByTitle(data, title) {
    return data.find(item => item.description.header.name.title === title);
}

// Auto-init
document.addEventListener('DOMContentLoaded', async () => {
    loadCSS();

    const sections = [
        { id: 'manga-container', url: '/json/manga-data.json', store: d => mangaData = d },
        { id: 'anime-container', url: '/json/anime-data.json', store: d => animeData = d }
    ];

    for (const { id, url, store } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const data = await loadData(url);
        store(data);
        renderList(data, id);
    }
});

