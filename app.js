let TOOLS = [];
let activeTags = new Set();

// Load tools once
async function loadTools() {
    if (TOOLS.length) return TOOLS;

    try {
        const res = await fetch('tools.json');
        TOOLS = await res.json();

        // normalize tags defensively
        TOOLS = TOOLS.map(t => ({
            ...t,
            tags: [...new Set(t.tags.map(tag => tag.toLowerCase().trim()))]
        }));

        return TOOLS;
    } catch (err) {
        console.error('Failed to load tools.json', err);
        return [];
    }
}

// Render table
function renderTable(data) {
    const tbody = document.querySelector('#toolTable tbody');
    tbody.innerHTML = data.map(tool => `
        <tr>
            <td>
                ${tool.website
                    ? `<a href="${tool.website}" target="_blank">${tool.name}</a>`
                    : tool.name}
            </td>
            <td>${tool.description}</td>
            <td>
                ${tool.tags.map(tag =>
                    `<span class="tag-badge" data-tag="${tag}">${tag}</span>`
                ).join(' ')}
            </td>
        </tr>
    `).join('');

    document.getElementById('resultCount').textContent =
        `${data.length} tools`;
}

// Filter logic
function filterTools(query) {
    if (!query) return TOOLS;

    const q = query.toLowerCase();
    return TOOLS.filter(tool =>
        tool.name.toLowerCase().includes(q) ||
        tool.tags.some(tag => tag === q || tag.includes(q))
    );
}

// Search handler
async function handleSearch(value) {
    await loadTools();
    renderTable(filterTools(value));
}

// Tag click (event delegation)
document.addEventListener('click', e => {
    if (e.target.classList.contains('tag-badge')) {
    const tag = e.target.dataset.tag;

    if (activeTags.has(tag)) {
        activeTags.delete(tag);
    } else {
        activeTags.add(tag);
    }

    applyFilters();
}
});

// Clear with ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const input = document.getElementById('searchInput');
        input.value = '';

        activeTags.clear();
        applyFilters();

        input.focus();
    }
});

// Init
document.addEventListener('DOMContentLoaded', async () => {
    const input = document.getElementById('searchInput');
    input.focus();

    await loadTools();
    renderTable(TOOLS);
    renderTagCloud(TOOLS);

    input.addEventListener('input', e =>
        applyFilters()
    );
});
function getTagCounts(tools) {
    const counts = {};

    tools.forEach(tool => {
        tool.tags.forEach(tag => {
            counts[tag] = (counts[tag] || 0) + 1;
        });
    });

    return counts;
}
function renderTagCloud(tools, activeTags = new Set()) {
    const tagCloud = document.getElementById('tagCloud');
    const counts = getTagCounts(tools);

    const sortedTags = Object.keys(counts).sort();

    tagCloud.innerHTML = sortedTags.map(tag => `
        <span class="tag-badge ${activeTags.has(tag) ? 'active' : ''}" data-tag="${tag}">
            ${tag}
            <span class="tag-count">(${counts[tag]})</span>
        </span>
    `).join(' ');
}
function applyFilters() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim().toLowerCase();

    let filtered = TOOLS;

    // text search
    if (query) {
        filtered = filtered.filter(tool =>
            tool.name.toLowerCase().includes(query) ||
            tool.tags.some(tag => tag.includes(query))
        );
    }

    // tag filtering (AND logic)
    if (activeTags.size > 0) {
        filtered = filtered.filter(tool =>
            [...activeTags].every(tag => tool.tags.includes(tag))
        );
    }

    renderTable(filtered);
    renderTagCloud(filtered, activeTags);
}