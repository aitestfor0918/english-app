// Scenarios Management

// (WORD_OF_THE_DAY_DB is now moved to js/words_db.js)

const SCENARIO_DB = [
    // 食 (Food)
    { id: 'f1', category: '食 (Food)', title: '餐廳點餐', desc: '在高級餐廳向服務生點一份牛排套餐，並詢問推薦的葡萄酒。', icon: 'fa-utensils', color: '#f59e0b' },
    { id: 'f2', category: '食 (Food)', title: '咖啡廳買咖啡', desc: '在星巴克點一杯客製化的咖啡（例如去冰、半糖、換燕麥奶）。', icon: 'fa-mug-hot', color: '#f59e0b' },
    { id: 'f3', category: '食 (Food)', title: '超市結帳', desc: '在超市收銀台結帳，詢問是否收信用卡以及需不需要買購物袋。', icon: 'fa-basket-shopping', color: '#f59e0b' },
    
    // 衣 (Clothing)
    { id: 'c1', category: '衣 (Clothing)', title: '服飾店試穿', desc: '你在服飾店看到一件喜歡的衣服，詢問店員有沒有別的尺寸或顏色可以試穿。', icon: 'fa-shirt', color: '#ec4899' },
    { id: 'c2', category: '衣 (Clothing)', title: '退換貨', desc: '衣服買回去發現太大件，回到店裡跟店員說明理由並要求換貨。', icon: 'fa-tags', color: '#ec4899' },
    
    // 住 (Housing)
    { id: 'h1', category: '住 (Housing)', title: '飯店 Check-in', desc: '抵達飯店櫃檯辦理入住手續，並詢問早餐的時間與地點。', icon: 'fa-hotel', color: '#8b5cf6' },
    { id: 'h2', category: '住 (Housing)', title: '客房服務', desc: '打電話給櫃檯，表示房間裡的冷氣壞了，請人來修理。', icon: 'fa-bed', color: '#8b5cf6' },
    { id: 'h3', category: '住 (Housing)', title: '飯店房型升等', desc: '因為新婚或慶生，詢問飯店人員是否可以優惠升等到景觀套房。', icon: 'fa-building-columns', color: '#8b5cf6' },
    
    // 行 (Transportation)
    { id: 't1', category: '行 (Transportation)', title: '機場問路', desc: '在機場詢問地勤人員你的航班登機門在哪裡，以及何時開始登機。', icon: 'fa-plane', color: '#3b82f6' },
    { id: 't2', category: '行 (Transportation)', title: '搭乘計程車', desc: '上計程車後告訴司機你的目的地，並請他稍微開快一點因為你趕時間。', icon: 'fa-taxi', color: '#3b82f6' },
    { id: 't3', category: '行 (Transportation)', title: '地鐵換乘', desc: '在地鐵站迷路了，向站務人員詢問如何轉乘到著名的觀光景點。', icon: 'fa-train-subway', color: '#3b82f6' },
    
    // 育 (Education/Work) - Split into Office
    { id: 'w1', category: '職 (Work)', title: '求職面試', desc: '面試官請你用英文做簡短的自我介紹，並詢問你為何想加入這間公司。', icon: 'fa-briefcase', color: '#06b6d4' },
    { id: 'w2', category: '職 (Work)', title: '團隊會議', desc: '在會議中向主管解釋專案進度落後的原因，並提出解決方案。', icon: 'fa-laptop-code', color: '#06b6d4' },
    { id: 'w3', category: '職 (Work)', title: '出差計畫', desc: '與同事討論下週出差的行程規劃，包含會議時間與交通安排。', icon: 'fa-plane-departure', color: '#06b6d4' },
    
    // 醫 (Medical) - New
    { id: 'm1', category: '醫 (Medical)', title: '看醫生', desc: '在診所向醫生描述你的症狀（發燒、咳嗽、喉嚨痛），並詢問醫囑。', icon: 'fa-user-doctor', color: '#10b981' },
    { id: 'm2', category: '醫 (Medical)', title: '藥局拿藥', desc: '在藥局詢問藥師這些藥物應該如何服用，以及是否有副作用。', icon: 'fa-pills', color: '#10b981' },
    
    // 社交 (Social) - New
    { id: 's1', category: '社 (Social)', title: '家庭聚會', desc: '在朋友家的聚會中，主動向第一次見面的人打招呼並交流職業。', icon: 'fa-glass-cheers', color: '#6366f1' },
    { id: 's2', category: '社 (Social)', title: '鄰居交流', desc: '向隔壁鄰居委婉地反應昨晚深夜的音樂聲音太大，請他幫忙。', icon: 'fa-house-user', color: '#6366f1' },
    
    // 急 (Emergency) - New
    { id: 'em1', category: '急 (Emergency)', title: '錢包遺失', desc: '在警察局申報你的錢包被偷或掉了，並描述錢包的內容物。', icon: 'fa-wallet', color: '#f43f5e' },
    { id: 'em2', category: '急 (Emergency)', title: '車輛故障', desc: '汽車在路邊拋錨了，打電話給拖吊車公司說明你的位置與車況。', icon: 'fa-car-burst', color: '#f43f5e' },

    // 育 (Education)
    { id: 'e1', category: '育 (Education)', title: '課堂提問', desc: '在課堂上舉手，向外籍老師請教他剛才解釋的單字是什麼意思。', icon: 'fa-graduation-cap', color: '#10b981' },
    { id: 'e2', category: '育 (Education)', title: '認識新同學', desc: '在語言學校的第一天，主動向旁邊的同學自我介紹並聊天。', icon: 'fa-users', color: '#10b981' },
    
    // 樂 (Entertainment)
    { id: 'en1', category: '樂 (Entertainment)', title: '電影院買票', desc: '在電影院櫃檯買兩張晚上八點的電影票，並選中間的座位。', icon: 'fa-film', color: '#ef4444' },
    { id: 'en2', category: '樂 (Entertainment)', title: '討論週末計畫', desc: '跟朋友用英文討論這個週末要去看展覽還是去海邊玩。', icon: 'fa-face-laugh-squint', color: '#ef4444' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderWordOfTheDay();
    renderPracticalPhrases();
    renderDailyScenarios();
    initScenarioRefresh();
    
    // Listen for level changes
    window.AppEventBus.on('user-level-updated', () => {
        renderWordOfTheDay();
        renderPracticalPhrases();
    });

    initExampleSpeechRecognition();
});

