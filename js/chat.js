// Chat Interface and Mock AI Logic

let currentScenario = null;
let isTyping = false;
let recognition = null;
let isRecording = false;

document.addEventListener('DOMContentLoaded', () => {
    initChat();
    initSpeechRecognition();
    initHoverTranslation();
    
    // Listen for starting a scenario from the scenarios view
    window.AppEventBus.on('start-scenario', (scenario) => {
        currentScenario = scenario;
        document.getElementById('current-scenario-title').textContent = scenario.title;
        
        // Switch to chat view
        document.querySelector('.nav-item[data-target="chat-view"]').click();
        
        // Stop any ongoing speech
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        
        // Clear chat and add initial context message
        resetChat(scenario);
    });
    
    // Initialize default chat view as Free Talk (silent)
    currentScenario = {
        id: 'free',
        title: '自由對話',
        desc: '這是一個自由聊天的空間，沒有任何話題限制！'
    };
    document.getElementById('current-scenario-title').textContent = currentScenario.title;
    resetChat(currentScenario, true);
});

function initChat() {
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    
    sendBtn.addEventListener('click', handleSendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) {
                handleSendMessage();
            }
        }
    });
}

let conversationHistory = [];

function resetChat(scenario, isInitialLoad = false) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Get nickname and level from localStorage
    const nickname = localStorage.getItem('user_nickname') || 'Guest';
    const level = localStorage.getItem('user_level') || 'intermediate';
    
    let wordContext = "";
    if (typeof getWordOfTheDay === 'function') {
        const wordObj = getWordOfTheDay();
        if (wordObj) {
            wordContext = `Also, today's "Word of the Day" target is: "${wordObj.word}" (meaning: ${wordObj.translation}). In your first message greeting, please explicitly challenge or encourage me to try using this word in our conversation today! `;
        }
    }

    // Level-specific coaching instructions (Calibrated to Taiwan Standards)
    let levelInstruction = "";
    if (level === 'beginner') {
        levelInstruction = "The user is at a BEGINNER level (Equivalent to Taiwan Elementary to Junior High school, 國小至國中程度). Use only the most common 2,000 words. Use very simple grammar (Present/Past Simple) and short, direct sentences. Avoid idioms or complex phrasal verbs. Be extremely encouraging.";
    } else if (level === 'advanced') {
        levelInstruction = "The user is at an ADVANCED level (Above Taiwan Senior High school, 高中以上程度). Use a wide range of sophisticated vocabulary, academic terms, and natural idioms. Use complex sentence structures and provide nuanced corrections on tone and style.";
    } else {
        // Intermediate
        levelInstruction = "The user is at an INTERMEDIATE level (Equivalent to Taiwan Senior High school, 高中程度). Use vocabulary and grammar typical of a high school graduate (around 4,000-7,000 words). Use standard natural English with varied sentence lengths. Include common idioms to help them progress.";
    }
    
    conversationHistory = [
        {
            role: "user",
            parts: [{text: `We are doing an English speaking practice roleplay. My name is ${nickname}. My English level is ${level}. ${levelInstruction} The scenario is: ${scenario.title}. ${scenario.desc}. ${wordContext}You will act as the person I am talking to in this scenario, but you are also my English coach. Always reply in English. Every time I reply, you should continue the conversation naturally. Adjust your vocabulary and sentence complexity to match my level strictly. If my English has grammatical errors, vocabulary mistakes, or unnatural phrasing, you must provide a correction. You MUST ONLY respond in valid JSON format with this exact structure (do not use markdown blocks for JSON, just pure JSON):\n{\n  "reply": "Your conversational response here",\n  "correction": {\n     "wrong": "The exact mistake I made (or null if perfect)",\n     "correct": "The corrected sentence (or null)",\n     "explanation": "Brief explanation in Traditional Chinese (or null)"\n  }\n}`}]
        },
        {
            role: "model",
            parts: [{text: `{"reply": "Hi ${nickname}! Welcome to the chat. Let's start our conversation!", "correction": null}`}]
        }
    ];

    // Add AI greeting
    let greetingMsg = `Hi ${nickname}! Let's practice the scenario: **${scenario.title}**. \n\n${scenario.desc}\n\n`;
    if (scenario.id === 'free') {
        greetingMsg = `Hi ${nickname}! I'm your AI English coach. This is a free talk space, so you can talk about anything you'd like! \n\n`;
    }
    if (typeof getWordOfTheDay === 'function') {
        const wordObj = getWordOfTheDay();
        if (wordObj) {
            greetingMsg += `🌟 **Today's Challenge**: Try to use the word "**${wordObj.word}**" (${wordObj.translation}) in our conversation!\n\n`;
        }
    }
    if (scenario.id !== 'free') {
        greetingMsg += `You can start first!`;
    }
    
    appendAiMessage(greetingMsg, null, isInitialLoad);
}

