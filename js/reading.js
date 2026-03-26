// Daily Reading Practice Logic

const READING_ARTICLES = [
    { id: 'r1', level: 'beginner', title: 'The Joy of Cooking', content: 'Cooking is a wonderful way to express creativity. Many people find it relaxing to prepare a meal for their friends and family. Using fresh ingredients makes a big difference in the final taste.' },
    { id: 'r2', level: 'beginner', title: 'Morning Routine', content: 'A good morning routine can set the tone for the entire day. Some people like to exercise first thing, while others prefer a quiet moment with a cup of coffee and a book.' },
    { id: 'r3', level: 'intermediate', title: 'Traveling the World', content: 'Traveling allows us to experience different cultures and traditions. It broadens our horizons and helps us understand the world from a new perspective.' },
    { id: 'r4', level: 'intermediate', title: 'Benefits of Exercise', content: 'Regular physical activity is essential for maintaining good health. It not only strengthens the body but also improves mental well-being and reduces stress.' },
    { id: 'r5', level: 'beginner', title: 'The Power of Reading', content: 'Reading books is a great way to gain knowledge and improve vocabulary. Whether it is fiction or non-fiction, every book offers a unique journey for the mind.' },
    { id: 'r6', level: 'intermediate', title: 'Exploring Nature', content: 'Spending time in nature has a profound impact on our mental health. It helps reduce stress and anxiety while improving our overall mood and physical vitality.' },
    { id: 'r7', level: 'advanced', title: 'The Impact of Technology', content: 'Technology has revolutionized the way we live and work. While it brings incredible convenience, we must also be mindful of its effects on our daily interactions.' },
    { id: 'r8', level: 'beginner', title: 'Healthy Eating Habits', content: 'Eating a balanced diet provides the essential nutrients our bodies need to function. Incorporating more fruits and vegetables is a simple step towards long-term wellness.' },
    { id: 'r9', level: 'advanced', title: 'Learning a New Language', content: 'Studying a foreign language is a rewarding challenge that opens up new opportunities. It improves memory and connects us to different people around the globe.' },
    { id: 'r10', level: 'intermediate', title: 'The Art of Photography', content: 'Photography allows us to capture fleeting moments and preserve them forever. It teaches us to look at ordinary scenes with a more creative and observant eye.' },
    { id: 'r11', level: 'intermediate', title: 'Music and Emotion', content: 'Music has a unique ability to evoke strong emotions and memories. Whether playing an instrument or just listening, it connects people across different cultures.' },
    { id: 'r12', level: 'beginner', title: "A Good Night's Sleep", content: 'Quality sleep is critical for our mental and physical restoration. Establishing a consistent bedtime routine can significantly improve our daily energy levels.' },
    { id: 'r13', level: 'advanced', title: 'The Wonders of the Ocean', content: 'The ocean covers most of our planet and is home to countless incredible creatures. Protecting marine ecosystems is vital for the future of Earth.' },
    { id: 'r14', level: 'advanced', title: 'Space Exploration', content: 'Humanity has always looked up at the stars with a sense of wonder. Space exploration pushes the boundaries of our knowledge and inspires future generations.' },
    { id: 'r15', level: 'intermediate', title: 'The Magic of Movies', content: 'Cinema is a powerful storytelling medium that can transport us to different worlds. A truly great movie leaves a lasting impact long after the credits roll.' },
    { id: 'r16', level: 'advanced', title: 'Overcoming Obstacles', content: 'Life is full of unexpected challenges and difficulties. Facing these obstacles builds resilience and ultimately makes us stronger and more capable individuals.' },
    { id: 'r17', level: 'intermediate', title: 'The Beauty of Autumn', content: 'Autumn is a season of transition, marked by crisp air and falling leaves. Watching the trees change color reminds us of the natural cycle of life.' },
    { id: 'r18', level: 'beginner', title: 'Adopting a Pet', content: 'Bringing a pet into your home offers companionship and unconditional love. Caring for an animal also teaches responsibility and empathy to children and adults alike.' },
    { id: 'r19', level: 'beginner', title: 'The Importance of Friendship', content: 'Good friends provide support during difficult times and celebrate our successes. Nurturing these relationships is one of the most rewarding parts of life.' },
    { id: 'r20', level: 'intermediate', title: 'Time Management', content: 'Effectively managing your time reduces stress and increases productivity. Creating a daily schedule helps you focus on what is truly important without feeling overwhelmed.' },
    { id: 'r21', level: 'intermediate', title: 'The World of Coffee', content: 'For many, coffee is more than just a morning beverage; it is a ritual. The rich aroma and diverse brewing methods make it a fascinating subject to explore.' },
    { id: 'r22', level: 'intermediate', title: 'Historical Landmarks', content: 'Visiting ancient ruins and historical monuments connects us to the past. These incredible structures tell stories of civilizations that existed long before our time.' },
    { id: 'r23', level: 'beginner', title: 'Staying Positive', content: 'Maintaining a positive outlook can completely change how you experience life. Focusing on gratitude helps shift our perspective towards the good things we often overlook.' },
    { id: 'r24', level: 'beginner', title: 'The Joy of Gardening', content: 'Planting seeds and watching them grow is an incredibly satisfying process. Gardening teaches patience and rewards us with beautiful flowers and fresh vegetables.' },
    { id: 'r25', level: 'intermediate', title: 'Embracing Change', content: 'Change is an inevitable part of life that often brings anxiety. However, learning to adapt allows us to discover new paths and unexpected opportunities.' },
    { id: 'r26', level: 'beginner', title: 'The Art of Listening', content: 'Active listening is a crucial skill for effective communication. When we truly listen, we make others feel valued and build deeper, more meaningful connections.' },
    { id: 'r27', level: 'beginner', title: 'City Life vs Countryside', content: 'Living in a bustling city offers convenience and endless entertainment options. On the other hand, the countryside provides a peaceful environment and a slower pace.' },
    { id: 'r28', level: 'intermediate', title: 'Financial Literacy', content: 'Understanding how to manage money is a vital life skill. Budgeting and saving for the future provide security and freedom to make necessary life choices.' },
    { id: 'r29', level: 'advanced', title: 'The Evolution of Transport', content: 'From horse-drawn carriages to high-speed bullet trains, transportation has evolved rapidly. These innovations have made the world feel much smaller and more connected.' },
    { id: 'r30', level: 'beginner', title: 'Local Cuisine', content: 'Trying local dishes is one of the best parts of traveling. Food reflects the history, geography, and spirit of the people who live in a particular region.' },
    { id: 'r31', level: 'intermediate', title: 'The Role of Museums', content: 'Museums serve as guardians of human history and cultural heritage. They provide an educational space where generations can learn from the artifacts of the past.' },
    { id: 'r32', level: 'advanced', title: 'Public Speaking', content: 'Speaking in front of an audience is a common fear for many people. With practice and preparation, it can become a powerful tool for sharing ideas.' },
    { id: 'r33', level: 'beginner', title: 'The Importance of Hobbies', content: 'Engaging in a hobby provides a healthy escape from daily responsibilities. Whether it is painting or playing sports, hobbies bring balance and joy to our routines.' },
    { id: 'r34', level: 'advanced', title: 'Protecting the Environment', content: 'Climate change is one of the most pressing issues of our time. Simple actions like recycling and reducing plastic use can make a significant difference.' },
    { id: 'r35', level: 'intermediate', title: 'The Rise of E-sports', content: 'Competitive video gaming has grown into a massive global industry. Today, professional gamers train for hours and compete in huge arenas for millions of dollars.' },
    { id: 'r36', level: 'beginner', title: 'Fitness at Home', content: 'Working out at home has become incredibly popular due to its convenience. With just a yoga mat and some instructional videos, anyone can stay active without a gym.' },
    { id: 'r37', level: 'beginner', title: 'The Joy of Bicycling', content: 'Riding a bicycle is an eco-friendly and enjoyable way to commute. It allows you to skip traffic jams while getting a great workout at the same time.' },
    { id: 'r38', level: 'beginner', title: 'Traditional Festivals', content: 'Celebrating traditional festivals brings families and communities together. These events are often marked by special foods, vibrant decorations, and beautiful cultural performances.' },
    { id: 'r39', level: 'advanced', title: 'Mindfulness Practices', content: 'Practicing mindfulness helps us stay focused on the present moment. Taking a few minutes to breathe deeply can clear our minds and improve emotional stability.' },
    { id: 'r40', level: 'advanced', title: 'The Future of AI', content: 'Artificial intelligence is advancing at an unprecedented rate. It holds the potential to solve complex problems, but also raises important ethical questions for society.' }
];

