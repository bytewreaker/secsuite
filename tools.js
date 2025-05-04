// script.js

// Function to fetch table data from JSON file
function fetchTableData(callback) {
    fetch('tools.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching data:', error));
}

// Function to filter tools based on search input
function filterTools(input, tools) {
    const lowerInput = input.toLowerCase();
    return tools.filter(tool =>
        tool.name.toLowerCase().includes(lowerInput) ||
        tool.tags.some(tag => tag.toLowerCase().includes(lowerInput))
    );
}

// Function to update table rows based on filtered data
function updateTable(filteredTools) {
    const toolTableBody = document.querySelector('#toolTable tbody');

    // Clear existing table rows
    toolTableBody.innerHTML = '';

    // Populate table with filtered data using template literals
    const rows = filteredTools.map(tool => `
        <tr>
            <td>${tool.website ? `<a href="${tool.website}" target="_blank">${tool.name}</a>` : tool.name}</td>
            <td>${tool.description}</td>
            <td>${tool.tags.join(', ')}</td>
        </tr>
    `).join('');

    toolTableBody.innerHTML = rows;
}

// Function to fetch data, filter and update table
function filterAndDisplayTools(inputValue) {
    fetchTableData(function (tools) {
        const filteredTools = filterTools(inputValue, tools);
        updateTable(filteredTools);
    });
}

// Initial population of the table
fetchTableData(function (tools) {
    updateTable(tools);
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', function () {
    filterAndDisplayTools(this.value);
});