let exampleRecognition = null;
let isExampleRecording = false;
let recordingExampleIndex = -1;
let exampleAccumulatedTranscript = "";
let exampleCurrentInterim = "";

// Completion Tracking for Word of the Day
let completedWords = [];
let completedPhrases = [];
try {
    const storedWords = localStorage.getItem('speakAi_completedWords');
    completedWords = storedWords ? JSON.parse(storedWords) : [];
    
    const storedPhrases = localStorage.getItem('speakAi_completedPhrases');
    completedPhrases = storedPhrases ? JSON.parse(storedPhrases) : [];
} catch(e) {}

function initExampleSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    exampleRecognition = new SpeechRecognition();
    exampleRecognition.lang = 'en-US';
    exampleRecognition.continuous = true;
    exampleRecognition.interimResults = true;
    exampleRecognition.maxAlternatives = 1;
    
    exampleRecognition.onstart = () => {
        isExampleRecording = true;
        exampleAccumulatedTranscript = "";
        exampleCurrentInterim = "";
        
        const btn = document.querySelector(`.mic-example-btn[data-index="${recordingExampleIndex}"]`);
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-stop-circle fa-beat"></i>';
            btn.classList.add('recording');
            btn.style.color = 'var(--error)';
        }
    };
    
    exampleRecognition.onresult = (event) => {
        let interimText = '';
        let finalChunk = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalChunk += event.results[i][0].transcript;
            } else {
                interimText += event.results[i][0].transcript;
            }
        }
        if (finalChunk) {
            exampleAccumulatedTranscript += finalChunk + " ";
        }
        exampleCurrentInterim = interimText;
    };
    
    exampleRecognition.onerror = (event) => {
        console.error("Example recognition error", event.error);
        if (event.error !== 'aborted') {
            stopExampleRecording();
        }
    };
    
    exampleRecognition.onend = () => {
        if (isExampleRecording) {
            const finalTranscript = (exampleAccumulatedTranscript + " " + exampleCurrentInterim).trim();
            const index = recordingExampleIndex;
            stopExampleRecording();
            if (finalTranscript.length > 0) {
                analyzeExamplePronunciation(finalTranscript, index);
            }
        }
    };
}

