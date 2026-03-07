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

    function updateUI() {
        // Update Header
        uiTitle.textContent = archiveData.meta.title[state.lang];
        
        // Update Language Buttons
        btnTr.classList.toggle('active', state.lang === 'tr');
        btnEn.classList.toggle('active', state.lang === 'en');
        document.documentElement.lang = state.lang;
        
        renderGrid();
    }

    function renderGrid() {
        grid.innerHTML = '';

        archiveData.slides.forEach((slide) => {
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

            // Description
            const jobDescDiv = document.createElement('div');
            jobDescDiv.className = 'job-description'; // Removed "expanded" to default to collapsed
            
            const descInnerDiv = document.createElement('div');
            descInnerDiv.className = 'desc-inner';
            
            const p = document.createElement('p');
            p.textContent = slide.description[state.lang];
            
            descInnerDiv.appendChild(p);
            jobDescDiv.appendChild(descInnerDiv);
            jobContentDiv.appendChild(jobDescDiv);

            // Tags (.tags-wrapper branding-tags .skill-tag)
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

    // Initialize
    updateUI();
});
