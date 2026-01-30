// Maritime Cybersecurity Calendar - Main JS

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.conference-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search');
    const noResults = document.getElementById('no-results');

    // Stats elements
    const totalCount = document.getElementById('total-count');
    const countriesCount = document.getElementById('countries-count');
    const cyberCount = document.getElementById('cyber-count');
    const favoritesCountEl = document.getElementById('favorites-count');

    // Export elements
    const exportTxtBtn = document.getElementById('export-txt');
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportEmptyMsg = document.getElementById('export-empty-msg');

    // Favorites storage key
    const FAVORITES_KEY = 'mc3-favorites';

    // Load favorites from localStorage
    function getFavorites() {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    // Save favorites to localStorage
    function saveFavorites(favorites) {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        } catch (e) {
            console.warn('Could not save favorites to localStorage');
        }
    }

    // Toggle favorite status
    function toggleFavorite(cardId) {
        const favorites = getFavorites();
        const index = favorites.indexOf(cardId);

        if (index === -1) {
            favorites.push(cardId);
        } else {
            favorites.splice(index, 1);
        }

        saveFavorites(favorites);
        return index === -1; // returns true if added, false if removed
    }

    // Check if card is favorited
    function isFavorite(cardId) {
        return getFavorites().includes(cardId);
    }

    // Update favorite button visual state
    function updateFavoriteButton(card) {
        const cardId = card.dataset.id;
        const btn = card.querySelector('.favorite-btn');
        const isFav = isFavorite(cardId);

        if (isFav) {
            card.classList.add('is-favorite');
            btn.classList.add('active');
            btn.title = btn.dataset.removeTitle;
        } else {
            card.classList.remove('is-favorite');
            btn.classList.remove('active');
            btn.title = btn.dataset.addTitle;
        }
    }

    // Initialize favorites state on all cards
    function initFavorites() {
        cards.forEach(card => {
            updateFavoriteButton(card);

            const btn = card.querySelector('.favorite-btn');
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const cardId = card.dataset.id;
                toggleFavorite(cardId);
                updateFavoriteButton(card);
                updateFavoritesCount();

                // Re-filter if favorites filter is active
                const activeFilter = document.querySelector('.filter-btn.active');
                if (activeFilter && activeFilter.dataset.filter === 'favorites') {
                    filterCards();
                }
            });
        });

        updateFavoritesCount();
    }

    // Update favorites count in stats
    function updateFavoritesCount() {
        const count = getFavorites().length;
        if (favoritesCountEl) {
            favoritesCountEl.textContent = count;
        }

        // Show/hide export empty message
        if (exportEmptyMsg) {
            exportEmptyMsg.style.display = count === 0 ? 'block' : 'none';
        }
    }

    // Initial stats calculation
    updateStats();
    initFavorites();

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterCards();
        });
    });

    // Search functionality
    searchInput.addEventListener('input', filterCards);

    // Keyboard shortcut for search
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            searchInput.value = '';
            filterCards();
            searchInput.blur();
        }
    });

    // Tag click to search
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            searchInput.value = this.dataset.tag;
            filterCards();
        });
    });

    function filterCards() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
            let showByFilter = true;
            let showBySearch = true;

            // Filter logic
            switch(activeFilter) {
                case 'all':
                    showByFilter = true;
                    break;
                case 'conference':
                    showByFilter = card.dataset.type === 'conference';
                    break;
                case 'expo':
                    showByFilter = card.dataset.type === 'expo';
                    break;
                case 'summit':
                    showByFilter = card.dataset.type === 'summit' || card.dataset.type === 'forum' || card.dataset.type === 'symposium';
                    break;
                case 'cfp':
                    showByFilter = card.dataset.cfp === 'true';
                    break;
                case 'cyber-track':
                    showByFilter = card.dataset.cyberTrack === 'true';
                    break;
                case 'online':
                    showByFilter = card.dataset.online === 'true';
                    break;
                case 'favorites':
                    showByFilter = isFavorite(card.dataset.id);
                    break;
            }

            // Search logic
            if (searchTerm) {
                const name = card.dataset.name.toLowerCase();
                const place = card.dataset.place.toLowerCase();
                const tags = card.dataset.tags.toLowerCase();
                const country = card.dataset.country.toLowerCase();

                showBySearch = name.includes(searchTerm) ||
                               place.includes(searchTerm) ||
                               tags.includes(searchTerm) ||
                               country.includes(searchTerm);
            }

            // Apply visibility
            if (showByFilter && showBySearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }

        // Update displayed count
        totalCount.textContent = visibleCount;
    }

    function updateStats() {
        // Total conferences
        totalCount.textContent = cards.length;

        // Unique countries
        const countries = new Set();
        cards.forEach(card => {
            countries.add(card.dataset.country);
        });
        countriesCount.textContent = countries.size;

        // Cyber track conferences
        let cyberTrackCount = 0;
        cards.forEach(card => {
            if (card.dataset.cyberTrack === 'true') {
                cyberTrackCount++;
            }
        });
        cyberCount.textContent = cyberTrackCount;
    }

    // Sort cards by date
    function sortCardsByDate() {
        const grid = document.getElementById('conferences');
        const cardsArray = Array.from(cards);

        cardsArray.sort((a, b) => {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            return dateA - dateB;
        });

        cardsArray.forEach(card => {
            grid.appendChild(card);
        });
    }

    // Sort on load
    sortCardsByDate();

    // Get favorite cards data for export
    function getFavoriteCardsData() {
        const favorites = getFavorites();
        const data = [];

        cards.forEach(card => {
            if (favorites.includes(card.dataset.id)) {
                data.push({
                    name: card.dataset.name,
                    date_start: card.dataset.date,
                    date_end: card.dataset.dateEnd || card.dataset.date,
                    place: card.dataset.place,
                    country: card.dataset.country,
                    type: card.dataset.type,
                    tags: card.dataset.tags,
                    price: card.dataset.price || '',
                    link: card.dataset.link || '',
                    description: card.dataset.description || '',
                    cyber_track: card.dataset.cyberTrack === 'true',
                    online: card.dataset.online === 'true'
                });
            }
        });

        // Sort by date
        data.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

        return data;
    }

    // Export to TXT
    function exportToTxt() {
        const data = getFavoriteCardsData();

        if (data.length === 0) {
            if (exportEmptyMsg) {
                exportEmptyMsg.style.display = 'block';
                setTimeout(() => {
                    exportEmptyMsg.style.display = getFavorites().length === 0 ? 'block' : 'none';
                }, 3000);
            }
            return;
        }

        let content = '='.repeat(60) + '\n';
        content += 'MC³ - Maritime Cybersecurity Conference Calendar\n';
        content += 'My Favorite Conferences\n';
        content += 'Exported: ' + new Date().toLocaleDateString() + '\n';
        content += '='.repeat(60) + '\n\n';

        data.forEach((conf, index) => {
            content += '-'.repeat(50) + '\n';
            content += `${index + 1}. ${conf.name}\n`;
            content += '-'.repeat(50) + '\n';
            content += `Date:     ${conf.date_start}`;
            if (conf.date_end !== conf.date_start) {
                content += ` - ${conf.date_end}`;
            }
            content += '\n';
            content += `Location: ${conf.place}, ${conf.country}\n`;
            content += `Type:     ${conf.type}`;
            if (conf.cyber_track) content += ' | Cyber Track';
            if (conf.online) content += ' | Online';
            content += '\n';
            if (conf.price) {
                content += `Price:    ${conf.price}\n`;
            }
            if (conf.tags) {
                content += `Tags:     ${conf.tags}\n`;
            }
            if (conf.link) {
                content += `Link:     ${conf.link}\n`;
            }
            if (conf.description) {
                content += `\n${conf.description}\n`;
            }
            content += '\n';
        });

        content += '='.repeat(60) + '\n';
        content += `Total: ${data.length} conference(s)\n`;
        content += '='.repeat(60) + '\n';

        // Download file
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mc3-favorites-' + new Date().toISOString().slice(0, 10) + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Export to PDF (opens print dialog with styled content)
    function exportToPdf() {
        const data = getFavoriteCardsData();

        if (data.length === 0) {
            if (exportEmptyMsg) {
                exportEmptyMsg.style.display = 'block';
                setTimeout(() => {
                    exportEmptyMsg.style.display = getFavorites().length === 0 ? 'block' : 'none';
                }, 3000);
            }
            return;
        }

        // Create print-friendly HTML
        let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MC³ - Favorite Conferences</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #1a1a2e;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #0077b6;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #0077b6;
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .conference {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        .conference h2 {
            color: #0077b6;
            font-size: 16px;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        }
        .conference .meta {
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: 5px 10px;
            font-size: 13px;
        }
        .conference .meta .label {
            font-weight: 600;
            color: #444;
        }
        .conference .badges {
            margin-top: 10px;
        }
        .conference .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            margin-right: 5px;
        }
        .badge-cyber { background: #e3f2fd; color: #1565c0; }
        .badge-online { background: #e8f5e9; color: #2e7d32; }
        .badge-type { background: #f5f5f5; color: #666; }
        .conference .description {
            margin-top: 10px;
            font-size: 12px;
            color: #555;
            font-style: italic;
        }
        .conference .link {
            margin-top: 10px;
            font-size: 12px;
            word-break: break-all;
        }
        .conference .link a {
            color: #0077b6;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        @media print {
            body { padding: 0; }
            .conference { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>MC³ - Maritime Cybersecurity Conference Calendar</h1>
        <p>My Favorite Conferences | Exported: ${new Date().toLocaleDateString()}</p>
    </div>
`;

        data.forEach((conf, index) => {
            html += `
    <div class="conference">
        <h2>${index + 1}. ${escapeHtml(conf.name)}</h2>
        <div class="meta">
            <span class="label">Date:</span>
            <span>${conf.date_start}${conf.date_end !== conf.date_start ? ' - ' + conf.date_end : ''}</span>
            <span class="label">Location:</span>
            <span>${escapeHtml(conf.place)}, ${conf.country}</span>
            ${conf.price ? `<span class="label">Price:</span><span>${escapeHtml(conf.price)}</span>` : ''}
            ${conf.tags ? `<span class="label">Tags:</span><span>${escapeHtml(conf.tags)}</span>` : ''}
        </div>
        <div class="badges">
            <span class="badge badge-type">${conf.type}</span>
            ${conf.cyber_track ? '<span class="badge badge-cyber">Cyber Track</span>' : ''}
            ${conf.online ? '<span class="badge badge-online">Online</span>' : ''}
        </div>
        ${conf.description ? `<div class="description">${escapeHtml(conf.description)}</div>` : ''}
        ${conf.link ? `<div class="link"><a href="${escapeHtml(conf.link)}">${escapeHtml(conf.link)}</a></div>` : ''}
    </div>
`;
        });

        html += `
    <div class="footer">
        Total: ${data.length} conference(s) | MC³ - Maritime Cybersecurity Conference Calendar
    </div>
</body>
</html>`;

        // Open in new window and trigger print
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();

        // Delay print to ensure content is loaded
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    // Helper function to escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Export button event listeners
    if (exportTxtBtn) {
        exportTxtBtn.addEventListener('click', exportToTxt);
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportToPdf);
    }
});
