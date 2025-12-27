let TOOLS = [];

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
        const input = document.getElementById('searchInput');
        input.value = tag;
        handleSearch(tag);
        input.focus();
    }
});

// Clear with ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const input = document.getElementById('searchInput');
        input.value = '';
        handleSearch('');
        input.focus();
    }
});

// Init
document.addEventListener('DOMContentLoaded', async () => {
    const input = document.getElementById('searchInput');
    input.focus();

    await loadTools();
    renderTable(TOOLS);

    input.addEventListener('input', e =>
        handleSearch(e.target.value.trim())
    );
});