function toggleExampleRecording(index) {
    if (!exampleRecognition) {
        alert("您的瀏覽器不支援語音識別。");
        return;
    }
    
    if (isExampleRecording) {
        if (recordingExampleIndex === index) {
            exampleRecognition.stop();
            // onend will handle the analysis
        } else {
            // Already recording another one? Ignore or switch.
            exampleRecognition.stop();
        }
    } else {
        recordingExampleIndex = index;
        // Hide previous feedback for this sentence
        const feedbackEl = document.getElementById(`example-feedback-${index}`);
        if (feedbackEl) feedbackEl.classList.add('hidden');
        
        try {
            exampleRecognition.start();
        } catch(e) {
            console.error(e);
        }
    }
}

function stopExampleRecording() {
    isExampleRecording = false;
    const btns = document.querySelectorAll('.mic-example-btn');
    btns.forEach(btn => {
        btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        btn.classList.remove('recording');
        btn.style.color = 'var(--primary)';
    });
}

function analyzeExamplePronunciation(transcript, index) {
    const wordObj = getWordOfTheDay();
    if (!wordObj || !wordObj.examples[index]) return;
    
    const original = wordObj.examples[index];
    // Added null checks to avoid "Cannot read properties of null (reading 'toLowerCase')"
    const cleanOriginal = (original || "").toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const cleanSpoken = (transcript || "").toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    
    const originalWords = cleanOriginal.split(/\s+/);
    const spokenWords = cleanSpoken.split(/\s+/);
    
    let matchCount = 0;
    const feedbackWords = [];
    const displayWords = (original || "").split(/\s+/);
    
    displayWords.forEach(displayWord => {
        const cleanWord = displayWord.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        if (spokenWords.includes(cleanWord)) {
            matchCount++;
            feedbackWords.push(`<span style="color: #10b981; font-weight: 500;">${displayWord}</span>`);
        } else {
            feedbackWords.push(`<span style="color: #f43f5e; font-weight: 500; text-decoration: underline wavy #f43f5e;">${displayWord}</span>`);
        }
    });
    
    const score = Math.round((matchCount / originalWords.length) * 100);
    const feedbackEl = document.getElementById(`example-feedback-${index}`);
    
    if (feedbackEl) {
        feedbackEl.innerHTML = `
            <div style="margin-top: 10px; padding: 12px; background: rgba(0,0,0,0.03); border-radius: 8px; font-size: 0.95rem;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;">${score}%</div>
                    <strong style="color: var(--text-primary);">準確度分值</strong>
                </div>
                <div style="line-height: 1.6; margin-bottom: 8px;">${feedbackWords.join(' ')}</div>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; font-style: italic;">您的錄音: "${transcript}"</p>
            </div>
        `;
        feedbackEl.classList.remove('hidden');
    }
}

function getDailyScenarios(forceRefresh = false) {
    // 6:00 AM Taiwan time (UTC+8) logic
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const twTime = new Date(utc + (3600000 * 8));
    const logicalDate = new Date(twTime.getTime() - (6 * 3600000)).toLocaleDateString();
    
    const stored = localStorage.getItem('speakAi_dailyScenarios');
    
    if (stored && !forceRefresh) {
        const parsed = JSON.parse(stored);
        if (parsed.logicalDate === logicalDate) {
            return parsed.scenarios;
        }
    }
    
    // Improved Selection Logic: Shuffle and ensure variety
    // Helper to shuffle array
    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    const shuffled = shuffle([...SCENARIO_DB]);
    
    // Attempt to avoid scenarios from the previous set
    let prevIds = [];
    if (stored) {
        try { prevIds = JSON.parse(stored).scenarios.map(s => s.id); } catch(e) {}
    }
    
    const selected = [];
    // Pick ones NOT in the previous set first
    for (const s of shuffled) {
        if (!prevIds.includes(s.id)) {
            selected.push(s);
        }
        if (selected.length === 4) break;
    }
    
    // If still need more (e.g. if DB is small), backfill with others
    if (selected.length < 4) {
        for (const s of shuffled) {
            if (!selected.find(x => x.id === s.id)) {
                selected.push(s);
            }
            if (selected.length === 4) break;
        }
    }
    
    localStorage.setItem('speakAi_dailyScenarios', JSON.stringify({
        logicalDate: logicalDate,
        scenarios: selected
    }));
    
    return selected;
}

