// Scenarios Management

const WORD_OF_THE_DAY_DB = [
    { word: 'Fascinating', phonetic: '/ˈfæs.ən.eɪ.tɪŋ/', translation: '迷人的；極有吸引力的', example: 'The book I read last night was truly fascinating.' },
    { word: 'Accomplish', phonetic: '/əˈkɑːm.plɪʃ/', translation: '完成；實現', example: 'We can accomplish great things if we work together.' },
    { word: 'Versatile', phonetic: '/ˈvɝː.sə.t̬əl/', translation: '多才多藝的；多用途的', example: 'He is a versatile actor who can play a wide variety of roles.' },
    { word: 'Resilient', phonetic: '/rɪˈzɪl.jənt/', translation: '有韌性的；適應力強的', example: 'Children are often very resilient and recover quickly from difficult times.' },
    { word: 'Empathy', phonetic: '/ˈem.pə.θi/', translation: '同理心；共鳴', example: 'Having empathy is important for building strong relationships.' },
    { word: 'Initiative', phonetic: '/ɪˈnɪʃ.ə.t̬ɪv/', translation: '主動性；倡議', example: 'She took the initiative to organize the company event.' },
    { word: 'Persist', phonetic: '/pɚˈsɪst/', translation: '堅持；持續', example: 'If you persist in your studies, you will eventually succeed.' },
    { word: 'Innovative', phonetic: '/ˈɪn.ə.veɪ.t̬ɪv/', translation: '創新的', example: 'The company is known for its innovative approach to software design.' },
    { word: 'Genuine', phonetic: '/ˈdʒen.ju.ɪn/', translation: '真誠的；真正的', example: 'She showed genuine interest in our project.' },
    { word: 'Abundant', phonetic: '/əˈbʌn.dənt/', translation: '豐富的；大量的', example: 'There is an abundant supply of fresh fruit in the market.' }
];

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
    
    // 行 (Transportation)
    { id: 't1', category: '行 (Transportation)', title: '機場買票/問路', desc: '在機場詢問地勤人員你的航班登機門在哪裡，以及何時開始登機。', icon: 'fa-plane', color: '#3b82f6' },
    { id: 't2', category: '行 (Transportation)', title: '搭乘計程車', desc: '上計程車後告訴司機你的目的地，並請他稍微開快一點因為你趕時間。', icon: 'fa-taxi', color: '#3b82f6' },
    { id: 't3', category: '行 (Transportation)', title: '地鐵問路', desc: '在地鐵站迷路了，向路人詢問如何前往著名的觀光景點。', icon: 'fa-train-subway', color: '#3b82f6' },
    
    // 育 (Education)
    { id: 'e1', category: '育 (Education)', title: '課堂提問', desc: '在課堂上舉手，向外籍老師請教他剛才解釋的單字是什麼意思。', icon: 'fa-graduation-cap', color: '#10b981' },
    { id: 'e2', category: '育 (Education)', title: '認識新同學', desc: '在語言學校的第一天，主動向旁邊的同學自我介紹並聊天。', icon: 'fa-users', color: '#10b981' },
    
    // 樂 (Entertainment)
    { id: 'en1', category: '樂 (Entertainment)', title: '電影院買票', desc: '在電影院櫃檯買兩張晚上八點的電影票，並選中間的座位。', icon: 'fa-film', color: '#ef4444' },
    { id: 'en2', category: '樂 (Entertainment)', title: '討論週末計畫', desc: '跟朋友用英文討論這個週末要去看展覽還是去海邊玩。', icon: 'fa-face-laugh-squint', color: '#ef4444' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderWordOfTheDay();
    renderDailyScenarios();
    initScenarioRefresh();
});

function getDailyScenarios(forceRefresh = false) {
    // 6:00 AM Taiwan time (UTC+8) logic
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const twTime = new Date(utc + (3600000 * 8));
    
    // Logical date: current date shifted back by 6 hours
    // This means 5:59 AM is still "yesterday", 6:00 AM is "today"
    const logicalDate = new Date(twTime.getTime() - (6 * 3600000)).toLocaleDateString();
    
    const stored = localStorage.getItem('speakAi_dailyScenarios');
    
    if (stored && !forceRefresh) {
        const parsed = JSON.parse(stored);
        if (parsed.logicalDate === logicalDate) {
            return parsed.scenarios;
        }
    }
    
    // Generate new 3 random unique scenarios
    const shuffled = [...SCENARIO_DB].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
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
    
    const scenarios = getDailyScenarios(forceRefresh);
    container.innerHTML = '';
    
    scenarios.forEach((scenario, index) => {
        const delay = index * 0.1; // Staggered animation effect
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

function getWordOfTheDay() {
    const today = new Date().toLocaleDateString();
    let seed = 0;
    for (let i = 0; i < today.length; i++) {
        seed += today.charCodeAt(i);
    }
    const index = seed % WORD_OF_THE_DAY_DB.length;
    return WORD_OF_THE_DAY_DB[index];
}

function renderWordOfTheDay() {
    const container = document.getElementById('word-of-the-day-container');
    if (!container) return;
    
    const wordObj = getWordOfTheDay();
    
    container.innerHTML = `
        <div class="word-card">
            <div class="word-card-header">
                <i class="fa-solid fa-calendar-day"></i>
                <span>今日單字 (Word of the Day)</span>
            </div>
            <div class="word-card-body">
                <h3 class="word-title">
                    ${wordObj.word} 
                    <span class="word-phonetic">${wordObj.phonetic}</span>
                    <button id="pronounce-word-btn" class="icon-btn" aria-label="發音" style="width: 32px; height: 32px; margin-left: auto; color: var(--primary); background: rgba(129, 140, 248, 0.1);">
                        <i class="fa-solid fa-volume-high" style="font-size: 0.9rem;"></i>
                    </button>
                    <button id="save-daily-word-btn" class="icon-btn" aria-label="收藏單字" title="加入單字庫" style="width: 32px; height: 32px; margin-left: 8px; color: var(--warning); background: rgba(245, 158, 11, 0.1);">
                        <i class="fa-regular fa-star" style="font-size: 0.9rem;"></i>
                    </button>
                </h3>
                <p class="word-translation">${wordObj.translation}</p>
                <div class="word-example" id="pronounce-example-btn" style="cursor: pointer;" title="點擊聆聽例句">
                    <i class="fa-solid fa-quote-left"></i>
                    <p>"${wrapWordsWithHover(wordObj.example)}"</p>
                </div>
            </div>
        </div>
    `;
    
    const pronounceBtn = document.getElementById('pronounce-word-btn');
    if (pronounceBtn) {
        pronounceBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if ('speechSynthesis' in window) {
                // Cancel any ongoing speech first
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(wordObj.word);
                utterance.lang = 'en-US';
                utterance.rate = 0.85; // Speak the word slightly slower for clarity
                window.speechSynthesis.speak(utterance);
            }
        });
    }
    
    const exampleBtn = document.getElementById('pronounce-example-btn');
    if (exampleBtn) {
        exampleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(wordObj.example);
                utterance.lang = 'en-US';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        });
    }
    
    const saveDailyBtn = document.getElementById('save-daily-word-btn');
    if (saveDailyBtn) {
        saveDailyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.VocabBank) {
                window.VocabBank.saveWord(wordObj.word, wordObj.translation);
                // Visual feedback
                const icon = saveDailyBtn.querySelector('i');
                icon.className = 'fa-solid fa-star';
                setTimeout(() => {
                    icon.className = 'fa-regular fa-star';
                }, 1000);
            }
        });
    }
}