let currentArticle = null;
let readingRecognition = null;
let isReadingRecording = false;
let accumulatedTranscript = "";
let currentInterim = "";

document.addEventListener('DOMContentLoaded', () => {
    initReading();
    
    // Listen for level changes
    window.AppEventBus.on('user-level-updated', () => {
        manualArticleIndex = -1; // Reset manual selection
        renderDailyArticle();
    });
});

let manualArticleIndex = -1;

function initReading() {
    renderDailyArticle();
    
    const listenBtn = document.getElementById('listen-reading-btn');
    const startBtn = document.getElementById('start-reading-btn');
    const refreshBtn = document.getElementById('refresh-reading-btn');
    
    if (listenBtn) {
        listenBtn.addEventListener('click', () => {
            if (currentArticle && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(currentArticle.content);
                utterance.lang = 'en-US';
                utterance.rate = parseFloat(localStorage.getItem('speech_speed') || '0.85');
                window.speechSynthesis.speak(utterance);
            }
        });
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', toggleReadingRecording);
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('fa-spin');
            
            const level = localStorage.getItem('user_level') || 'intermediate';
            const filteredArticles = READING_ARTICLES.filter(a => a.level === level);
            const db = filteredArticles.length > 0 ? filteredArticles : READING_ARTICLES;

            // Randomly select another one different from the current
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * db.length);
            } while (nextIndex === db.indexOf(currentArticle) && db.length > 1);
            
            manualArticleIndex = nextIndex;
            
            setTimeout(() => {
                renderDailyArticle();
                icon.classList.remove('fa-spin');
            }, 500);
        });
    }
    
    initReadingSpeechRecognition();
}

