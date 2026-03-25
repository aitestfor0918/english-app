// Vocabulary Bank Module
window.VocabBank = {
    words: [],
    
    init() {
        this.loadWords();
        
        // Listen for settings modal API key update
        window.AppEventBus.on('api-key-updated', () => {
            // Re-render if needed
        });
    },
    
    loadWords() {
        try {
            const data = localStorage.getItem('vocab_bank');
            this.words = data ? JSON.parse(data) : [];
        } catch(e) {
            console.error("Failed to load vocab bank", e);
            this.words = [];
        }
    },
    
    saveWords() {
        localStorage.setItem('vocab_bank', JSON.stringify(this.words));
    },
    
    saveWord(word, translation) {
        if (!word) return;
        const cleanWord = word.trim().toLowerCase();
        const exists = this.words.find(w => w.word.toLowerCase() === cleanWord);
        if (!exists) {
            this.words.unshift({
                word: cleanWord,
                basic_translation: translation,
                richData: null,
                dateAdded: new Date().toISOString()
            });
            this.saveWords();
            
            // Re-render if we are in vocab view
            const view = document.getElementById('vocab-view');
            if (view && view.classList.add) { // Ensure it's rendered if we are viewing it
                this.renderList();
            }
        }
    },
    
    renderList() {
        const container = document.getElementById('vocab-list-container');
        if (!container) return;
        
        if (this.words.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; margin-top: 40px; color: var(--text-secondary);">
                    <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>您的單字庫目前是空的。<br>在聊天室中游標停靠單字並點擊 ⭐ 即可收藏！</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        this.words.forEach((wordObj, index) => {
            const card = document.createElement('div');
            card.className = 'vocab-card';
            
            // Provide a fallback basic translation
            const transText = wordObj.basic_translation && wordObj.basic_translation !== '翻譯失敗' && !wordObj.basic_translation.includes('spinner')
                ? wordObj.basic_translation : '';
            
            card.innerHTML = `
                <div class="vocab-header">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="vocab-word">${wordObj.word}</span>
                        <span class="vocab-translation">${transText}</span>
                        <button class="vocab-btn play-main-btn" title="聽發音"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-down vocab-expand-icon"></i>
                    </div>
                </div>
                <div class="vocab-details" id="vocab-details-${index}">
                    ${wordObj.richData ? this.buildRichDataHTML(wordObj.richData, index) : '<div style="text-align:center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> 正在產生詳細資料...</div>'}
                </div>
            `;
            
            // Setup expand toggle
            const header = card.querySelector('.vocab-header');
            header.addEventListener('click', (e) => {
                // Prevent toggle if clicking the play button
                if (e.target.closest('.play-main-btn')) return;
                
                const isExpanded = card.classList.contains('expanded');
                // Close all others
                document.querySelectorAll('.vocab-card').forEach(c => c.classList.remove('expanded'));
                
                if (!isExpanded) {
                    card.classList.add('expanded');
                    if (!wordObj.richData) {
                        this.fetchRichData(wordObj, index, card);
                    }
                }
            });
            
            // Setup main play button
            const playMain = card.querySelector('.play-main-btn');
            playMain.addEventListener('click', (e) => {
                e.stopPropagation();
                this.speak(wordObj.word);
            });
            
            container.appendChild(card);
            
            // If already has rich data, setup its play buttons
            if (wordObj.richData) {
                this.setupRichDataPlayButtons(card);
            }
        });
    },
    
    buildRichDataHTML(richData, index) {
        let formsHTML = '';
        if (richData.forms && richData.forms.length > 0) {
            formsHTML = `
                <div style="margin-bottom: 20px;">
                    <div class="vocab-section-title">詞性與變化型態</div>
                    <div>
                        ${richData.forms.map(f => `<span class="vocab-form-tag play-form-btn" data-text="${encodeURIComponent(f)}" style="cursor: pointer;" title="點擊聆聽發音">${f} <i class="fa-solid fa-volume-high" style="font-size: 0.85em; margin-left: 4px; color: var(--primary);"></i></span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        let examplesHTML = '';
        if (richData.examples && richData.examples.length > 0) {
            examplesHTML = `
                <div>
                    <div class="vocab-section-title">實用造句 (單字可點選)</div>
                    ${richData.examples.map(ex => `
                        <div class="vocab-example">
                            <div class="vocab-row">
                                <div class="vocab-example-en">${typeof wrapWordsWithHover === 'function' ? wrapWordsWithHover(ex.en) : ex.en}</div>
                                <button class="vocab-btn play-ex-btn" data-text="${encodeURIComponent(ex.en)}" style="width: 32px; height: 32px; font-size: 0.85rem;" title="朗讀整句"><i class="fa-solid fa-volume-high"></i></button>
                            </div>
                            <div class="vocab-example-zh">${ex.zh}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        return formsHTML + examplesHTML;
    },
    
    setupRichDataPlayButtons(card) {
        const exBtns = card.querySelectorAll('.play-ex-btn');
        exBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = decodeURIComponent(btn.getAttribute('data-text'));
                this.speak(text);
            });
        });

        const formBtns = card.querySelectorAll('.play-form-btn');
        formBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const rawText = decodeURIComponent(btn.getAttribute('data-text'));
                // Extract only english letters so TTS avoids reading Chinese parts strangely
                const engText = rawText.replace(/[^A-Za-z\s'\-]/g, ' ').replace(/\s+/g, ' ').trim();
                if (engText.length > 0) {
                    this.speak(engText);
                } else {
                    this.speak(rawText);
                }
            });
        });
    },
    
    async fetchRichData(wordObj, index, card) {
        let apiKey = localStorage.getItem('gemini_api_key');
        const detailsContainer = document.getElementById(`vocab-details-${index}`);
        
        if (!apiKey) {
            detailsContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--error);">請先於右上角設定 API Key 才能產生完整單字卡。</div>';
            return;
        }
        
        try {
            const prompt = `請以 JSON 格式提供英文單字 "${wordObj.word}" 的詳細學習資訊。
格式規範必須嚴格遵循以下結構，不要加上任何 Markdown 註記或這句話以外的說明文字：
{
  "forms": [
    "詞性. - 中文翻譯 (例如: n. - 蘋果)", 
    "其他型態變化 (例如: 過去式 - went)"
  ],
  "examples": [
    { "en": "第1個英文造句 (大約10-15個字)", "zh": "造句的繁體中文翻譯" },
    { "en": "第2個英文造句 (大約10-15個字)", "zh": "造句的繁體中文翻譯" }
  ]
}`;
            
            // Always try 2.5-flash since this was verified earlier
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.2,
                        responseMimeType: "application/json"
                    }
                })
            });
            
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            
            const candidate = data.candidates && data.candidates[0];
            const aiText = candidate.content.parts[0].text;
            
            // Clean markdown metadata
            const cleanedText = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const richData = JSON.parse(cleanedText);
            
            // Update storage
            wordObj.richData = richData;
            this.saveWords();
            
            // Render
            detailsContainer.innerHTML = this.buildRichDataHTML(richData, index);
            this.setupRichDataPlayButtons(card);
            
        } catch (error) {
            console.error("AI Vocab Generation Error:", error);
            detailsContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--error);">產生失敗：${error.message}<br>請稍後重試或重新點開。</div>`;
        }
    },
    
    speak(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = parseFloat(localStorage.getItem('speech_speed') || '0.85');
        window.speechSynthesis.speak(utterance);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.VocabBank.init();
});