function initScenarioRefresh() {
    const refreshBtn = document.getElementById('refresh-scenarios-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Add spinning animation
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('fa-spin');
            
            setTimeout(() => {
                renderDailyScenarios(true);
                icon.classList.remove('fa-spin');
            }, 500);
        });
    }
}

function renderDailyScenarios(forceRefresh = false) {
    const container = document.getElementById('scenarios-container');
    if (!container) return;
    
    const scenarios = getDailyScenarios(forceRefresh).slice(0, 4);
    container.innerHTML = '';
    
    // Add Free Chat as the first card (Fixed)
    const freeChatCard = document.createElement('div');
    freeChatCard.className = 'scenario-card';
    freeChatCard.style.animation = `fadeIn 0.5s ease 0s backwards`;
    freeChatCard.innerHTML = `
        <div class="scenario-icon" style="color: var(--secondary); background: rgba(168, 85, 247, 0.1);">
            <i class="fa-solid fa-robot"></i>
        </div>
        <div class="scenario-info">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="background: var(--secondary); color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold;">推薦</span>
                <h3>自由對話</h3>
            </div>
            <p>這是一個自由聊天的空間，沒有任何主題限制，隨便聊聊！</p>
        </div>
        <div class="scenario-action">
            <i class="fa-solid fa-chevron-right"></i>
        </div>
    `;
    freeChatCard.addEventListener('click', () => {
        window.AppEventBus.emit('start-scenario', {
            id: 'free',
            title: '自由對話',
            desc: '這是一個自由聊天的空間，沒有任何話題限制！'
        });
    });
    container.appendChild(freeChatCard);

    // Add the 4 randomized scenarios
    scenarios.forEach((scenario, index) => {
        const delay = (index + 1) * 0.1; // Staggered animation effect
        const card = document.createElement('div');
        card.className = 'scenario-card';
        card.style.animation = `fadeIn 0.5s ease ${delay}s backwards`;
        card.setAttribute('data-id', scenario.id);
        
        card.innerHTML = `
            <div class="scenario-icon" style="color: ${scenario.color}; background: ${scenario.color}15;">
                <i class="fa-solid ${scenario.icon}"></i>
            </div>
            <div class="scenario-info">
                <h3>${scenario.title}</h3>
                <p>${scenario.desc}</p>
            </div>
            <div class="scenario-action">
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        `;
        
        card.addEventListener('click', () => {
            // Start the chat with this scenario
            window.AppEventBus.emit('start-scenario', scenario);
        });
        
        container.appendChild(card);
    });
}

