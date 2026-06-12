/**
 * AgroFuturo - Scripts de Interatividade e Acessibilidade Otimizados
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ACESSIBILIDADE: CONTROLE DE FONTE ---
    let currentFontSizePercentage = 100;
    const btnIncreaseFont = document.getElementById('btn-increase-font');
    const btnDecreaseFont = document.getElementById('btn-decrease-font');

    btnIncreaseFont.addEventListener('click', () => {
        if (currentFontSizePercentage < 130) {
            currentFontSizePercentage += 10;
            document.documentElement.style.fontSize = `${currentFontSizePercentage}%`;
        }
    });

    btnDecreaseFont.addEventListener('click', () => {
        if (currentFontSizePercentage > 90) {
            currentFontSizePercentage -= 10;
            document.documentElement.style.fontSize = `${currentFontSizePercentage}%`;
        }
    });

    // --- ACESSIBILIDADE: INTERMUTABILIDADE DE TEMA ---
    const btnToggleTheme = document.getElementById('btn-toggle-theme');
    
    btnToggleTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // --- ACESSIBILIDADE: LEITURA POR VOZ ---
    const btnSpeech = document.getElementById('btn-speech');
    let isSpeaking = false;
    let speechUtterance = null;

    btnSpeech.addEventListener('click', () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            btnSpeech.textContent = '🔊';
        } else {
            const mainContent = document.getElementById('main-content');
            if (!mainContent) return;

            speechUtterance = new SpeechSynthesisUtterance(mainContent.innerText);
            speechUtterance.lang = 'pt-BR';

            speechUtterance.onend = () => {
                isSpeaking = false;
                btnSpeech.textContent = '🔊';
            };

            window.speechSynthesis.speak(speechUtterance);
            isSpeaking = true;
            btnSpeech.textContent = '🛑';
        }
    });

    // --- FORMULÁRIO DE FEEDBACK DA COMUNIDADE ---
    const commentForm = document.getElementById('comment-form');
    const txtComment = document.getElementById('txt-comment');
    const commentsList = document.getElementById('comments-list');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const commentValue = txtComment.value.trim();
        if (commentValue === '') return;

        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        
        const now = new Date();
        const timeString = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        newComment.innerHTML = `
            <div class="comment-header">
                <span style="font-weight:600; color:#10b981;">Produtor Conectado</span>
                <span>${timeString}</span>
            </div>
            <p class="comment-body">${escapeHTML(commentValue)}</p>
        `;

        commentsList.insertBefore(newComment, commentsList.firstChild);
        txtComment.value = '';
    });

    // Tratamento básico Anti-XSS para o formulário
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});