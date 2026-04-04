// Application UI Logic

document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker for PWA (Offline Support)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('[App] Service Worker Registered! Scope:', reg.scope))
                .catch(err => console.log('[App] Service Worker Registration Failed:', err));
        });
    }

    initNavigation();
    initTextareaAutoResize();
    initSettings();
    initFreeTalkCard();
    initPracticeTimeTracker();
});

// --- Practice Time Tracker ---
function initPracticeTimeTracker() {
    let totalPracticeSeconds = parseInt(localStorage.getItem('practice_time_seconds') || '0');

    function updateDisplay() {
        const timeDisplay = document.getElementById('practice-time-display');
        if (!timeDisplay) return;
        
        const minutes = Math.floor(totalPracticeSeconds / 60);
        const hours = Math.floor(minutes / 60);
        
        let displayStr = '';
        if (hours > 0) {
            const displayHrs = (totalPracticeSeconds / 3600).toFixed(1);
            displayStr = `${displayHrs} hr`;
        } else {
            displayStr = `${minutes} min`;
        }
        
        timeDisplay.innerHTML = `<i class="fa-solid fa-clock"></i> ${displayStr}`;
    }

    // Initial display
    updateDisplay();

    // Track active time every second
    setInterval(() => {
        // Only count time if the page is currently visible/in focus
        if (document.visibilityState === 'visible') {
            totalPracticeSeconds += 1;
            
            // Save to storage and update UI every minute
            if (totalPracticeSeconds % 60 === 0) {
                localStorage.setItem('practice_time_seconds', totalPracticeSeconds.toString());
                updateDisplay();
            }
        }
    }, 1000);
}

function initFreeTalkCard() {
    const freeTalkCard = document.getElementById('free-talk-card');
    if (freeTalkCard) {
        freeTalkCard.addEventListener('click', () => {
            window.AppEventBus.emit('start-scenario', {
                id: 'free',
                title: '自由對話',
                desc: '這是一個自由聊天的空間，沒有任何話題限制！'
            });
        });
    }
}

function initSettings() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('profile-settings-btn') || document.getElementById('settings-btn');
    const closeBtn = document.getElementById('close-settings');
    const saveBtn = document.getElementById('save-settings-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const nicknameInput = document.getElementById('user-nickname-input');
    const levelSelect = document.getElementById('user-level-select');
    const speedSelect = document.getElementById('speech-speed-select');
    const autoSpeakToggle = document.getElementById('auto-speak-toggle');
    const nameDisplay = document.getElementById('user-name-display');
    
    // Load existing settings
    const existingKey = localStorage.getItem('gemini_api_key');
    if (existingKey) {
        apiKeyInput.value = existingKey;
    }
    
    const existingNickname = localStorage.getItem('user_nickname') || '';
    nicknameInput.value = existingNickname;
    if (nameDisplay) nameDisplay.textContent = existingNickname;

    const existingLevel = localStorage.getItem('user_level') || 'intermediate';
    levelSelect.value = existingLevel;

    const existingSpeed = localStorage.getItem('speech_speed') || '0.85';
    speedSelect.value = existingSpeed;

    const autoSpeak = localStorage.getItem('auto_speak');
    if (autoSpeak !== null) {
        autoSpeakToggle.checked = autoSpeak === 'true';
    }
    
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    
    saveBtn.addEventListener('click', () => {
        // Save API Key
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            window.AppEventBus.emit('api-key-updated', key);
        } else {
            localStorage.removeItem('gemini_api_key');
        }
        
        // Save Nickname
        const nickname = nicknameInput.value.trim();
        localStorage.setItem('user_nickname', nickname);
        if (nameDisplay) nameDisplay.textContent = nickname;
        window.AppEventBus.emit('nickname-updated', nickname);

        // Save Level & Speed
        const oldLevel = localStorage.getItem('user_level');
        const newLevel = levelSelect.value;
        localStorage.setItem('user_level', newLevel);
        localStorage.setItem('speech_speed', speedSelect.value);
        
        if (oldLevel !== newLevel) {
            window.AppEventBus.emit('user-level-updated', newLevel);
        }

        localStorage.setItem('auto_speak', autoSpeakToggle.checked);
        modal.classList.add('hidden');
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('data-target');
            window.switchView(targetId);
        });
    });

    // Back button in chat view
    const backBtn = document.getElementById('back-to-scenarios');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.switchView('scenarios-view');
        });
    }
}

// Global View Switcher
window.switchView = function(targetId) {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    
    // Refresh vocab list when entering the vocab view
    if (targetId === 'vocab-view' && window.VocabBank) {
        window.VocabBank.renderList();
    }

    // Update nav styles (if nav exists for this target)
    navItems.forEach(nav => {
        nav.classList.remove('active');
        if (nav.getAttribute('data-target') === targetId) {
            nav.classList.add('active');
        }
    });

    // Switch views
    views.forEach(view => {
        view.classList.remove('active');
        if (view.id === targetId) {
            view.classList.add('active');
        }
    });

    // CRITICAL: Stop all speech activities when switching views to prevent OS-level conflicts
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    if (typeof window.stopChatRecording === 'function') {
        window.stopChatRecording();
    }
    if (typeof window.stopReadingRecordingExternal === 'function') {
        window.stopReadingRecordingExternal();
    }
};

function initTextareaAutoResize() {
    const textarea = document.getElementById('message-input');
    if (!textarea) return;

    textarea.addEventListener('input', function() {
        this.style.height = 'auto'; // Reset height to calculate new height
        
        // Calculate new height (max 100px)
        const newHeight = Math.min(this.scrollHeight, 100);
        this.style.height = newHeight + 'px';
        
        // Setup toggle disabled state of send button based on input
        const sendBtn = document.getElementById('send-btn');
        if (this.value.trim().length > 0) {
            sendBtn.removeAttribute('disabled');
        } else {
            sendBtn.setAttribute('disabled', 'true');
        }
    });
    
    // Initial state
    document.getElementById('send-btn').setAttribute('disabled', 'true');
}

// Global utility for event bus / passing data between modules
window.AppEventBus = {
    events: {},
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
};