function handleSendMessage() {
    if (isTyping) return;
    
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    // Append user message
    appendUserMessage(text);
    
    // Reset input
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('send-btn').setAttribute('disabled', 'true');
    input.focus();
    
    // Call either Real AI or Mock
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey) {
        callGeminiAPI(text, apiKey);
    } else {
        simulateAiResponse(text);
    }
}

function appendUserMessage(text) {
    const chatMessages = document.getElementById('chat-messages');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user-message';
    msgDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHTML(text)}</p>
            <span class="time">${timeStr}</span>
        </div>
    `;
    
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

function appendAiMessage(text, correction = null, silent = false) {
    const chatMessages = document.getElementById('chat-messages');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let correctionHtml = '';
    if (correction) {
        correctionHtml = `
            <div class="correction" id="correction-${Date.now()}">
                <div class="correction-title"><i class="fa-solid fa-lightbulb"></i> 小提醒：可以這樣說會更好喔！</div>
                <div class="correction-wrong">❌ ${escapeHTML(correction.wrong)}</div>
                <div class="correction-correct">
                    <i class="fa-solid fa-check"></i> ⭕ ${escapeHTML(correction.correct)}
                    <button class="icon-btn correction-sound-btn" title="聽發音" style="width: 24px; height: 24px; margin-left: 8px; font-size: 0.8rem; color: var(--success); background: rgba(52, 211, 153, 0.1);">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
                <div class="correction-explanation">${escapeHTML(correction.explanation)}</div>
            </div>
        `;
    }
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';
    msgDiv.innerHTML = `
        <div class="avatar ai-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="message-content">
            <div class="message-bubble">
                <p class="translatable-text">${wrapWordsWithHover(text)}</p>
                <button class="icon-btn ai-pronounce-btn" title="聽發音">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
            ${correctionHtml}
            <span class="time">${timeStr}</span>
        </div>
    `;
    
    chatMessages.appendChild(msgDiv);

    // Attach listener to AI pronunciation button
    const pronounceBtn = msgDiv.querySelector('.ai-pronounce-btn');
    if (pronounceBtn) {
        pronounceBtn.addEventListener('click', () => {
            speakAiText(text);
        });
    }
    
    // Attach listener to correction sound button if it exists
    if (correction) {
        const soundBtn = msgDiv.querySelector('.correction-sound-btn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(correction.correct);
                    utterance.lang = 'en-US';
                    utterance.rate = parseFloat(localStorage.getItem('speech_speed') || '0.85');
                    window.speechSynthesis.speak(utterance);
                }
            });
        }
    }

    scrollToBottom();
    
    // Read AI response aloud
    if (!silent) {
        speakAiText(text);
    }
}

function speakAiText(text) {
    if (!('speechSynthesis' in window)) return;
    const isAutoSpeak = localStorage.getItem('auto_speak') !== 'false';
    if (!isAutoSpeak) return;
    
    // Remove markdown symbols (**, *, etc.) before speaking
    const cleanText = text.replace(/[*#]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    
    const speed = parseFloat(localStorage.getItem('speech_speed') || '0.85');
    utterance.rate = speed; 
    window.speechSynthesis.speak(utterance);
}

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Browser does not support Speech Recognition");
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    const voiceBtn = document.getElementById('voice-input-btn');
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    
    voiceBtn.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop();
        } else {
            // Stop any playing AI voice first
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            
            try {
                recognition.start();
            } catch(e) {
                console.error(e);
            }
        }
    });
    
    recognition.onstart = function() {
        isRecording = true;
        voiceBtn.classList.add('recording');
        input.placeholder = "Listening...";
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        // Append or replace the text in textarea
        input.value = (input.value + " " + transcript).trim();
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';
        sendBtn.removeAttribute('disabled');
    };
    
    recognition.onerror = function(event) {
        console.error("Speech recognition error", event.error);
        if(event.error === 'not-allowed') {
            alert('麥克風權限被拒絕，請在瀏覽器設定中允許使用麥克風。');
        }
    };
    
    recognition.onend = function() {
        isRecording = false;
        voiceBtn.classList.remove('recording');
        input.placeholder = "Type or say something in English...";
        
        // Auto-send after a brief delay if text exists
        if (input.value.trim().length > 0 && !sendBtn.disabled) {
            setTimeout(() => {
                if (!isTyping) handleSendMessage();
            }, 800);
        }
    };
}

function showTypingIndicator() {
    isTyping = true;
    const chatMessages = document.getElementById('chat-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator-wrapper';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="avatar ai-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="message-content">
            <p class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </p>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    isTyping = false;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}

// MOCK AI ENGINE
function simulateAiResponse(userText) {
    showTypingIndicator();
    
    // Simulate network delay
    setTimeout(() => {
        removeTypingIndicator();
        
        const textLower = userText.toLowerCase();
        let reply = "That's a good approach! In a real scenario, this response would be helpful. Keep going!";
        let correction = null;
        
        // Simple mock trigger for demonstration purposes
        if (textLower.includes('want buy') || textLower.includes('give me')) {
            reply = "Great start! Let me help you sound a bit more polite.";
            correction = {
                wrong: userText,
                correct: "I would like to purchase...",
                explanation: "在英文對話中，使用 'I would like to' 會比單純說 'I want' 或是 'Give me' 來得有禮貌，特別是在點餐或購物情境。"
            };
        } else if (textLower.includes('is depends')) {
            reply = "Good usage of the phrase, but there is a small grammatical detail we can fix.";
            correction = {
                wrong: "It is depends on you.",
                correct: "It depends on you.",
                explanation: "'Depend' 本身就是動詞，前面不需要加 'is' 喔！這是一個常見的小錯誤。"
            };
        } else if (textLower.length < 10) {
            reply = "I understand. Could you elaborate a bit more on that?";
        } else {
            // Random praise
            const praises = [
                "Excellent sentence structure! What else would you say next?",
                "You sound very natural. Let's keep the conversation flowing.",
                "Perfect! That's exactly how a native speaker might say it."
            ];
            reply = praises[Math.floor(Math.random() * praises.length)];
        }
        
        appendAiMessage(reply, correction);
        
    }, 1500 + Math.random() * 1000); // 1.5 - 2.5 second delay
}

// REAL AI API CALL
async function callGeminiAPI(userText, apiKey) {
    showTypingIndicator();
    
    // Check if input contains Chinese characters
    const hasChinese = /[\u4e00-\u9fa5]/.test(userText);
    let promptAddition = "";
    if (hasChinese) {
        promptAddition = " (Note: The user's message is in Chinese. Please start your response by providing a natural English translation of their message, then continue the conversation in English as their coach.)";
    }

    // Add user message to history
    conversationHistory.push({
        role: "user",
        parts: [{text: userText + promptAddition}]
    });

    try {
        let response;
        const isLocal = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' || 
                        window.location.protocol === 'file:';

        // If running locally and we have an API key, use direct call for debugging/dev
        // If deployed on Vercel, always use the secure /api/chat proxy
        if (isLocal && apiKey) {
            const directUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            response = await fetch(directUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: conversationHistory
                })
            });
        } else {
            const proxyUrl = `/api/chat`;
            response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey || ''
                },
                body: JSON.stringify({
                    contents: conversationHistory
                })
            });
        }

        const data = await response.json();
        removeTypingIndicator();

        if (data.error) {
            throw new Error(data.error.message || JSON.stringify(data.error));
        }
        
        const candidate = data.candidates && data.candidates[0];
        if (!candidate) {
            throw new Error("收到空白的回覆。");
        }
        
        if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
            throw new Error("對話內容觸發了 AI 安全過濾機制 (Safety Filter)。");
        }

        if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
            throw new Error("AI 回覆的格式異常。");
        }

        const aiText = candidate.content.parts[0].text;
        
        // Always add model's raw text to history FIRST to maintain 'user' -> 'model' alternating requirement
        conversationHistory.push({
            role: "model",
            parts: [{text: aiText}]
        });

        let aiJson;
        try {
            // Strip markdown code blocks just in case Gemini wrapped the JSON
            const cleanedText = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
            aiJson = JSON.parse(cleanedText);
        } catch (e) {
            console.error('Failed to parse AI JSON:', aiText);
            appendAiMessage("抱歉，我剛才有點沒聽清楚您的意思，可以換個方式再說一次嗎？");
            return;
        }

        appendAiMessage(aiJson.reply, aiJson.correction);

    } catch (error) {
        removeTypingIndicator();
        console.error('API Error:', error);
        
        let errorMsg = error.message;
        if (errorMsg.includes('not found') || errorMsg.includes('ListModels')) {
            try {
                const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                const listData = await listResp.json();
                if (listData.models) {
                    const available = listData.models
                        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                        .map(m => m.name.replace('models/', ''))
                        .join(', ');
                    if (available) {
                         errorMsg = `您的金鑰所在專案可能存取權限不足，目前支援的模型為：[ ${available} ]。請複製並回報此訊息給開發者進行調整！`;
                    } else {
                         errorMsg = "這把 API Key 在伺服器端沒有開啟任何支援文字生成的模型權限。這通常是因為您申請的專案被限制或是所屬 Google 帳號異常。請嘗試使用不同的 Google 帳號申請看看！";
                    }
                } else if (listData.error) {
                    errorMsg = `查詢可用模型失敗：${listData.error.message}`;
                }
            } catch(e) {
                // Ignore fallback
            }
        } else if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
            errorMsg = `網路連線問題，請檢查網路狀態。\n\n詳細錯誤: ${error.message}`;
        } else if (errorMsg.toLowerCase().includes('quota') || errorMsg.includes('exhausted') || errorMsg.includes('429')) {
            errorMsg = `API 請求頻率過快或已達免費額度上限（Gemini 免費版每分鐘最多 15 次），請稍等 10~20 秒後再試。\n\n詳細錯誤: ${error.message}`;
        } else if (errorMsg.includes('API_KEY_INVALID')) {
            errorMsg = `API Key 似乎無效，請至右上方設定重新確認。\n\n詳細錯誤: ${error.message}`;
        }
        
        appendAiMessage(`⚠️ 系統提示：${errorMsg}`);
        
        // Remove the failed user message from history so they can retry
        if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'user') {
            conversationHistory.pop();
        }
    }
}

// --- Hover Translation Feature ---

const translationCache = new Map();
let tooltipTimeout = null;

function initHoverTranslation() {
    const tooltip = document.getElementById('translation-tooltip');
    if (!tooltip) return;
    
    const wordSpan = tooltip.querySelector('.tooltip-word');
    const transSpan = tooltip.querySelector('.tooltip-translation');
    let currentHoverElement = null;

    const mainContent = document.querySelector('.main-content');

    mainContent.addEventListener('mouseover', async (e) => {
        const target = e.target.closest('.hover-word');
        if (target) {
            clearTimeout(tooltipTimeout);
            
            // Prevent re-triggering and causing jitters/unclickability on the same word
            if (currentHoverElement === target) return;
            
            currentHoverElement = target;
            const word = target.getAttribute('data-word');
            
            // Re-highlight word
            document.querySelectorAll('.hover-word.active').forEach(el => el.classList.remove('active'));
            target.classList.add('active');
            
            // Prep tooltip content
            wordSpan.textContent = word;
            transSpan.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            
            // Display tooltip before positioning to calculate accurate width
            tooltip.classList.remove('hidden');
            
            const container = document.querySelector('.main-content');
            const containerRect = container.getBoundingClientRect();
            const rect = target.getBoundingClientRect();
            let tooltipRect = tooltip.getBoundingClientRect();
            
            let localLeft = rect.left - containerRect.left + rect.width / 2;
            let localTop = rect.top - containerRect.top - 10;
            let arrowPos = "50%";
            const padding = 15;

            // Bounds checking for initial state (constrain to chat-view width)
            if (localLeft - tooltipRect.width / 2 < padding) {
                const shift = (tooltipRect.width / 2 + padding) - localLeft;
                localLeft = tooltipRect.width / 2 + padding;
                arrowPos = `calc(50% - ${shift}px)`;
            } else if (localLeft + tooltipRect.width / 2 > containerRect.width - padding) {
                const shift = localLeft - (containerRect.width - tooltipRect.width / 2 - padding);
                localLeft = containerRect.width - tooltipRect.width / 2 - padding;
                arrowPos = `calc(50% + ${shift}px)`;
            }
            
            // Constrain top (prevent overflow outside top edge / header)
            let isArrowTop = false;
            if (localTop < 60) { // Top header height buffer
                localTop = rect.bottom - containerRect.top + 10;
                isArrowTop = true;
                tooltip.classList.add('arrow-top');
            } else {
                tooltip.classList.remove('arrow-top');
            }

            tooltip.style.left = `${localLeft}px`;
            tooltip.style.top = `${localTop}px`; 
            tooltip.style.setProperty('--arrow-pos', arrowPos);
            
            // Dynamic transform based on arrow position
            if (isArrowTop) {
                tooltip.style.transform = 'translate(-50%, 0)';
            } else {
                tooltip.style.transform = 'translate(-50%, -100%)';
            }

            // Sync save button icon
            const saveBtnIcon = document.querySelector('#save-word-btn i');
            if (saveBtnIcon && window.VocabBank) {
                const isSaved = window.VocabBank.words.some(w => w.word.toLowerCase() === word.toLowerCase());
                saveBtnIcon.className = isSaved ? 'fa-solid fa-star' : 'fa-regular fa-star';
            }
            
            const lowerWord = word.toLowerCase();
            if (translationCache.has(lowerWord)) {
                transSpan.textContent = translationCache.get(lowerWord);
                adjustTooltipPosition();
            } else {
                try {
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(word)}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    if (data && data[0] && data[0][0] && data[0][0][0]) {
                        const translatedText = data[0][0][0];
                        translationCache.set(lowerWord, translatedText);
                        
                        if (currentHoverElement === target) {
                            transSpan.textContent = translatedText;
                            adjustTooltipPosition(); // re-adjust width after text changes
                        }
                    }
                } catch(error) {
                    console.error("Translation failed", error);
                    if (currentHoverElement === target) {
                        transSpan.textContent = "翻譯失敗";
                        adjustTooltipPosition();
                    }
                }
            }
            
            // Helper function to re-calculate bounds when content width changes
            function adjustTooltipPosition() {
                const newTooltipRect = tooltip.getBoundingClientRect();
                let newLeft = rect.left - containerRect.left + rect.width / 2;
                let newArrowPos = "50%";
                
                if (newLeft - newTooltipRect.width / 2 < padding) {
                    const shift = (newTooltipRect.width / 2 + padding) - newLeft;
                    newLeft = newTooltipRect.width / 2 + padding;
                    newArrowPos = `calc(50% - ${shift}px)`;
                } else if (newLeft + newTooltipRect.width / 2 > containerRect.width - padding) {
                    const shift = newLeft - (containerRect.width - newTooltipRect.width / 2 - padding);
                    newLeft = containerRect.width - newTooltipRect.width / 2 - padding;
                    newArrowPos = `calc(50% + ${shift}px)`;
                }
                
                tooltip.style.left = `${newLeft}px`;
                tooltip.style.setProperty('--arrow-pos', newArrowPos);
            }
        }
    });

    // Keep tooltip visible if mouse enters the tooltip itself
    tooltip.addEventListener('mouseenter', () => clearTimeout(tooltipTimeout));
    tooltip.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
        if (currentHoverElement) {
            currentHoverElement.classList.remove('active');
            currentHoverElement = null;
        }
    });

    mainContent.addEventListener('mouseout', (e) => {
        const target = e.target.closest('.hover-word');
        if (target) {
            target.classList.remove('active');
            // We do NOT set currentHoverElement = null here immediately so click-to-save can read it
            tooltipTimeout = setTimeout(() => {
                tooltip.classList.add('hidden');
                if (currentHoverElement === target) currentHoverElement = null;
            }, 300); // Back to 300ms since we now have physical CSS bridges and padded hit-boxes
        }
    });
    
    // Add click event to pin the tooltip manually and pronounce the word
    mainContent.addEventListener('click', (e) => {
        const target = e.target.closest('.hover-word');
        if (target) {
            clearTimeout(tooltipTimeout);
            
            // Pronounce word when clicked
            const word = target.getAttribute('data-word');
            if (word && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.lang = 'en-US';
                utterance.rate = parseFloat(localStorage.getItem('speech_speed') || '0.85');
                window.speechSynthesis.speak(utterance);
            }
        } else if (!e.target.closest('.translation-tooltip')) {
            // If clicking outside a word and outside tooltip, hide immediately
            tooltip.classList.add('hidden');
            if (currentHoverElement) {
                currentHoverElement.classList.remove('active');
                currentHoverElement = null;
            }
        }
    });
    
    // Setup save button inside tooltip
    const saveBtn = document.getElementById('save-word-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const word = wordSpan.textContent.trim();
            const translation = transSpan.textContent.trim();
            if (word && window.VocabBank) {
                const icon = saveBtn.querySelector('i');
                const isCurrentlySaved = icon.classList.contains('fa-solid');

                if (isCurrentlySaved) {
                    window.VocabBank.removeWord(word);
                    icon.className = 'fa-regular fa-star';
                } else {
                    window.VocabBank.saveWord(word, translation);
                    icon.className = 'fa-solid fa-star';
                }
            }
        });
    }
}

function wrapWordsWithHover(text) {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\n/g, '<br>');
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let n;
    while(n = walk.nextNode()) {
        textNodes.push(n);
    }
    
    textNodes.forEach(node => {
        const textContent = node.nodeValue;
        if (/[A-Za-z]/.test(textContent)) {
            const span = document.createElement('span');
            span.innerHTML = textContent.replace(/([A-Za-z]+(?:'[A-Za-z]+)?)/g, '<span class="hover-word" data-word="$1">$1</span>');
            node.parentNode.replaceChild(span, node);
        }
    });
    
    return tempDiv.innerHTML;
}