function getWordOfTheDay(forceRefresh = false) {
    const level = localStorage.getItem('user_level') || 'intermediate';
    const filteredDB = WORD_OF_THE_DAY_DB.filter(w => w.level === level);
    const db = filteredDB.length > 0 ? filteredDB : WORD_OF_THE_DAY_DB;
    
    // 6:00 AM Taiwan time logic
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const twTime = new Date(utc + (3600000 * 8));
    const logicalDate = new Date(twTime.getTime() - (6 * 3600000)).toLocaleDateString();
    
    const stored = localStorage.getItem('speakAi_dailyWord');
    if (stored && !forceRefresh) {
        const parsed = JSON.parse(stored);
        if (parsed.logicalDate === logicalDate) {
            // Find the word in the current DB to ensure it exists
            const found = db.find(w => w.word === parsed.word.word);
            if (found) return found;
        }
    }
    
    // Improved Selection Logic: Pick a word that hasn't been seen recently
    // AND is not already in the user's vocabulary bank
    let seenHistory = [];
    let savedWords = [];
    try {
        const historyRaw = localStorage.getItem('speakAi_wordHistory');
        seenHistory = historyRaw ? JSON.parse(historyRaw) : [];
        
        const vocabRaw = localStorage.getItem('vocab_bank');
        const vocabBank = vocabRaw ? JSON.parse(vocabRaw) : [];
        savedWords = vocabBank.map(w => w.word.toLowerCase());
    } catch (e) {}

    // 1. Filter out words already in the vocabulary bank
    let pool = db.filter(w => !savedWords.includes(w.word.toLowerCase()));
    
    // 2. Further filter out words in recent history
    let freshPool = pool.filter(w => !seenHistory.includes(w.word) && !completedWords.includes(w.word));
    
    // 3. Fallback: If freshPool is empty, check if we have ANY non-completed words
    if (freshPool.length === 0) {
        freshPool = pool.filter(w => !completedWords.includes(w.word));
    }

    // If still empty (all non-saved words are completed), use the full non-saved pool
    if (freshPool.length === 0 && pool.length > 0) {
        freshPool = pool;
        seenHistory = []; 
    }
    
    // If EVERYTHING in this level is already saved or completed, fallback to the full level DB
    if (freshPool.length === 0) {
        freshPool = db;
    }

    // Pick a word semi-randomly but persistently for the day based on logicalDate
    let seed = 0;
    for (let i = 0; i < logicalDate.length; i++) {
        seed += logicalDate.charCodeAt(i);
    }
    
    // If forced refresh, add some randomness
    if (forceRefresh) {
        seed += Math.floor(Math.random() * 1000);
    }
    
    const index = Math.abs(seed) % freshPool.length;
    const selectedWord = freshPool[index];
    
    // Update history: Add to front, keep only last N (e.g. 70% of DB size)
    const historyLimit = Math.floor(db.length * 0.7);
    if (!seenHistory.includes(selectedWord.word)) {
        seenHistory.unshift(selectedWord.word);
    }
    if (seenHistory.length > historyLimit) {
        seenHistory = seenHistory.slice(0, historyLimit);
    }
    
    localStorage.setItem('speakAi_wordHistory', JSON.stringify(seenHistory));
    localStorage.setItem('speakAi_dailyWord', JSON.stringify({
        logicalDate: logicalDate,
        word: selectedWord
    }));
    
    return selectedWord;
}

