    
        // Mobile functionality (same as original)
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const closeSidebar = document.getElementById('closeSidebar');

        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            mobileOverlay.classList.add('active');
        });

        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('open');
            mobileOverlay.classList.remove('active');
        });

        mobileOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            mobileOverlay.classList.remove('active');
        });

        // User profile dropdown functionality (same as original)
        const userProfile = document.getElementById('userProfile');
        const userDropdown = document.getElementById('userDropdown');

        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            userProfile.classList.toggle('active');
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            userProfile.classList.remove('active');
            userDropdown.classList.remove('show');
        });

        // View toggle functionality
        const viewButtons = document.querySelectorAll('.view-btn');
        const documentsGrid = document.getElementById('documentsGrid');
        const documentsList = document.getElementById('documentsList');

        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                
                // Update active button
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Toggle views
                if (view === 'grid') {
                    documentsGrid.style.display = 'grid';
                    documentsList.classList.remove('active');
                } else {
                    documentsGrid.style.display = 'none';
                    documentsList.classList.add('active');
                }
            });
        });

        // Sort dropdown functionality
        const sortBtn = document.getElementById('sortBtn');
        const sortMenu = document.getElementById('sortMenu');
        const sortOptions = document.querySelectorAll('.sort-option');

        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sortMenu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            sortMenu.classList.remove('show');
        });

        sortOptions.forEach(option => {
            option.addEventListener('click', () => {
                const sortType = option.dataset.sort;
                const sortText = option.textContent.trim();
                
                // Update active option
                sortOptions.forEach(opt => {
                    opt.classList.remove('active');
                    opt.querySelector('i').style.opacity = '0';
                });
                option.classList.add('active');
                option.querySelector('i').style.opacity = '1';
                
                // Update button text
                sortBtn.querySelector('span').textContent = `Sort by ${sortText}`;
                
                // Close menu
                sortMenu.classList.remove('show');
                
                // Here you would implement actual sorting logic
                console.log('Sorting by:', sortType);
            });
        });

        // Filter functionality
        const filterTags = document.querySelectorAll('.filter-tag');
        const documentCards = document.querySelectorAll('.document-card-enhanced');
        const documentRows = document.querySelectorAll('.document-row');

        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const filterType = tag.dataset.type || tag.dataset.status;
                const filterCategory = tag.dataset.type ? 'type' : 'status';
                
                // Update active tag within the same group
                const siblingTags = tag.parentNode.querySelectorAll('.filter-tag');
                siblingTags.forEach(sibling => sibling.classList.remove('active'));
                tag.classList.add('active');
                
                // Filter documents
                filterDocuments();
            });
        });

        function filterDocuments() {
            const activeTypeFilter = document.querySelector('.filter-tag[data-type].active').dataset.type;
            const activeStatusFilter = document.querySelector('.filter-tag[data-status].active').dataset.status;
            
            // Filter grid view
            documentCards.forEach(card => {
                const cardType = card.dataset.type;
                const cardStatus = card.dataset.status;
                
                const typeMatch = activeTypeFilter === 'all' || cardType === activeTypeFilter;
                const statusMatch = activeStatusFilter === 'all' || cardStatus === activeStatusFilter;
                
                if (typeMatch && statusMatch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Filter list view
            documentRows.forEach(row => {
                const rowType = row.dataset.type;
                const rowStatus = row.dataset.status;
                
                const typeMatch = activeTypeFilter === 'all' || rowType === activeTypeFilter;
                const statusMatch = activeStatusFilter === 'all' || rowStatus === activeStatusFilter;
                
                if (typeMatch && statusMatch) {
                    row.style.display = 'grid';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Update document count
            const visibleCount = document.querySelectorAll('.document-card-enhanced[style="display: block;"], .document-card-enhanced:not([style*="display: none"])').length;
            document.querySelector('.document-count').textContent = `${visibleCount} documents`;
        }

        // Document menu functionality
        const menuButtons = document.querySelectorAll('.document-menu-btn');
        
        menuButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close all other dropdowns
                document.querySelectorAll('.document-dropdown').forEach(dropdown => {
                    if (dropdown !== btn.nextElementSibling) {
                        dropdown.classList.remove('show');
                    }
                });
                
                // Toggle current dropdown
                const dropdown = btn.nextElementSibling;
                dropdown.classList.toggle('show');
            });
        });

        // Document dropdown actions
        document.querySelectorAll('.dropdown-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = option.textContent.trim();
                const documentTitle = option.closest('.document-card-enhanced').querySelector('.document-title-enhanced').textContent;
                
                console.log(`Action: ${action} on document: ${documentTitle}`);
                
                // Close dropdown
                option.closest('.document-dropdown').classList.remove('show');
                
                // Handle specific actions
                switch(action) {
                    case 'View Document':
                        console.log('Opening document viewer...');
                        break;
                    case 'Start Study Session':
                        console.log('Starting study session...');
                        break;
                    case 'Rename':
                        console.log('Renaming document...');
                        break;
                    case 'Duplicate':
                        console.log('Duplicating document...');
                        break;
                    case 'Delete':
                        console.log('Deleting document...');
                        break;
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.document-dropdown').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        });

        // Document card click (for studying)
        documentCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on menu or actions
                if (e.target.closest('.document-menu') || e.target.closest('.document-actions')) {
                    return;
                }
                
                const title = card.querySelector('.document-title-enhanced').textContent;
                console.log('Starting study session with:', title);
            });
        });

        // Document row click (for studying)
        documentRows.forEach(row => {
            row.addEventListener('click', () => {
                const title = row.querySelector('.row-document-title').textContent;
                console.log('Starting study session with:', title);
            });
        });

        // Study button actions
        document.querySelectorAll('.action-btn-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (btn.textContent.trim() === 'Study') {
                    const title = btn.closest('.document-card-enhanced').querySelector('.document-title-enhanced').textContent;
                    console.log('Starting study session with:', title);
                }
            });
        });

        // Search functionality (same as original)
        const searchInput = document.querySelector('.search-input');
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });

        // Search documents
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query === '') {
                // Reset to current filter state
                filterDocuments();
                return;
            }
            
            // Search in grid view
            documentCards.forEach(card => {
                const title = card.querySelector('.document-title-enhanced').textContent.toLowerCase();
                const description = card.querySelector('.document-description').textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Search in list view
            documentRows.forEach(row => {
                const title = row.querySelector('.row-document-title').textContent.toLowerCase();
                const description = row.querySelector('.row-document-description').textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    row.style.display = 'grid';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Update document count for search results
            const visibleCards = document.querySelectorAll('.document-card-enhanced[style*="display: block"], .document-card-enhanced:not([style*="display: none"])').length;
            document.querySelector('.document-count').textContent = `${visibleCards} documents`;
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key functionality
            if (e.key === 'Escape') {
                // Close all dropdowns
                document.querySelectorAll('.document-dropdown, .sort-menu, .user-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
                
                // Clear search
                if (searchInput.value) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                }
                
                // Close mobile sidebar
                sidebar.classList.remove('open');
                mobileOverlay.classList.remove('active');
            }
            
            // Ctrl/Cmd + K for search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            
            // Ctrl/Cmd + 1/2 for view toggle
            if ((e.metaKey || e.ctrlKey) && (e.key === '1' || e.key === '2')) {
                e.preventDefault();
                const targetView = e.key === '1' ? 'grid' : 'list';
                const targetBtn = document.querySelector(`[data-view="${targetView}"]`);
                if (targetBtn) targetBtn.click();
            }
        });

        // Add loading states for better UX
        function showLoadingState() {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Loading documents...</span>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
        }

        function hideLoadingState() {
            const loadingOverlay = document.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
        }

        // Initialize page
        function initializePage() {
            // Set initial document count
            const totalDocs = documentCards.length;
            document.querySelector('.document-count').textContent = `${totalDocs} documents`;
            
            // Focus search on load if coming from search context
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('focus') === 'search') {
                setTimeout(() => searchInput.focus(), 100);
            }
            
            console.log('Document Library initialized');
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', initializePage);

        // Handle browser back/forward navigation
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view) {
                const viewBtn = document.querySelector(`[data-view="${e.state.view}"]`);
                if (viewBtn) viewBtn.click();
            }
        });

        // Update browser history on view changes
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                history.pushState({ view }, '', `?view=${view}`);
            });
        });
    