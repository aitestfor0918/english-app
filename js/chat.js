// Chat Interface and Mock AI Logic

let currentScenario = null;
let isTyping = false;
let recognition = null;
let isRecording = false;
let recognitionAccumulated = "";

document.addEventListener('DOMContentLoaded', () => {
    initChat();
    initSpeechRecognition();
    initHoverTranslation();
    
    // Listen for starting a scenario from the scenarios view
    window.AppEventBus.on('start-scenario', (scenario) => {
        currentScenario = scenario;
        document.getElementById('current-scenario-title').textContent = scenario.title;
        
        // Switch to chat view
        window.switchView('chat-view');
        
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

    // Long-term memory context
    let userProfileMemory = localStorage.getItem('speakAi_userProfile') || "No previous information known about the user yet.";
    let memoryInstruction = `\n\n[LONG-TERM MEMORY ABOUT THE USER]:\n${userProfileMemory}\n\nUse this information to make the conversation feel personal and continuous. If the user tells you new permanent facts about themselves (name, job, hobbies, family, preferences, goals), you should output a concise update to this memory.`;
    
    conversationHistory = [
        {
            role: "user",
            parts: [{text: `We are doing an English speaking practice roleplay. My name is ${nickname}. My English level is ${level}. ${levelInstruction}${memoryInstruction} The scenario is: ${scenario.title}. ${scenario.desc}. ${wordContext}You will act as the person I am talking to in this scenario, but you are also my English coach. Always reply in English. Every time I reply, you should continue the conversation naturally. Keep your conversational response brief and concise (typically 1-2 sentences). Adjust your vocabulary and sentence complexity to match my level strictly. If my English has grammatical errors, vocabulary mistakes, or unnatural phrasing, you must provide a correction. You MUST ONLY respond in valid JSON format with this exact structure (do not use markdown blocks for JSON, just pure JSON):\n{\n  "reply": "Your concise conversational response here",\n  "correction": {\n     "wrong": "The exact mistake I made (or null if perfect)",\n     "correct": "The corrected sentence (or null)",\n     "explanation": "Brief explanation in Traditional Chinese (or null)"\n  },\n  "memory_update": "A concise string of NEW facts learned about the user in this turn, or null if nothing new." \n}`}]
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
                <p class="translatable-text">${wrapWordsWithHover(formatMessage(text))}</p>
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
    if (!('speechSynthesis' in window) || !text) return;
    const isAutoSpeak = localStorage.getItem('auto_speak') !== 'false';
    if (!isAutoSpeak) return;
    
    // Remove markdown symbols (**, *, etc.) before speaking
    // Added safety check to ensure text is a string
    const cleanText = (typeof text === 'string') ? text.replace(/[*#]/g, '') : "";
    if (!cleanText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    
    const speed = parseFloat(localStorage.getItem('speech_speed') || '0.85');
    utterance.rate = speed; 
    
    // Safety check for mobile browsers (iOS Safari often fails if not handled well)
    try {
        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.error("Speech Synthesis failed:", e);
    }
}

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Browser does not support Speech Recognition");
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
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
        recognitionAccumulated = "";
        voiceBtn.classList.add('recording');
        input.placeholder = "Listening... (Click again to stop)";
    };
    
    recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        if (finalTranscript) {
            recognitionAccumulated += (recognitionAccumulated ? " " : "") + finalTranscript;
        }

        // Update the textarea with accumulated final results + current interim
        const currentText = (recognitionAccumulated + (interimTranscript ? " " + interimTranscript : "")).trim();
        if (currentText) {
            input.value = currentText;
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 100) + 'px';
            sendBtn.removeAttribute('disabled');
        }
    };
    
    recognition.onerror = function(event) {
        console.error("Speech recognition error", event.error);
        isRecording = false;
        voiceBtn.classList.remove('recording');
        
        if(event.error === 'not-allowed') {
            alert('麥克風權限被拒絕，請在瀏覽器設定中允許使用麥克風。');
        } else if (event.error === 'service-not-allowed') {
            alert('語音服務不可用。請確認 iPhone 設定：一般 > 鍵盤 >「啟用聽寫」功能是否開啟，並確保沒有其他分頁在使用麥克風。');
        } else {
            console.warn(`Speech recognition error: ${event.error}`);
        }
    };
    
    recognition.onend = function() {
        isRecording = false;
        voiceBtn.classList.remove('recording');
        input.placeholder = "Type or say something in English...";
        
        // Auto-send disabled per user request to allow manual editing
    };

    // Global helper to stop recording if switching views
    window.stopChatRecording = function() {
        if (recognition && isRecording) {
            recognition.stop();
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
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, 
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
        
    }, 500 + Math.random() * 500); // Reduced delay to 0.5 - 1.0 seconds
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

    conversationHistory.push({
        role: "user",
        parts: [{text: userText + promptAddition}]
    });

    // --- History Management: Keep system context + last 12 messages ---
    if (conversationHistory.length > 14) {
        // Index 0 & 1 are the initial instructions and greeting confirm
        const systemSetup = conversationHistory.slice(0, 2);
        // Take the last 12 messages
        const recentHistory = conversationHistory.slice(-12);
        conversationHistory = [...systemSetup, ...recentHistory];
        console.log(`[Chat] History truncated to ${conversationHistory.length} messages.`);
    }

    const maxRetries = 5;
    let retryCount = 0;
    const retryDelay = (ms) => new Promise(res => setTimeout(res, ms));
    
    // Helper for exponential backoff with jitter
    const getNextDelay = (count) => {
        // Increased base delay for free tier stability
        const base = Math.pow(2.5, count) * 1500; // 1.5s, 3.75s, 9.3s, 23s...
        const jitter = Math.random() * 2000; // 0-2s random jitter
        return Math.min(base + jitter, 35000); // Caps at 35s to respect long Google limits
    };

    if (!navigator.onLine) {
        removeTypingIndicator();
        appendAiMessage(`⚠️ 系統提示：網路連線似乎已中斷，請檢查 Wi-Fi 或數據連線。`);
        return;
    }

    while (retryCount < maxRetries) {
        try {
            let response;
            const host = window.location.hostname;
            const isLocal = host === 'localhost' || 
                            host === '127.0.0.1' || 
                            host.startsWith('192.168.') || 
                            host.startsWith('10.') || 
                            host.endsWith('.local') ||
                            window.location.protocol === 'file:';

            // Use canonical stable model name
            const modelName = "gemini-1.5-flash";

            if (isLocal && apiKey) {
                // Local fallback: Direct call
                const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
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
                // Production or No-Key local: Vercel Proxy
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

            if (!response.ok) {
                // Retry for common transient errors: 429 (Rate Limit), 503 (High Demand), 504 (Timeout), 500 (Internal)
                const retryableStatuses = [429, 503, 500, 504];
                if (retryableStatuses.includes(response.status)) {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        const nextRetryDelay = getNextDelay(retryCount);
                        console.log(`[API] Status ${response.status}, Retrying request (${retryCount}/${maxRetries}) in ${Math.round(nextRetryDelay)}ms...`);
                        
                        // Update typing indicator to let user know we are retrying
                        const typingText = document.querySelector('#typing-indicator .typing-indicator');
                        if (typingText) {
                            let friendlyMsg = "AI 正在思考中...";
                            if (response.status === 503) friendlyMsg = `目前 AI 較忙碌，正在進行第 ${retryCount} 次重試...`;
                            else if (response.status === 429) friendlyMsg = `請求太快，稍等後自動重試 (${retryCount}/${maxRetries})...`;
                            else friendlyMsg = `連線稍慢，正在重試中 (${retryCount}/${maxRetries})...`;
                            
                            typingText.innerHTML = `<span>${friendlyMsg}</span>`;
                        }
                        
                        await retryDelay(nextRetryDelay); 
                        continue; // Go to next loop iteration
                    }
                }

                let errorText = "";
                try {
                    const errorData = await response.json();
                    if (errorData.error && typeof errorData.error === 'object') {
                        errorText = errorData.error.message || JSON.stringify(errorData.error);
                    } else {
                        errorText = errorData.error || errorData.message || response.statusText;
                    }
                } catch (e) {
                    errorText = `伺服器回傳錯誤 (${response.status})。可能是 Vercel 設定問題，請檢查 Deployment Logs。`;
                }
                throw new Error(errorText);
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

            const aiText = candidate.content.parts[0].text || "";
            
            if (!aiText) {
                throw new Error("AI 回覆的內容為空。");
            }

            // Always add model's raw text to history FIRST to maintain 'user' -> 'model' alternating requirement
            conversationHistory.push({
                role: "model",
                parts: [{text: aiText}]
            });

            let aiJson;
            try {
                // Strip markdown code blocks just in case Gemini wrapped the JSON
                const cleanedText = typeof aiText === 'string' 
                    ? aiText.replace(/```json/gi, '').replace(/```/g, '').trim() 
                    : "";
                aiJson = JSON.parse(cleanedText);
            } catch (e) {
                console.error('Failed to parse AI JSON:', aiText);
                appendAiMessage("抱歉，我剛才有點沒聽清楚您的意思，可以換個方式再說一次嗎？");
                return;
            }

            appendAiMessage(aiJson.reply, aiJson.correction);

            // Update Long-Term Memory if provided
            if (aiJson.memory_update && typeof aiJson.memory_update === 'string') {
                updateUserProfile(aiJson.memory_update);
            }
            
            return; // Success - break out of the loop and function

        } catch (error) {
            // Fatal errors that SHOULD NOT be retried: 400 (Bad Request), 401 (Unauthorized - wrong key)
            const errorMsg = error.message || "";
            const isFatal = errorMsg.includes('400') || errorMsg.includes('401') || errorMsg.includes('API_KEY_INVALID');

            // If we've exhausted all retries or it's a fatal error, show the final failure UI
            if (retryCount >= maxRetries - 1 || isFatal) {
                removeTypingIndicator();
                console.error('API Error after retries:', error);
                
                let displayMsg = (typeof errorMsg === 'string') ? errorMsg : JSON.stringify(errorMsg);

                if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
                    displayMsg = `網路連線問題，請檢查網路狀態。如果您在本地執行，請確認「設定」中已填寫 API Key。\n\n詳細錯誤: ${errorMsg}`;
                } else if (errorMsg.toLowerCase().includes('quota') || errorMsg.includes('exhausted') || errorMsg.includes('429')) {
                    displayMsg = `API 請求頻率過快或已達免費額度上限，請稍等 10~20 秒後再試。\n\n詳細錯誤: ${errorMsg}`;
                } else if (errorMsg.includes('API_KEY_INVALID')) {
                    displayMsg = `API Key 似乎無效，請至右上方設定重新確認。\n\n詳細錯誤: ${errorMsg}`;
                }

                // Display the specific error in the chat
                appendAiMessage(`⚠️ 系統提示：${displayMsg}`);
                
                // Remove the failed user message from history so they can retry
                if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'user') {
                    conversationHistory.pop();
                }
                return; // End function after showing error
            }
            
            // If it was a network error or fetch failed, retry
            retryCount++;
            const nextRetryDelay = getNextDelay(retryCount);
            console.log(`[API] Connection error, retrying (${retryCount}/${maxRetries}) in ${Math.round(nextRetryDelay)}ms...`);
            
            // Update typing indicator
            const typingText = document.querySelector('#typing-indicator .typing-indicator');
            if (typingText) {
                typingText.innerHTML = `<span>網路不穩，正在嘗試恢復連線 (${retryCount}/${maxRetries})...</span>`;
            }
            
            await retryDelay(nextRetryDelay);
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

function formatMessage(text) {
    if (!text) return "";
    // Added safety check and String cast to prevent .replace failure on null/undefined
    let html = String(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

function wrapWordsWithHover(text) {
    if (!text) return "";
    
    // Safety check for null text
    const safeText = String(text);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = safeText;
    
    const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let n;
    while(n = walk.nextNode()) {
        textNodes.push(n);
    }
    
    textNodes.forEach(node => {
        const textContent = node.nodeValue;
        if (textContent && /[A-Za-z]/.test(textContent)) {
            const span = document.createElement('span');
            // Added check to ensure textContent is not null before replace
            span.innerHTML = textContent.replace(/([A-Za-z]+(?:'[A-Za-z]+)?)/g, '<span class="hover-word" data-word="$1">$1</span>');
            node.parentNode.replaceChild(span, node);
        }
    });
    
    return tempDiv.innerHTML;
}

function updateUserProfile(newFacts) {
    if (!newFacts || newFacts.toLowerCase() === 'null') return;
    
    let currentProfile = localStorage.getItem('speakAi_userProfile') || "";
    
    // Simple deduplication and merging
    // We append the new facts to the current profile
    // In a more advanced version, we could use another AI call to consolidate the profile
    const timestamp = new Date().toLocaleDateString();
    const updatedLine = `[Learned on ${timestamp}]: ${newFacts}`;
    
    let profileLines = currentProfile ? currentProfile.split('\n') : [];
    profileLines.push(updatedLine);
    
    // Keep only the most recent 15 facts to prevent context bloat
    if (profileLines.length > 15) {
        profileLines = profileLines.slice(-15);
    }
    
    localStorage.setItem('speakAi_userProfile', profileLines.join('\n'));
}