function getDailyArticle() {
    const level = localStorage.getItem('user_level') || 'intermediate';
    const filteredArticles = READING_ARTICLES.filter(a => a.level === level);
    const db = filteredArticles.length > 0 ? filteredArticles : READING_ARTICLES;

    if (manualArticleIndex >= 0 && manualArticleIndex < db.length) {
        return db[manualArticleIndex];
    }

    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const twTime = new Date(utc + (3600000 * 8));
    
    // Logical date (starts at 6am)
    const logicalDate = new Date(twTime.getTime() - (6 * 3600000)).toLocaleDateString();
    
    // Use the logical date string to create a seed
    let seed = 0;
    for (let i = 0; i < logicalDate.length; i++) {
        seed += logicalDate.charCodeAt(i);
    }
    
    const index = seed % db.length;
    return db[index];
}

function renderDailyArticle() {
    const titleEl = document.getElementById('reading-article-title');
    const textEl = document.getElementById('reading-article-text');
    const feedbackContainer = document.getElementById('reading-feedback-container');
    const transContainer = document.getElementById('reading-article-translation');
    
    if (!titleEl || !textEl) return;
    
    currentArticle = getDailyArticle();
    titleEl.textContent = currentArticle.title;
    
    // Convert words to hoverable elements so user can click to pronounce/save
    if (typeof window.wrapWordsWithHover === 'function') {
        textEl.innerHTML = window.wrapWordsWithHover(currentArticle.content);
    } else {
        textEl.textContent = currentArticle.content;
    }
    
    if (feedbackContainer) {
        feedbackContainer.classList.add('hidden');
        feedbackContainer.innerHTML = '';
    }
    
    // Fetch Full Text Translation
    if (transContainer) {
        transContainer.classList.remove('hidden');
        transContainer.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 正在翻譯此短文...';
        
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(currentArticle.content)}`)
            .then(res => res.json())
            .then(data => {
                let fullTrans = '';
                if (data && data[0]) {
                    data[0].forEach(item => {
                        if (item[0]) fullTrans += item[0];
                    });
                }
                transContainer.innerHTML = fullTrans || '翻譯暫時無法使用。';
            })
            .catch(err => {
                transContainer.innerHTML = '翻譯失敗，請檢查網路狀態。';
                console.error(err);
            });
    }
}

function initReadingSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    readingRecognition = new SpeechRecognition();
    readingRecognition.lang = 'en-US';
    readingRecognition.continuous = true;
    readingRecognition.interimResults = true;
    readingRecognition.maxAlternatives = 1;
    
    readingRecognition.onstart = () => {
        isReadingRecording = true;
        accumulatedTranscript = "";
        currentInterim = "";
        const startBtn = document.getElementById('start-reading-btn');
        if (startBtn) {
            startBtn.innerHTML = '<i class="fa-solid fa-stop"></i> 停止錄音並分析';
            startBtn.classList.add('recording');
        }
        
        // Show live feedback
        const container = document.getElementById('reading-feedback-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fa-solid fa-microphone fa-beat" style="color: var(--primary); font-size: 2em; margin-bottom: 15px;"></i>
                    <p>正在連續聆聽中... (請手動按下停止按鈕來結束並分析)</p>
                    <p id="live-transcript" style="color: var(--text-secondary); margin-top: 15px; font-style: italic; min-height: 24px; font-size: 1.1em;"></p>
                </div>
            `;
            container.classList.remove('hidden');
        }
    };
    
    readingRecognition.onresult = (event) => {
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
            accumulatedTranscript += finalChunk + " ";
        }
        currentInterim = interimText;
        
        const liveEl = document.getElementById('live-transcript');
        if (liveEl) {
            liveEl.textContent = accumulatedTranscript + interimText;
        }
    };
    
    readingRecognition.onerror = (event) => {
        console.error("Reading recognition error", event.error);
        if (event.error !== 'aborted') {
            stopReadingRecording();
            const container = document.getElementById('reading-feedback-container');
            if (container) {
                container.innerHTML = `<div style="text-align: center; padding: 20px;"><p style="color: var(--error);">錄音發生錯誤：${event.error}。請重試。</p></div>`;
            }
        }
    };
    
    readingRecognition.onend = () => {
        if (isReadingRecording) {
            // Unexpected stop (e.g. browser max duration or sudden silence)
            stopReadingRecording();
            const finalTranscript = (accumulatedTranscript + " " + currentInterim).trim();
            if (finalTranscript.length > 0) {
                analyzePronunciation(finalTranscript);
            } else {
                const container = document.getElementById('reading-feedback-container');
                if (container) {
                    container.innerHTML = '<div style="text-align: center; padding: 20px;"><p>未偵測到完整語音，請再試一次。</p></div>';
                }
            }
        }
    };
}