function renderWordOfTheDay() {
    const container = document.getElementById('word-of-the-day-container');
    if (!container) return;
    
    const wordObj = getWordOfTheDay();
    const isAlreadySaved = window.VocabBank && window.VocabBank.words.some(w => w.word.toLowerCase() === wordObj.word.toLowerCase());
    const starClass = isAlreadySaved ? 'fa-solid' : 'fa-regular';
    
    // Limits examples to 2 as requested
    const examplesToShow = wordObj.examples.slice(0, 2);

    container.innerHTML = `
        <div class="word-card">
            <div class="word-card-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-calendar-day"></i>
                    <span>今日單字 (Word of the Day)</span>
                </div>
                <div style="margin-left: auto; display: flex; gap: 4px;">
                    <button id="mark-word-learned-btn" class="icon-btn" title="標記為已學會" style="width: 28px; height: 28px; color: var(--success);">
                        <i class="fa-regular fa-circle-check"></i>
                    </button>
                    <button id="refresh-word-btn" class="icon-btn" title="換一個單字" style="width: 28px; height: 28px; color: var(--text-secondary);">
                        <i class="fa-solid fa-rotate"></i>
                    </button>
                </div>
            </div>
            <div class="word-card-body">
                <h3 class="word-title">
                    ${wordObj.word} 
                    <span class="word-phonetic">${wordObj.phonetic}</span>
                    <button id="pronounce-word-btn" class="icon-btn" aria-label="發音" style="width: 32px; height: 32px; margin-left: auto; color: var(--primary); background: rgba(129, 140, 248, 0.1);">
                        <i class="fa-solid fa-volume-high" style="font-size: 0.9rem;"></i>
                    </button>
                    <button id="save-daily-word-btn" class="icon-btn" aria-label="收藏單字" title="加入單字庫" style="width: 32px; height: 32px; margin-left: 8px; color: var(--warning); background: rgba(245, 158, 11, 0.1);">
                        <i class="${starClass} fa-star" style="font-size: 0.9rem;"></i>
                    </button>
                </h3>
                <p class="word-translation">${wordObj.translation}</p>
                <div class="word-examples-container">
                    ${examplesToShow.map((ex, idx) => `
                        <div class="word-example-item" style="margin-bottom: 16px; border-bottom: 1px dashed rgba(0,0,0,0.05); padding-bottom: 12px;">
                            <div style="display: flex; align-items: flex-start; gap: 10px;">
                                <button class="icon-btn pronounce-example-btn" data-index="${idx}" title="監聽整句發音" style="flex-shrink: 0; width: 28px; height: 28px; margin-top: 2px; color: var(--primary); background: rgba(129, 140, 248, 0.1);">
                                    <i class="fa-solid fa-volume-high" style="font-size: 0.8rem;"></i>
                                </button>
                                <button class="icon-btn mic-example-btn" data-index="${idx}" title="開始朗讀練習" style="flex-shrink: 0; width: 28px; height: 28px; margin-top: 2px; color: var(--primary); background: rgba(129, 140, 248, 0.1);">
                                    <i class="fa-solid fa-microphone" style="font-size: 0.8rem;"></i>
                                </button>
                                <div class="example-text-content">
                                    <p style="margin: 0; line-height: 1.5; color: var(--text-primary);">"${wrapWordsWithHover(ex)}"</p>
                                </div>
                            </div>
                            <div id="example-feedback-${idx}" class="example-feedback-area hidden"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    const pronounceBtn = document.getElementById('pronounce-word-btn');
    if (pronounceBtn) {
        pronounceBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(wordObj.word);
                utterance.lang = 'en-US';
                utterance.rate = 0.85;
                window.speechSynthesis.speak(utterance);
            }
        });
    }
    
    // Attach listeners for microphone and pronunciation logic
    container.querySelectorAll('.pronounce-example-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-index'));
            const text = examplesToShow[idx];
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        });
    });

    container.querySelectorAll('.mic-example-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-index'));
            toggleExampleRecording(idx);
        });
    });

    const saveDailyBtn = document.getElementById('save-daily-word-btn');
    if (saveDailyBtn) {
        saveDailyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.VocabBank) {
                const icon = saveDailyBtn.querySelector('i');
                const isCurrentlySaved = icon.classList.contains('fa-solid');
                
                if (isCurrentlySaved) {
                    // Unsave
                    window.VocabBank.removeWord(wordObj.word);
                    icon.className = 'fa-regular fa-star';
                } else {
                    // Save
                    window.VocabBank.saveWord(wordObj.word, wordObj.translation);
                    icon.className = 'fa-solid fa-star';
                }
            }
        });
    }

    // Refresh Word of the Day logic
    const refreshWordBtn = document.getElementById('refresh-word-btn');
    if (refreshWordBtn) {
        refreshWordBtn.addEventListener('click', () => {
            const icon = refreshWordBtn.querySelector('i');
            icon.classList.add('fa-spin');
            
            setTimeout(() => {
                getWordOfTheDay(true); // Force pick a new one
                renderWordOfTheDay();
                icon.classList.remove('fa-spin');
            }, 500);
        });
    }

    // Mark as Learned logic
    const markLearnedBtn = document.getElementById('mark-word-learned-btn');
    if (markLearnedBtn) {
        markLearnedBtn.addEventListener('click', () => {
            if (!wordObj) return;
            
            // Add to completed
            if (!completedWords.includes(wordObj.word)) {
                completedWords.push(wordObj.word);
                localStorage.setItem('speakAi_completedWords', JSON.stringify(completedWords));
            }
            
            // Visual feedback
            const icon = markLearnedBtn.querySelector('i');
            icon.className = 'fa-solid fa-circle-check';
            
            // Auto-refresh to next word
            setTimeout(() => {
                getWordOfTheDay(true); 
                renderWordOfTheDay();
            }, 600);
        });
    }
}

