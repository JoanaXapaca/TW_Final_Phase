let eventoEditandoId = null;

/**
 * Inicializa o gestor de eventos quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventManager();
    carregarEventos();
});

/**
 * Configura os event listeners do formulário de eventos
 */
function inicializarEventManager() {
    const formEvento = document.getElementById('form-evento');
    if (formEvento) {
        formEvento.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarEvento();
        });
    }

    const btnCancelarEdicao = document.getElementById('cancelar-edicao');
    if (btnCancelarEdicao) {
        btnCancelarEdicao.addEventListener('click', function() {
            cancelarEdicao();
        });
    }
}

/**
 * Salva um evento (adiciona ou atualiza)
 */
async function salvarEvento() {
    const titulo = document.getElementById('evento-titulo').value.trim();
    const descricao = document.getElementById('evento-descricao').value.trim();
    const data = document.getElementById('evento-data').value;
    const hora = document.getElementById('evento-hora').value;
    const local = document.getElementById('evento-local').value.trim();

    // Validação
    if (!titulo || !descricao || !data || !hora || !local) {
        mostrarMensagemEvento('Por favor, preencha todos os campos!', 'erro');
        return;
    }

    try {
        if (eventoEditandoId) {
            // Atualizar evento existente
            await atualizarEvento(eventoEditandoId, {
                titulo, descricao, data, hora, local
            });
            mostrarMensagemEvento('Evento atualizado com sucesso!', 'sucesso');
            cancelarEdicao();
        } else {
            // Adicionar novo evento
            await adicionarEvento({
                titulo, descricao, data, hora, local
            });
            mostrarMensagemEvento('Evento adicionado com sucesso!', 'sucesso');
            limparFormularioEvento();
        }
        await carregarEventos();
    } catch (error) {
        mostrarMensagemEvento(error, 'erro');
    }
}

/**
 * Carrega e exibe todos os eventos
 */
async function carregarEventos() {
    try {
        const eventos = await obterTodosEventos();
        exibirEventos(eventos);
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        mostrarMensagemEvento('Erro ao carregar eventos', 'erro');
    }
}

/**
 * Exibe os eventos na tabela
 * @param {Array} eventos - Lista de eventos
 */
function exibirEventos(eventos) {
    const tbody = document.getElementById('eventos-lista');
    if (!tbody) return;

    if (eventos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum evento encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = '';

    eventos.forEach(evento => {
        const row = document.createElement('tr');

        // Formatar data
        const dataObj = new Date(evento.data);
        const dataFormatada = dataObj.toLocaleDateString('pt-PT');

        row.innerHTML = `
            <td>${evento.titulo}</td>
            <td>${evento.descricao.substring(0, 50)}${evento.descricao.length > 50 ? '...' : ''}</td>
            <td>${dataFormatada}</td>
            <td>${evento.hora}</td>
            <td>${evento.local}</td>
            <td class="eventos-actions">
                <button onclick="editarEvento(${evento.id})" class="btn-editar">✎</button>
                <button onclick="confirmarRemoverEvento(${evento.id})" class="btn-remover">🛇</button>
                <button onclick="verPrevisaoTempo('${evento.local}', '${evento.data}')" class="btn-tempo">☁</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

/**
 * Preenche o formulário para editar um evento
 * @param {number} id - ID do evento
 */
async function editarEvento(id) {
    try {
        const evento = await obterEventoPorId(id);
        eventoEditandoId = id;

        document.getElementById('evento-titulo').value = evento.titulo;
        document.getElementById('evento-descricao').value = evento.descricao;
        document.getElementById('evento-data').value = evento.data;
        document.getElementById('evento-hora').value = evento.hora;
        document.getElementById('evento-local').value = evento.local;

        document.getElementById('form-evento-titulo').textContent = 'Editar Evento';
        document.getElementById('cancelar-edicao').style.display = 'inline-block';

        // Rolar para o formulário
        document.querySelector('.eventos-form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarMensagemEvento('Erro ao carregar evento para edição', 'erro');
    }
}

/**
 * Confirma e remove um evento
 * @param {number} id - ID do evento
 */
function confirmarRemoverEvento(id) {
    if (confirm('Tem certeza que deseja remover este evento?')) {
        removerEventoHandler(id);
    }
}

/**
 * Remove um evento
 * @param {number} id - ID do evento
 */
async function removerEventoHandler(id) {
    try {
        await removerEvento(id);
        mostrarMensagemEvento('Evento removido com sucesso!', 'sucesso');
        await carregarEventos();
    } catch (error) {
        mostrarMensagemEvento('Erro ao remover evento', 'erro');
    }
}

/**
 * Cancela a edição atual
 */
function cancelarEdicao() {
    eventoEditandoId = null;
    limparFormularioEvento();
    document.getElementById('form-evento-titulo').textContent = 'Adicionar Novo Evento';
    document.getElementById('cancelar-edicao').style.display = 'none';
}

/**
 * Limpa o formulário de eventos
 */
function limparFormularioEvento() {
    document.getElementById('evento-titulo').value = '';
    document.getElementById('evento-descricao').value = '';
    document.getElementById('evento-data').value = '';
    document.getElementById('evento-hora').value = '';
    document.getElementById('evento-local').value = '';
}

/**
 * Mostra mensagem de feedback no formulário de eventos
 * @param {string} mensagem - Mensagem a mostrar
 * @param {string} tipo - 'sucesso' ou 'erro'
 */
function mostrarMensagemEvento(mensagem, tipo) {
    const msgDiv = document.getElementById('evento-mensagem');
    if (msgDiv) {
        msgDiv.textContent = mensagem;
        msgDiv.className = `evento-mensagem ${tipo}`;
        msgDiv.style.display = 'block';

        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 3000);
    }
}

/**
 * Verifica previsão do tempo para um evento (chama API externa)
 * @param {string} local - Local do evento
 * @param {string} data - Data do evento
 */
async function verPrevisaoTempo(local, data) {
    const dataObj = new Date(data);
    const dataFormatada = dataObj.toLocaleDateString('pt-PT');

    mostrarMensagemEvento(`A buscar previsão do tempo para ${local} em ${dataFormatada}...`, 'info');

    try {
        const previsao = await buscarPrevisaoMeteorologica(local, data);

        // Mostrar numa área de previsão
        const previsaoDiv = document.getElementById('previsao-tempo-resultado');
        if (previsaoDiv) {
            previsaoDiv.innerHTML = `
                <div class="previsao-card">
                    <h4>🌤️ Previsão para ${local}</h4>
                    <p><strong>Data:</strong> ${dataFormatada}</p>
                    <p><strong>Condição:</strong> ${previsao.condicao}</p>
                    <p><strong>Temperatura:</strong> ${previsao.temperatura}</p>
                    <p><strong>Humidade:</strong> ${previsao.humidade}</p>
                    <p><strong>Vento:</strong> ${previsao.vento}</p>
                    <small>Fonte: Open-Meteo (API gratuita)</small>
                </div>
            `;
            previsaoDiv.style.display = 'block';

            // Scroll para a previsão
            previsaoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        mostrarMensagemEvento('Previsão do tempo carregada!', 'sucesso');
    } catch (error) {
        mostrarMensagemEvento('Erro ao buscar previsão do tempo: ' + error, 'erro');
    }
}