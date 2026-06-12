/**
 * AgroFuturo 2026 - Scripts de Interatividade e Acessibilidade
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- GERENCIAMENTO DE ACESSIBILIDADE: FONTE ---
    let currentFontSizePercentage = 100;
    const btnIncreaseFont = document.getElementById('btn-increase-font');
    const btnDecreaseFont = document.getElementById('btn-decrease-font');

    btnIncreaseFont.addEventListener('click', () => {
        if (currentFontSizePercentage < 140) {
            currentFontSizePercentage += 10;
            document.documentElement.style.fontSize = `${currentFontSizePercentage}%`;
        }
    });

    btnDecreaseFont.addEventListener('click', () => {
        if (currentFontSizePercentage > 80) {
            currentFontSizePercentage -= 10;
            document.documentElement.style.fontSize = `${currentFontSizePercentage}%`;
        }
    });

    // --- GERENCIAMENTO DE ACESSIBILIDADE: MODO CLARO/ESCURO ---
    const btnToggleTheme = document.getElementById('btn-toggle-theme');
    
    // Checar preferência prévia ou do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }

    btnToggleTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // --- GERENCIAMENTO DE ACESSIBILIDADE: LEITURA POR VOZ (SpeechSynthesis) ---
    const btnSpeech = document.getElementById('btn-speech');
    let isSpeaking = false;
    let speechUtterance = null;

    btnSpeech.addEventListener('click', () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            btnSpeech.textContent = '🔊';
            btnSpeech.setAttribute('aria-label', 'Iniciar leitura por voz');
        } else {
            // Coletar apenas o conteúdo textual do escopo principal requisitado
            const mainContent = document.getElementById('main-content');
            if (!mainContent) return;

            // Extrair textos de forma limpa ignorando elementos vazios ou scripts
            const textToRead = mainContent.innerText;

            speechUtterance = new SpeechSynthesisUtterance(textToRead);
            speechUtterance.lang = 'pt-BR';
            speechUtterance.rate = 1.0;

            speechUtterance.onend = () => {
                isSpeaking = false;
                btnSpeech.textContent = '🔊';
            };

            speechUtterance.onerror = () => {
                isSpeaking = false;
                btnSpeech.textContent = '🔊';
            };

            window.speechSynthesis.speak(speechUtterance);
            isSpeaking = true;
            btnSpeech.textContent = '🛑';
            btnSpeech.setAttribute('aria-label', 'Parar leitura por voz');
        }
    });

    // Cancelar voz se o usuário fechar ou mudar de página repentinamente
    window.addEventListener('beforeunload', () => {
        window.speechSynthesis.cancel();
    });

    // --- INTERAÇÃO COM O LEITOR: SESSÃO DE COMENTÁRIOS ---
    const commentForm = document.getElementById('comment-form');
    const txtComment = document.getElementById('txt-comment');
    const commentsList = document.getElementById('comments-list');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const commentValue = txtComment.value.trim();
        if (commentValue === '') return;

        // Criar elemento de comentário dinamicamente estruturado e acessível
        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        
        // Formatação da data atual simplificada
        const now = new Date();
        const timeString = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        newComment.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">Leitor Anônimo (Você)</span>
                <span class="comment-date">${timeString}</span>
            </div>
            <p class="comment-body">${escapeHTML(commentValue)}</p>
        `;

        // Inserir no topo da lista de comentários
        commentsList.insertBefore(newComment, commentsList.firstChild);

        // Limpar o formulário de forma amigável
        txtComment.value = '';
    });

    // Função auxiliar para evitar vulnerabilidade de XSS nos comentários inseridos
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