document.addEventListener('DOMContentLoaded', () => {
    // Check for ?fw= direct linking to Figma
    const urlParams = new URLSearchParams(window.location.search);
    const fwId = urlParams.get('fw');
    if (fwId) {
        const targetSlide = archiveData.slides.find(s => s.id === fwId);
        if (targetSlide) {
            window.location.href = targetSlide.figmaUrl;
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
    const uiSubtitle = document.getElementById('ui-subtitle');
    const uiBack = document.getElementById('ui-back');

    function updateUI() {
        // Update Header
        uiTitle.textContent = archiveData.meta.title[state.lang];
        uiSubtitle.textContent = archiveData.meta.subtitle[state.lang];
        uiBack.textContent = archiveData.meta.backBtn[state.lang];
        
        // Update Language Buttons
        btnTr.classList.toggle('active', state.lang === 'tr');
        btnEn.classList.toggle('active', state.lang === 'en');
        document.documentElement.lang = state.lang;
        
        renderGrid();
    }

    function renderGrid() {
        grid.innerHTML = '';

        archiveData.slides.forEach(slide => {
            const card = document.createElement('div');
            card.className = 'slide-card';
            
            // Lazy Load Container
            const figmaDiv = document.createElement('div');
            figmaDiv.className = 'figma-container';
            
            const loadBtn = document.createElement('button');
            loadBtn.className = 'load-btn';
            loadBtn.textContent = archiveData.ui.loadBtn[state.lang];
            
            // When clicked, open the modal and inject the iframe
            loadBtn.addEventListener('click', () => {
                const modal = document.getElementById('figma-modal');
                const container = document.getElementById('modal-iframe-container');
                
                const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(slide.figmaUrl)}`;
                container.innerHTML = `<iframe src="${embedUrl}" allowfullscreen allow="fullscreen"></iframe>`;
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent scrolling the site behind the modal
            });
            
            figmaDiv.appendChild(loadBtn);

            // Text Content
            const title = document.createElement('h3');
            title.className = 'card-title';
            title.textContent = slide.title[state.lang];

            const topic = document.createElement('div');
            topic.className = 'card-topic';
            topic.textContent = `${archiveData.ui.topicLabel[state.lang]} ${slide.topic[state.lang]}`;

            const desc = document.createElement('p');
            desc.className = 'card-desc';
            desc.textContent = slide.description[state.lang];

            // Tags
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'tags';
            slide.tags.forEach(t => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = t;
                tagsDiv.appendChild(span);
            });

            // Assemble
            card.appendChild(figmaDiv);
            card.appendChild(title);
            card.appendChild(topic);
            card.appendChild(desc);
            card.appendChild(tagsDiv);
            
            grid.appendChild(card);
        });
    }

document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('figma-modal');
    const container = document.getElementById('modal-iframe-container');
    
    modal.classList.add('hidden');
    container.innerHTML = ''; // Clear iframe to stop playback/save memory
    document.body.style.overflow = ''; // Restore scrolling
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
