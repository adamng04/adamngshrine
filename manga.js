function loadCSS() {
    const link = document.createElement('link');
    Object.assign(link, {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/styleweeb.css'
    });
    document.head.appendChild(link);
}

async function loadData(url) {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (err) {
        console.error(`Error loading ${url}:`, err);
        return [];
    }
}

function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

function renderList(data, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return console.error(`Container "${containerId}" not found`);
    container.replaceChildren();

    data.forEach(item => {
        const listItem = createEl('div', 'list-item');

        const imageDiv = createEl('div', 'image');
        const img = document.createElement('img');
        img.src = `/index/weebimages/${type}/${item.cover}`;
        img.alt = item.title;
        imageDiv.appendChild(img);

        const descDiv = createEl('div', 'description');
        const descHeader = createEl('div', 'description-header');

        const headerImg = document.createElement('img');
        headerImg.src = `/index/weebimages/${type}/${item.cover}`;
        headerImg.alt = item.title;

        const nameDiv = createEl('div', 'name');
        nameDiv.appendChild(createEl('h3', null, item.title));
        nameDiv.appendChild(createEl('small', null, `${item.author} - ${item.year}`));

        descHeader.appendChild(headerImg);
        descHeader.appendChild(nameDiv);
        descDiv.appendChild(descHeader);

        const descContent = createEl('div', 'description-content');

        const scoreText = item.score != null ? `${item.score}/10` : "--/10";
        const statusDiv = createEl('div', 'status', `Status: ${item.status}. - Score: ${scoreText}`);

        descContent.appendChild(statusDiv);
        descContent.appendChild(createEl('h4', null, "Reader's comment:"));
        descContent.appendChild(createEl('p', null, item.comment));

        listItem.appendChild(imageDiv);
        listItem.appendChild(descDiv);
        listItem.appendChild(descContent);

        container.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    loadCSS();

    const sections = ["manga", "anime"];

    for (const type of sections) {
        const container = `${type}-container`;
        const el = document.getElementById(container);
        if (!el) continue;
        const data = await loadData(`/json/${type}-data.json`);
        renderList(data, container, type);
    }
});
