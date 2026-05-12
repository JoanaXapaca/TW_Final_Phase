/**
 * Inicializa o formulário de newsletter
 */
document.addEventListener('DOMContentLoaded', function() {
    inicializarNewsletter();
});

/**
 * Configura o formulário de newsletter
 */
function inicializarNewsletter() {
    const formNewsletter = document.getElementById('form-newsletter');
    if (formNewsletter) {
        formNewsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            subscreverNewsletter();
        });
    }
}

/**
 * Valida o formato do email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function validarEmailNewsletter(email) {
    const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida o nome
 * @param {string} nome - Nome a validar
 * @returns {boolean}
 */
function validarNome(nome) {
    return nome.trim().length >= 2;
}

/**
 * Submete a subscrição da newsletter
 */
async function subscreverNewsletter() {
    const nome = document.getElementById('newsletter-nome').value.trim();
    const email = document.getElementById('newsletter-email').value.trim();

    // Validações
    if (!validarNome(nome)) {
        mostrarMensagemNewsletter('Por favor, insira um nome válido (mínimo 2 caracteres)', 'erro');
        return;
    }

    if (!validarEmailNewsletter(email)) {
        mostrarMensagemNewsletter('Por favor, insira um email válido', 'erro');
        return;
    }

    try {
        await adicionarSubscritor({ nome, email });
        mostrarMensagemNewsletter(`Obrigado ${nome}! Subscrição confirmada com sucesso!`, 'sucesso');
        limparFormularioNewsletter();

        // Opcional: Mostrar número total de subscritores
        await atualizarContadorSubscritores();
    } catch (error) {
        mostrarMensagemNewsletter(error, 'erro');
    }
}

/**
 * Mostra mensagem de feedback
 * @param {string} mensagem - Mensagem a mostrar
 * @param {string} tipo - 'sucesso' ou 'erro'
 */
function mostrarMensagemNewsletter(mensagem, tipo) {
    const msgDiv = document.getElementById('newsletter-mensagem');
    if (msgDiv) {
        msgDiv.textContent = mensagem;
        msgDiv.className = `newsletter-mensagem ${tipo}`;
        msgDiv.style.display = 'block';

        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 4000);
    }
}

/**
 * Limpa o formulário da newsletter
 */
function limparFormularioNewsletter() {
    document.getElementById('newsletter-nome').value = '';
    document.getElementById('newsletter-email').value = '';
}

/**
 * Atualiza o contador de subscritores (opcional)
 */
async function atualizarContadorSubscritores() {
    try {
        const subscritores = await obterTodosSubscritores();
        const contadorSpan = document.getElementById('newsletter-contador');
        if (contadorSpan) {
            contadorSpan.textContent = subscritores.length;
        }
    } catch (error) {
        console.error('Erro ao atualizar contador:', error);
    }
}