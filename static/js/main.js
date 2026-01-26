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
    
    // Initial stats calculation
    updateStats();
    
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
});
