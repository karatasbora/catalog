document.addEventListener('DOMContentLoaded', () => {
    // Check for ?fw= direct linking to Figma
    const urlParams = new URLSearchParams(window.location.search);
    const fwId = urlParams.get('fw');
    if (fwId) {
        const targetSlide = archiveData.slides.find(s => s.id === fwId);
        if (targetSlide) {
            const protoUrl = targetSlide.figmaUrl.replace(/\/(design|file)\//, '/proto/');
            window.location.href = protoUrl;
            return; // Stop execution of the rest of the page
        }
    }

    const state = {
        lang: localStorage.getItem('preferredLang') || (navigator.language.startsWith('tr') ? 'tr' : 'en')
    };

    // DOM Elements
    const grid = document.getElementById('slide-grid');
    const btnTr = document.getElementById('btn-tr');
    const btnEn = document.getElementById('btn-en');
    const btnTheme = document.getElementById('btn-theme');

    // UI Elements for Translation
    const uiTitle = document.getElementById('ui-title');
    const searchInput = document.getElementById('search-input');
    const tagFilter = document.getElementById('tag-filter');
    const itemCountBadge = document.getElementById('item-count');

    // Filtering State
    let currentSearchTerm = '';
    let currentTagFilter = '';

    // Populate Filters
    function populateFilters() {
        const allTags = new Set();
        archiveData.slides.forEach(slide => {
            slide.tags.forEach(tag => allTags.add(tag));
        });

        // Keep the default option, clear the rest
        while (tagFilter.options.length > 1) {
            tagFilter.remove(1);
        }

        Array.from(allTags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });
    }

    function updateUI() {
        // Update Header
        uiTitle.textContent = archiveData.meta.title[state.lang];
        searchInput.placeholder = archiveData.ui.searchPlaceholder[state.lang];
        tagFilter.options[0].textContent = archiveData.ui.allCategoriesText[state.lang];
        
        // Update Modals Localization
        if (document.getElementById('contact-title')) {
            document.getElementById('contact-title').textContent = archiveData.ui.contactTitle[state.lang];
            document.getElementById('contact-subtitle').textContent = archiveData.ui.contactSubtitle[state.lang];
        }
        if (document.getElementById('share-title')) {
            document.getElementById('share-title').textContent = archiveData.ui.shareTitle[state.lang];
            document.getElementById('share-subtitle').textContent = archiveData.ui.shareSubtitle[state.lang];
            document.getElementById('copy-link-btn').textContent = archiveData.ui.copyLinkBtn[state.lang];
        }
        if (document.getElementById('close-modal')) {
            document.getElementById('close-modal').textContent = archiveData.ui.closeBtn[state.lang];
        }
        
        // Update Language Buttons
        btnTr.classList.toggle('active', state.lang === 'tr');
        btnEn.classList.toggle('active', state.lang === 'en');
        document.documentElement.lang = state.lang;
        
        populateFilters();
        renderGrid();
    }

    function renderGrid() {
        grid.innerHTML = '';

        const filteredSlides = archiveData.slides.filter(slide => {
            // Text Search
            const searchLower = currentSearchTerm.toLowerCase();
            const matchesSearch = !currentSearchTerm || 
                slide.title[state.lang].toLowerCase().includes(searchLower) ||
                slide.description[state.lang].toLowerCase().includes(searchLower) ||
                slide.topic[state.lang].toLowerCase().includes(searchLower) ||
                slide.tags.some(tag => tag.toLowerCase().includes(searchLower));

            // Tag Filter
            const matchesTag = !currentTagFilter || slide.tags.includes(currentTagFilter);

            return matchesSearch && matchesTag;
        });

        // Update Item Count Badge
        const itemCountText = archiveData.ui.itemsCount[state.lang] || 'Items';
        itemCountBadge.textContent = `${filteredSlides.length} ${itemCountText}`;

        if (filteredSlides.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--meta-color);">No items found matching your criteria.</div>`;
            return;
        }

        filteredSlides.forEach((slide) => {
            // Main Container exactly mirrors .job-block logic
            const jobBlock = document.createElement('div');
            jobBlock.className = 'job-block slide-card';
            
            // Layout wrapper
            const jobLayoutDiv = document.createElement('div');
            jobLayoutDiv.className = 'job-layout';

            const jobFigmaLeftDiv = document.createElement('div');
            jobFigmaLeftDiv.className = 'job-figma-left';

            const jobDetailsRightDiv = document.createElement('div');
            jobDetailsRightDiv.className = 'job-details-right';

            // Header Group (.job-header)
            const jobHeaderDiv = document.createElement('div');
            jobHeaderDiv.className = 'job-header';
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'job-title';
            titleSpan.textContent = slide.title[state.lang];
            
            jobHeaderDiv.appendChild(titleSpan);

            if (slide.pdfUrl) {
                const pdfLink = document.createElement('a');
                pdfLink.href = slide.pdfUrl;
                pdfLink.className = 'pdf-download-btn';
                pdfLink.title = state.lang === 'tr' ? 'Çalışma Kağıdını İndir' : 'Download Worksheet';
                pdfLink.target = '_blank';
                pdfLink.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>';
                jobHeaderDiv.appendChild(pdfLink);
            }

            // Subheader Group (.job-subheader)
            const jobSubheaderDiv = document.createElement('div');
            jobSubheaderDiv.className = 'job-subheader';

            const topicSpan = document.createElement('span');
            topicSpan.className = 'company';
            topicSpan.textContent = slide.topic[state.lang]; // Removed "topic:" label
            
            const targetAudienceLink = document.createElement('span');
            targetAudienceLink.className = 'location';
            
            // actionAnchor removed as requested; thumbnail is now the primary trigger.
            jobSubheaderDiv.appendChild(topicSpan);
            jobSubheaderDiv.appendChild(targetAudienceLink);

            // Job Content (.job-content)
            const jobContentDiv = document.createElement('div');
            jobContentDiv.className = 'job-content';

            // Lazy Load Container for Figma Thumbnail -> Mooved to jobFigmaLeftDiv
            const figmaDiv = document.createElement('div');
            figmaDiv.className = 'figma-container';
            figmaDiv.style.cursor = 'pointer';
            
            const thumbnailImg = document.createElement('img');
            thumbnailImg.className = 'figma-thumbnail';
            thumbnailImg.style.position = 'absolute';
            thumbnailImg.style.top = '0';
            thumbnailImg.style.left = '0';
            thumbnailImg.style.width = '100%';
            thumbnailImg.style.height = '100%';
            thumbnailImg.style.objectFit = 'cover';
            thumbnailImg.style.opacity = '0';
            thumbnailImg.style.transition = 'opacity 0.5s ease';
            thumbnailImg.style.zIndex = '1';

            // Scrape thumbnail via oEmbed API
            fetch(`https://www.figma.com/api/oembed?url=${encodeURIComponent(slide.figmaUrl)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.thumbnail_url) {
                        thumbnailImg.src = data.thumbnail_url;
                        thumbnailImg.onload = () => {
                            thumbnailImg.style.opacity = '1';
                        };
                    }
                })
                .catch(err => console.error('Failed to load Figma thumbnail:', err));
            
            // Allow clicking thumbnail to open
            figmaDiv.addEventListener('click', () => {
                openModalForFigma(slide);
            });
            
            // Add Play Icon Overlay
            const playIconOverlay = document.createElement('div');
            playIconOverlay.className = 'play-icon-overlay';
            playIconOverlay.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="var(--slate-900)" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
            
            figmaDiv.appendChild(thumbnailImg);
            figmaDiv.appendChild(playIconOverlay);
            jobFigmaLeftDiv.appendChild(figmaDiv);
            
            // Toggle Button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'desc-toggle';
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-label', 'Show Details');
            toggleBtn.innerHTML = '<svg class="chevron-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
            
            toggleBtn.addEventListener('click', (e) => {
                const contentDiv = e.currentTarget.parentElement;
                const descriptionDiv = contentDiv.querySelector('.job-description');
                if (descriptionDiv) {
                    const isExpanded = descriptionDiv.classList.toggle('expanded');
                    e.currentTarget.setAttribute('aria-expanded', isExpanded);
                }
            });
            
            jobContentDiv.appendChild(toggleBtn);

            // Description Wrapper
            const jobDescDiv = document.createElement('div');
            jobDescDiv.className = 'job-description'; 
            
            const descInnerDiv = document.createElement('div');
            descInnerDiv.className = 'desc-inner';
            
            const p = document.createElement('p');
            p.textContent = slide.description[state.lang];
            
            descInnerDiv.appendChild(p);
            jobDescDiv.appendChild(descInnerDiv);
            jobContentDiv.appendChild(jobDescDiv);

            // Tags
            const tagsWrapperDiv = document.createElement('div');
            tagsWrapperDiv.className = 'tags-wrapper branding-tags';
            slide.tags.forEach(t => {
                const button = document.createElement('button');
                button.className = 'skill-tag animate';
                button.textContent = t;
                button.style.animationDelay = `${(Math.random() * 0.1) + 0.1}s`;
                tagsWrapperDiv.appendChild(button);
            });
            jobContentDiv.appendChild(tagsWrapperDiv);

            // Assemble Job Block
            jobDetailsRightDiv.appendChild(jobHeaderDiv);
            jobDetailsRightDiv.appendChild(jobSubheaderDiv);
            jobDetailsRightDiv.appendChild(jobContentDiv);
            
            jobLayoutDiv.appendChild(jobFigmaLeftDiv);
            jobLayoutDiv.appendChild(jobDetailsRightDiv);
            
            jobBlock.appendChild(jobLayoutDiv);
            
            grid.appendChild(jobBlock);
        });
        
        // Remove 'js-loading' state
        setTimeout(() => {
            document.documentElement.classList.remove('js-loading');
        }, 100);
    }
    
    function openModalForFigma(slide) {
        const modal = document.getElementById('figma-modal');
        const container = document.getElementById('modal-iframe-container');
        
        const protoUrl = slide.figmaUrl.replace(/\/(design|file)\//, '/proto/');
        const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(protoUrl)}`;
        container.innerHTML = `<iframe src="${embedUrl}" allowfullscreen allow="fullscreen"></iframe>`;
        modal.classList.remove('hidden');
        // Force a browser reflow so the transition works
        void modal.offsetWidth;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling the site behind the modal
    }

    document.getElementById('close-modal').addEventListener('click', () => {
        const modal = document.getElementById('figma-modal');
        const container = document.getElementById('modal-iframe-container');
        
        modal.classList.remove('active');
        
        // Wait for the CSS transition to finish before hiding display:none and clearing iframe
        setTimeout(() => {
            modal.classList.add('hidden');
            container.innerHTML = ''; // Clear iframe to stop playback/save memory
            document.body.style.overflow = ''; // Restore scrolling
        }, 400); // 400ms matches the CSS transition duration
    });

    // Event Listeners
    btnTr.addEventListener('click', () => {
        state.lang = 'tr';
        localStorage.setItem('preferredLang', 'tr');
        updateUI();
    });

    btnEn.addEventListener('click', () => {
        state.lang = 'en';
        localStorage.setItem('preferredLang', 'en');
        updateUI();
    });

    btnTheme.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme-preference', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme-preference', 'dark');
        }
    });

    // Search and Filter Listeners
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        renderGrid();
    });

    tagFilter.addEventListener('change', (e) => {
        currentTagFilter = e.target.value;
        renderGrid();
    });

    // Modals Logic - Open
    const contactModal = document.getElementById('contact-modal');
    const shareModal = document.getElementById('share-modal');

    document.getElementById('btn-contact').addEventListener('click', () => {
        contactModal.classList.remove('hidden');
        void contactModal.offsetWidth; // Reflow
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    document.getElementById('btn-share').addEventListener('click', () => {
        // Set the current URL in the input before showing
        const currentUrl = window.location.href;
        document.getElementById('share-url-text').textContent = currentUrl;
        
        // Dynamically update social share links
        const encodedUrl = encodeURIComponent(currentUrl);
        const encodedTitle = encodeURIComponent(document.title);
        
        document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        document.getElementById('share-whatsapp').href = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
        
        shareModal.classList.remove('hidden');
        void shareModal.offsetWidth; // Reflow
        shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Modals Logic - Close
    function closeContentModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 400); // match transition
    }

    document.getElementById('close-contact').addEventListener('click', () => closeContentModal(contactModal));
    document.getElementById('close-share').addEventListener('click', () => closeContentModal(shareModal));

    // Close on backdrop click (for all modals including Figma)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal.id === 'figma-modal') {
                    document.getElementById('close-modal').click();
                } else {
                    closeContentModal(modal);
                }
            }
        });
    });

    // Share Button Logic (Inside Modal)
    document.getElementById('copy-link-btn').addEventListener('click', (e) => {
        const btn = e.target;
        navigator.clipboard.writeText(window.location.href).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            btn.textContent = 'Failed';
        });
    });

    // Initialize
    updateUI();
});
