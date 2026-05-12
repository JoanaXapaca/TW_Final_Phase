let mapaAtual = null;

/**
 * Inicializa o mapa quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    inicializarMapa();
});

/**
 * Inicializa o mapa na div especificada
 */
function inicializarMapa() {
    const mapaDiv = document.getElementById('mapa-container');
    if (!mapaDiv) return;

    // Coordenadas padrão - Açores (Ponta Delgada)
    const coordenadasPadrao = [37.739, -25.668];
    const zoomPadrao = 10;

    // Inicializar o mapa Leaflet
    mapaAtual = L.map('mapa-container').setView(coordenadasPadrao, zoomPadrao);

    // Adicionar camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 8
    }).addTo(mapaAtual);

    console.log('Mapa inicializado com sucesso');
}

/**
 * Centraliza o mapa numa localização específica
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} zoom - Nível de zoom (opcional)
 */
function centralizarMapa(lat, lng, zoom = 13) {
    if (mapaAtual) {
        mapaAtual.setView([lat, lng], zoom);
    }
}

/**
 * Adiciona um marcador ao mapa
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} titulo - Título do marcador
 * @param {string} descricao - Descrição do marcador (opcional)
 * @returns {Object} - O marcador criado
 */
function adicionarMarcador(lat, lng, titulo, descricao = '') {
    if (!mapaAtual) {
        inicializarMapa();
    }

    const marcador = L.marker([lat, lng]).addTo(mapaAtual);

    if (titulo || descricao) {
        const popupConteudo = `<b>${titulo}</b><br>${descricao}`;
        marcador.bindPopup(popupConteudo);
    }

    return marcador;
}

/**
 * Remove todos os marcadores do mapa
 */
function removerTodosMarcadores() {
    if (!mapaAtual) return;

    mapaAtual.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            mapaAtual.removeLayer(layer);
        }
    });
}

/**
 * Geocodificação reversa (obter endereço a partir de coordenadas)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Endereço encontrado
 */
async function obterEnderecoPorCoordenadas(lat, lng) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`;
        const response = await fetch(url);
        const dados = await response.json();

        if (dados && dados.display_name) {
            return dados.display_name;
        }
        return 'Endereço não encontrado';
    } catch (error) {
        console.error('Erro ao obter endereço:', error);
        return 'Erro ao obter endereço';
    }
}

/**
 * Geocodificação (obter coordenadas a partir de um endereço)
 * @param {string} endereco - Endereço a pesquisar
 * @returns {Promise<Object|null>} - { lat, lng, display_name }
 */
async function obterCoordenadasPorEndereco(endereco) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&accept-language=pt&limit=1`;
        const response = await fetch(url);
        const dados = await response.json();

        if (dados && dados.length > 0) {
            return {
                lat: parseFloat(dados[0].lat),
                lng: parseFloat(dados[0].lon),
                display_name: dados[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error('Erro ao obter coordenadas:', error);
        return null;
    }
}

/**
 * Mostra a localização de um evento no mapa
 * @param {string} local - Nome do local do evento
 * @param {string} tituloEvento - Título do evento
 */
async function mostrarLocalEventoNoMapa(local, tituloEvento) {
    const mensagemDiv = document.getElementById('mapa-mensagem');

    if (mensagemDiv) {
        mensagemDiv.textContent = `A procurar localização: ${local}...`;
        mensagemDiv.style.display = 'block';
    }

    try {
        const coordenadas = await obterCoordenadasPorEndereco(local + ', Açores, Portugal');

        if (coordenadas) {
            // Remover marcadores anteriores e centralizar
            removerTodosMarcadores();
            centralizarMapa(coordenadas.lat, coordenadas.lng, 14);
            adicionarMarcador(coordenadas.lat, coordenadas.lng, tituloEvento, local);

            if (mensagemDiv) {
                mensagemDiv.textContent = `📍 Localização encontrada: ${coordenadas.display_name.substring(0, 100)}`;
                mensagemDiv.className = 'mapa-mensagem sucesso';

                setTimeout(() => {
                    mensagemDiv.style.display = 'none';
                }, 3000);
            }
        } else {
            if (mensagemDiv) {
                mensagemDiv.textContent = `Não foi possível encontrar a localização: ${local}`;
                mensagemDiv.className = 'mapa-mensagem erro';

                setTimeout(() => {
                    mensagemDiv.style.display = 'none';
                }, 3000);
            }
        }
    } catch (error) {
        console.error('Erro ao buscar localização:', error);
        if (mensagemDiv) {
            mensagemDiv.textContent = 'Erro ao buscar localização. Tente novamente.';
            mensagemDiv.className = 'mapa-mensagem erro';

            setTimeout(() => {
                mensagemDiv.style.display = 'none';
            }, 3000);
        }
    }
}

/**
 * Pesquisa e mostra localização no mapa
 */
async function pesquisarLocalizacao() {
    const input = document.getElementById('mapa-pesquisa-local');
    if (!input) return;

    const local = input.value.trim();
    if (local === '') {
        alert('Por favor, insira uma localização para pesquisar');
        return;
    }

    await mostrarLocalEventoNoMapa(local, 'Local pesquisado');
}

/**
 * Mostra todos os eventos no mapa
 */
async function mostrarTodosEventosNoMapa() {
    try {
        const eventos = await obterTodosEventos();

        if (!eventos || eventos.length === 0) {
            alert('Não há eventos para mostrar no mapa');
            return;
        }

        removerTodosMarcadores();

        // Centralizar nos Açores
        centralizarMapa(37.739, -25.668, 9);

        let eventosEncontrados = 0;

        for (const evento of eventos) {
            const coordenadas = await obterCoordenadasPorEndereco(evento.local + ', Açores, Portugal');

            if (coordenadas) {
                adicionarMarcador(
                    coordenadas.lat,
                    coordenadas.lng,
                    evento.titulo,
                    `${evento.local}<br>${evento.data} às ${evento.hora}`
                );
                eventosEncontrados++;
            }
        }

        alert(`Foram mostrados ${eventosEncontrados} de ${eventos.length} eventos no mapa`);

    } catch (error) {
        console.error('Erro ao mostrar eventos no mapa:', error);
        alert('Erro ao carregar eventos para o mapa');
    }
}