function toggleReadingRecording() {
    if (!readingRecognition) {
        alert("您的瀏覽器不支援語音識別功能。");
        return;
    }
    
    if (isReadingRecording) {
        readingRecognition.stop();
        stopReadingRecording();
        const finalTranscript = (accumulatedTranscript + " " + currentInterim).trim();
        if (finalTranscript.length > 0) {
            analyzePronunciation(finalTranscript);
        } else {
            const container = document.getElementById('reading-feedback-container');
            if (container) {
                container.innerHTML = '<div style="text-align: center; padding: 20px;"><p>未偵測到完整語音，請再試一次。</p></div>';
            }
        }
    } else {
        // Hide previous feedback
        document.getElementById('reading-feedback-container').classList.add('hidden');
        try {
            readingRecognition.start();
        } catch(e) {
            console.error(e);
        }
    }
}

function stopReadingRecording() {
    isReadingRecording = false;
    const startBtn = document.getElementById('start-reading-btn');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> 開始錄音練習';
        startBtn.classList.remove('recording');
    }
}

function analyzePronunciation(transcript) {
    if (!currentArticle) return;
    
    // Added null checks to avoid "Cannot read properties of null (reading 'toLowerCase')"
    const original = (currentArticle.content || "").toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const spoken = (transcript || "").toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    
    const originalWords = (currentArticle.content || "").split(/\s+/);
    const spokenWords = (transcript || "").toLowerCase().split(/\s+/);
    
    let matchCount = 0;
    const feedbackWords = [];
    
    // Original words (preserving case/punctuation for display)
    const displayWords = currentArticle.content.split(/\s+/);
    
    displayWords.forEach(displayWord => {
        const cleanWord = displayWord.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        if (spokenWords.includes(cleanWord)) {
            matchCount++;
            feedbackWords.push(`<span class="reading-match">${displayWord}</span>`);
        } else {
            feedbackWords.push(`<span class="reading-miss">${displayWord}</span>`);
        }
    });
    
    const score = Math.round((matchCount / originalWords.length) * 100);
    displayReadingFeedback(score, transcript, feedbackWords.join(' '));
}