// --- Practical Phrases & Sentence Patterns ---

function getPhrasesOfTheDay(forceRefresh = false) {
    const level = localStorage.getItem('user_level') || 'intermediate';
    const filteredDB = PHRASES_DB.filter(p => p.level === level);
    const db = filteredDB.length > 0 ? filteredDB : PHRASES_DB;
    
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const twTime = new Date(utc + (3600000 * 8));
    const logicalDate = new Date(twTime.getTime() - (6 * 3600000)).toLocaleDateString();
    
    const stored = localStorage.getItem('speakAi_dailyPhrase');
    if (stored && !forceRefresh) {
        const parsed = JSON.parse(stored);
        if (parsed.logicalDate === logicalDate) {
            const found = db.find(p => p.phrase === parsed.phrase.phrase);
            if (found) return found;
        }
    }
    
    let seenHistory = [];
    let savedPhrases = [];
    try {
        const historyRaw = localStorage.getItem('speakAi_phraseHistory');
        seenHistory = historyRaw ? JSON.parse(historyRaw) : [];
        
        const vocabRaw = localStorage.getItem('vocab_bank');
        const vocabBank = vocabRaw ? JSON.parse(vocabRaw) : [];
        savedPhrases = vocabBank.filter(i => i.type === 'phrase').map(p => p.word.toLowerCase());
    } catch (e) {}

    let pool = db.filter(p => !savedPhrases.includes(p.phrase.toLowerCase()));
    let freshPool = pool.filter(p => !seenHistory.includes(p.phrase) && !completedPhrases.includes(p.phrase));
    
    if (freshPool.length === 0) {
        freshPool = pool.filter(p => !completedPhrases.includes(p.phrase));
    }

    if (freshPool.length === 0 && pool.length > 0) {
        freshPool = pool;
        seenHistory = []; 
    }
    
    if (freshPool.length === 0) {
        freshPool = db;
    }

    let seed = 0;
    for (let i = 0; i < logicalDate.length; i++) {
        seed += logicalDate.charCodeAt(i);
    }
    
    if (forceRefresh) seed += Math.floor(Math.random() * 1000);
    
    const index = Math.abs(seed) % freshPool.length;
    const selectedPhrase = freshPool[index];
    
    const historyLimit = Math.floor(db.length * 0.7);
    if (!seenHistory.includes(selectedPhrase.phrase)) {
        seenHistory.unshift(selectedPhrase.phrase);
    }
    if (seenHistory.length > historyLimit) {
        seenHistory = seenHistory.slice(0, historyLimit);
    }
    
    localStorage.setItem('speakAi_phraseHistory', JSON.stringify(seenHistory));
    localStorage.setItem('speakAi_dailyPhrase', JSON.stringify({
        logicalDate: logicalDate,
        phrase: selectedPhrase
    }));
    
    return selectedPhrase;
}

