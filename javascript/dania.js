const GEMINI_API_KEY = "AIzaSyAWTHUy29_WI71puaKYoei9H62ryBqWqFQ"; 
const MODEL_NAME = "gemini-2.5-flash";
const SYSTEM_INSTRUCTION = "Responda de forma natural e útil, sem limite de caracteres.";

const dania = document.querySelector('.dania');
const daniaToggleButton = document.querySelector('.dania > button.dania-toggle');
const daniaPromptArea = document.querySelector('.dania-prompt'); 
const daniaInput = document.querySelector('.dania-form input[type=\"text\"]');
const daniaSendButton = document.querySelector('.dania-form button[type=\"button\"]'); 

const CLOSE_ICON_HTML = '<i class=\"bi bi-x\"></i>'; 
const DANIA_TEXT = 'DAN-IA';

if (dania && daniaToggleButton && daniaPromptArea && daniaInput && daniaSendButton) {
    daniaToggleButton.innerHTML = DANIA_TEXT;

    daniaToggleButton.addEventListener('click', () => {
        dania.classList.toggle('toggle'); 
        const isDaniaOpen = dania.classList.contains('toggle');
        if (isDaniaOpen) {
            daniaToggleButton.innerHTML = CLOSE_ICON_HTML;
            daniaInput.focus();
        } else {
            daniaToggleButton.innerHTML = DANIA_TEXT;
            daniaPromptArea.value = "Em desenvolvimento...";
            daniaInput.value = '';
        }
    });

    function removeEmojis(text) {
        return text.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2011-\u26FF])/g,
            ''
        );
    }

    async function getGeminiResponse(prompt) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
        const payload = {
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }],
            systemInstruction: {
                role: 'system',
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            generationConfig: {
                temperature: 0.8
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = `Erro ${response.status}: Falha na requisição.`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorMessage;
            } catch {}
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";
        return text;
    }

    async function typeWriterEffect(element, text, speed = 20) {
        element.value = "";
        for (let i = 0; i < text.length; i++) {
            element.value += text.charAt(i);
            element.scrollTop = element.scrollHeight; 
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    async function handleSend() {
        let prompt = daniaInput.value.trim();
        if (!prompt) return;
        prompt = removeEmojis(prompt);

        daniaPromptArea.value = '';
        daniaInput.value = '';
        daniaInput.setAttribute('disabled', 'true');
        daniaSendButton.setAttribute('disabled', 'true');
        daniaPromptArea.setAttribute('placeholder', 'Pensando...');

        try {
            const text = await getGeminiResponse(prompt);
            await typeWriterEffect(daniaPromptArea, text, 15);
        } catch (error) {
            daniaPromptArea.value = `\n\nErro de Conexão/API: ${error.message}`;
            console.error("Erro da API Gemini (Fetch):", error);
        } finally {
            daniaInput.removeAttribute('disabled');
            daniaSendButton.removeAttribute('disabled');
            daniaPromptArea.setAttribute('placeholder', 'Pergunte...');
            daniaInput.focus();
        }
    }

    daniaSendButton.addEventListener('click', handleSend);
    daniaInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    });

} else {
    console.error('Erro: Um ou mais elementos do DAN-IA não foram encontrados no DOM.');
}