function displayReadingFeedback(score, transcript, feedbackHtml) {
    const container = document.getElementById('reading-feedback-container');
    if (!container) return;
    
    let advice = "";
    if (score >= 90) {
        advice = "太棒了！您的發音非常準確，語法與語感很好。繼續保持！";
    } else if (score >= 70) {
        advice = "做得很不錯！大部分單字都發音正確。請注意上方<span style='color: var(--error); text-decoration: underline wavy var(--error);'>紅色波浪線</span>標出的單字，可以多聽幾次範文來校正。";
    } else if (score >= 40) {
        advice = "不錯的嘗試！有一些單字沒被偵測到，建議您可以放慢速度朗讀，並注意<span style='color: var(--error); text-decoration: underline wavy var(--error);'>紅色標註</span>的部分。";
    } else {
        advice = "加油！建議先點擊「範文朗讀」多聽幾次，特別注意<span style='color: var(--error); text-decoration: underline wavy var(--error);'>紅色波浪線</span>出現的地方，熟悉後再試一次。";
    }
    
    container.innerHTML = `
        <div class="feedback-score">
            <div class="score-circle">${score}%</div>
            <div class="score-text">
                <strong>練習結果</strong>
                <p>準確度分值</p>
            </div>
        </div>
        <div class="feedback-details">
            <p><strong>原文比對：</strong></p>
            <p style="font-size: 1.1em; line-height: 1.6; margin-bottom: 15px;">${feedbackHtml}</p>
            <p><strong>您的實際完整錄音：</strong></p>
            <p style="font-style: italic; margin-bottom: 15px; color: var(--text-secondary); font-size: 0.9em;">"${transcript}"</p>
            <p><strong>建議：</strong></p>
            <p>${advice}</p>
        </div>
    `;
    
    container.classList.remove('hidden');
    
    // Add click-to-speak functionality for missed words
    const missSpans = container.querySelectorAll('.reading-miss');
    missSpans.forEach(span => {
        span.style.cursor = 'pointer';
        span.title = '點擊聽發音';
        
        // Add a small hover effect class dynamically or just inline transition
        span.style.transition = 'opacity 0.2s';
        span.addEventListener('mouseover', () => span.style.opacity = '0.7');
        span.addEventListener('mouseout', () => span.style.opacity = '1');
        
        span.addEventListener('click', () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const wordToSpeak = span.textContent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                const utterance = new SpeechSynthesisUtterance(wordToSpeak);
                utterance.lang = 'en-US';
                utterance.rate = parseFloat(localStorage.getItem('speech_speed') || '0.85');
                window.speechSynthesis.speak(utterance);
            }
        });
    });
}