function renderPracticalPhrases() {
    const container = document.getElementById('phrases-of-the-day-container');
    if (!container) return;
    
    const phraseObj = getPhrasesOfTheDay();
    const isAlreadySaved = window.VocabBank && window.VocabBank.words.some(w => w.word.toLowerCase() === phraseObj.phrase.toLowerCase());
    const starClass = isAlreadySaved ? 'fa-solid' : 'fa-regular';
    
    container.innerHTML = `
        <div class="word-card" style="margin-top: 20px; border-top: 4px solid var(--secondary);">
            <div class="word-card-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-comments"></i>
                    <span>今日片語 (Phrase of the Day)</span>
                </div>
                <div style="margin-left: auto; display: flex; gap: 4px;">
                    <button id="mark-phrase-learned-btn" class="icon-btn" title="標記為已學會" style="width: 28px; height: 28px; color: var(--success);">
                        <i class="fa-regular fa-circle-check"></i>
                    </button>
                    <button id="refresh-phrase-btn" class="icon-btn" title="換一個片語" style="width: 28px; height: 28px; color: var(--text-secondary);">
                        <i class="fa-solid fa-rotate"></i>
                    </button>
                </div>
            </div>
            <div class="word-card-body">
                <h3 class="word-title">
                    ${phraseObj.phrase}
                    <button id="pronounce-phrase-title-btn" class="icon-btn" aria-label="發音" style="width: 32px; height: 32px; margin-left: auto; color: var(--secondary); background: rgba(168, 85, 247, 0.1);">
                        <i class="fa-solid fa-volume-high" style="font-size: 0.9rem;"></i>
                    </button>
                    <button id="save-daily-phrase-btn" class="icon-btn" aria-label="收藏片語" title="加入單字庫" style="width: 32px; height: 32px; margin-left: 8px; color: var(--warning); background: rgba(245, 158, 11, 0.1);">
                        <i class="${starClass} fa-star" style="font-size: 0.9rem;"></i>
                    </button>
                </h3>
                <p class="word-translation">${phraseObj.translation}</p>
                <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 0.9rem; font-style: italic;">${phraseObj.meaning}</p>
                
                <div class="word-examples-container">
                    ${phraseObj.examples.map((ex, idx) => `
                        <div class="word-example-item" style="margin-bottom: 12px; border-bottom: 1px dashed rgba(0,0,0,0.05); padding-bottom: 8px;">
                            <div style="display: flex; align-items: flex-start; gap: 10px;">
                                <button class="icon-btn pronounce-phrase-ex-btn" data-text="${ex.replace(/"/g, '&quot;')}" title="朗讀整句" style="flex-shrink: 0; width: 28px; height: 28px; color: var(--secondary); background: rgba(168, 85, 247, 0.1);">
                                    <i class="fa-solid fa-volume-high" style="font-size: 0.8rem;"></i>
                                </button>
                                <div class="example-text-content">
                                    <p style="margin: 0; line-height: 1.5; color: var(--text-primary); font-size: 0.95rem;">"${ex}"</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Titile Pronounce
    const titlePronounceBtn = document.getElementById('pronounce-phrase-title-btn');
    if (titlePronounceBtn) {
        titlePronounceBtn.addEventListener('click', () => speakText(phraseObj.phrase));
    }
    
    // Example Pronounce
    container.querySelectorAll('.pronounce-phrase-ex-btn').forEach(btn => {
        btn.addEventListener('click', () => speakText(btn.getAttribute('data-text')));
    });
    
    // Save to Vocab Bank
    const saveBtn = document.getElementById('save-daily-phrase-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (window.VocabBank) {
                const icon = saveBtn.querySelector('i');
                const isSaved = icon.classList.contains('fa-solid');
                if (isSaved) {
                    window.VocabBank.removeWord(phraseObj.phrase);
                    icon.className = 'fa-regular fa-star';
                } else {
                    // Pass a type so we can distinguish phrases in logic if needed
                    window.VocabBank.saveWord(phraseObj.phrase, phraseObj.translation);
                    icon.className = 'fa-solid fa-star';
                }
            }
        });
    }
    
    // Mark as Learned
    const markBtn = document.getElementById('mark-phrase-learned-btn');
    if (markBtn) {
        markBtn.addEventListener('click', () => {
            if (!phraseObj) return;
            if (!completedPhrases.includes(phraseObj.phrase)) {
                completedPhrases.push(phraseObj.phrase);
                localStorage.setItem('speakAi_completedPhrases', JSON.stringify(completedPhrases));
            }
            const icon = markBtn.querySelector('i');
            icon.className = 'fa-solid fa-circle-check';
            setTimeout(() => {
                getPhrasesOfTheDay(true);
                renderPracticalPhrases();
            }, 600);
        });
    }

    // Refresh
    const refreshBtn = document.getElementById('refresh-phrase-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('fa-spin');
            setTimeout(() => {
                getPhrasesOfTheDay(true);
                renderPracticalPhrases();
                icon.classList.remove('fa-spin');
            }, 500);
        });
    }
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}
