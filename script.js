document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    const toolTable = document.getElementById('toolTable').getElementsByTagName('tbody')[0];

    // Event listener for input changes in search field
    searchInput.addEventListener('input', function () {
        const inputValue = this.value.trim();

        // Filter table rows based on current input
        filterAndDisplayTools(inputValue);
    });
});
