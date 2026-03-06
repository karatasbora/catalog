document.addEventListener('DOMContentLoaded', () => {
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
            
            loadBtn.addEventListener('click', () => {
                figmaDiv.innerHTML = `<iframe src="${slide.figmaUrl}" allowfullscreen allow="fullscreen"></iframe>`;
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
