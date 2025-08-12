// Manga and Anime renderer JavaScript functions

let mangaData = [];
let animeData = [];

// Load CSS file
function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'styleweeb.css';
    document.head.appendChild(link);
}

// Load manga data from JSON file
async function loadMangaData() {
    try {
        const response = await fetch('/json/manga-data.json');
        mangaData = await response.json();
        return mangaData;
    } catch (error) {
        console.error('Error loading manga data:', error);
        return [];
    }
}

// Load anime data from JSON file
async function loadAnimeData() {
    try {
        const response = await fetch('/json/anime-data.json');
        animeData = await response.json();
        return animeData;
    } catch (error) {
        console.error('Error loading anime data:', error);
        return [];
    }
}

// JavaScript function to render the manga list
function renderMangaList(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found`);
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    data.forEach(manga => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';

        listItem.innerHTML = `
            <div class="image">
                <img src="${manga.image.src}" alt="${manga.image.alt}">
            </div>
            <div class="description">
                <div class="description-header">
                    <img src="${manga.description.header.image.src}" alt="${manga.description.header.image.alt}">
                    <div class="name">
                        <h3>${manga.description.header.name.title}</h3>
                        <small>${manga.description.header.name.author}</small>
                    </div>
                </div>
            </div>
            <div class="description-content">
                <div class="status" style="border-bottom: 1px solid gray; padding-bottom: 8px;">
                    ${manga.descriptionContent.status}
                </div>
                <h4>Reader's comment:</h4>
                <p>${manga.descriptionContent.comment}</p>
            </div>
        `;

        container.appendChild(listItem);
    });
}

// JavaScript function to render the anime list
function renderAnimeList(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found`);
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    data.forEach(anime => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';

        listItem.innerHTML = `
            <div class="image">
                <img src="${anime.image.src}" alt="${anime.image.alt}">
            </div>
            <div class="description">
                <div class="description-header">
                    <img src="${anime.description.header.image.src}" alt="${anime.description.header.image.alt}">
                    <div class="name">
                        <h3>${anime.description.header.name.title}</h3>
                        <small>${anime.description.header.name.author}</small>
                    </div>
                </div>
            </div>
            <div class="description-content">
                <div class="status" style="border-bottom: 1px solid gray; padding-bottom: 8px;">
                    ${anime.descriptionContent.status}
                </div>
                <h4>Reader's comment:</h4>
                <p>${anime.descriptionContent.comment}</p>
            </div>
        `;

        container.appendChild(listItem);
    });
}

// Function to initialize and render manga list
async function initMangaList(containerId) {
    const data = await loadMangaData();
    renderMangaList(data, containerId);
}

// Function to initialize and render anime list
async function initAnimeList(containerId) {
    const data = await loadAnimeData();
    renderAnimeList(data, containerId);
}

// Function to get specific manga data by title
function getMangaByTitle(title) {
    return mangaData.find(manga => manga.description.header.name.title === title);
}

// Function to get specific anime data by title
function getAnimeByTitle(title) {
    return animeData.find(anime => anime.description.header.name.title === title);
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCSS();
    
    // Initialize manga section if container exists
    if (document.getElementById('manga-container')) {
        initMangaList('manga-container');
    }
    
    // Initialize anime section if container exists
    if (document.getElementById('anime-container')) {
        initAnimeList('anime-container');
    }
});