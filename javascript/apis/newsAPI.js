// RSS Feeds da área da saúde (públicos)
const RSS_FEEDS = {
    SAUDE_PT: 'https://www.sns.gov.pt/feed/',
    OMS: 'https://www.who.int/rss-feeds/news-pt.xml',
    NIH: 'https://www.nih.gov/rss/health/health-news.xml',
    CACA_SUGERIDAS: 'https://www.news-medical.net/newsrss.ashx'
};

// Feed padrão (usamos um serviço de proxy gratuito para converter RSS para JSON)
const PROXY_URL = 'https://api.rss2json.com/v1/api.json?rss_url=';

let noticiasAtuais = [];

/**
 * Carrega e exibe as notícias quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    inicializarNewsSection();
    carregarNoticias();
});

/**
 * Inicializa a secção de notícias
 */
function inicializarNewsSection() {
    const btnRefresh = document.getElementById('atualizar-noticias');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', function() {
            carregarNoticias(true);
        });
    }
}

/**
 * Carrega notícias de um RSS feed
 * @param {string} feedUrl - URL do RSS feed
 * @returns {Promise<Array>} - Lista de notícias
 */
async function carregarNoticiasDeRSS(feedUrl) {
    try {
        const url = PROXY_URL + encodeURIComponent(feedUrl);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dados = await response.json();

        if (dados && dados.items && dados.items.length > 0) {
            return dados.items.map(item => ({
                titulo: item.title || 'Sem título',
                descricao: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                link: item.link || '#',
                data: item.pubDate ? new Date(item.pubDate).toLocaleDateString('pt-PT') : 'Data desconhecida',
                fonte: dados.feed?.title || 'Fonte de saúde'
            }));
        }

        return [];

    } catch (error) {
        console.error('Erro ao carregar RSS feed:', error);
        return [];
    }
}

/**
 * Carrega notícias de múltiplas fontes e combina
 * @returns {Promise<Array>}
 */
async function carregarMultiplasFontes() {
    // Tentar carregar de múltiplas fontes
    const fontes = [
        RSS_FEEDS.SAUDE_PT,
        'https://www.medscape.com/rss/all',
        'https://www.news-medical.net/newsrss.ashx'
    ];

    let todasNoticias = [];

    for (const fonte of fontes) {
        try {
            const noticias = await carregarNoticiasDeRSS(fonte);
            todasNoticias = [...todasNoticias, ...noticias];

            // Limitar para não sobrecarregar
            if (todasNoticias.length >= 12) break;

        } catch (error) {
            console.warn(`Erro ao carregar fonte: ${fonte}`, error);
        }
    }

    // Se não conseguiu carregar nenhuma notícia, usar dados mock
    if (todasNoticias.length === 0) {
        todasNoticias = getNoticiasMock();
    }

    // Ordenar por data (mais recentes primeiro)
    todasNoticias.sort((a, b) => {
        if (a.data === 'Data desconhecida') return 1;
        if (b.data === 'Data desconhecida') return -1;
        return new Date(b.data) - new Date(a.data);
    });

    return todasNoticias.slice(0, 12);
}

/**
 * Retorna notícias mock em caso de falha na API
 * @returns {Array}
 */
function getNoticiasMock() {
    return [
        {
            titulo: 'CACA lança novo programa de investigação em saúde pública',
            descricao: 'O Centro Académico Clínico dos Açores anuncia um novo programa focado na investigação em saúde pública regional.',
            link: '#',
            data: new Date().toLocaleDateString('pt-PT'),
            fonte: 'CACA Notícias'
        },
        {
            titulo: 'Parceria estratégica com hospitais dos Açores',
            descricao: 'Novas parcerias vão permitir maior integração entre a academia e os serviços clínicos da região.',
            link: '#',
            data: new Date(Date.now() - 86400000).toLocaleDateString('pt-PT'),
            fonte: 'CACA Notícias'
        },
        {
            titulo: 'Workshop de Inteligência Artificial em Saúde',
            descricao: 'Inscrições abertas para o workshop que aborda as aplicações de IA na área da saúde.',
            link: '#',
            data: new Date(Date.now() - 172800000).toLocaleDateString('pt-PT'),
            fonte: 'Formação CACA'
        },
        {
            titulo: 'Estudo revela avanços na reabilitação pós-cirúrgica',
            descricao: 'Investigadores do CACA publicam estudo inovador sobre técnicas de reabilitação.',
            link: '#',
            data: new Date(Date.now() - 259200000).toLocaleDateString('pt-PT'),
            fonte: 'Investigação CACA'
        },
        {
            titulo: 'Webinar: Saúde Mental em Contexto Académico',
            descricao: 'Evento online gratuito sobre saúde mental para estudantes universitários.',
            link: '#',
            data: new Date(Date.now() - 345600000).toLocaleDateString('pt-PT'),
            fonte: 'Eventos CACA'
        },
        {
            titulo: 'Bolsa de investigação para jovens cientistas',
            descricao: 'O CACA abre candidaturas para bolsas de investigação na área das ciências médicas.',
            link: '#',
            data: new Date(Date.now() - 432000000).toLocaleDateString('pt-PT'),
            fonte: 'Oportunidades CACA'
        }
    ];
}

/**
 * Carrega e exibe as notícias na página
 * @param {boolean} forcarRefresh - Força recarregamento das notícias
 */
async function carregarNoticias(forcarRefresh = false) {
    const container = document.getElementById('noticias-container');
    const loadingMsg = document.getElementById('noticias-loading');
    const errorMsg = document.getElementById('noticias-erro');

    if (!container) return;

    // Mostrar loading
    if (loadingMsg) loadingMsg.style.display = 'block';
    if (errorMsg) errorMsg.style.display = 'none';
    container.innerHTML = '';

    try {
        let noticias;

        if (forcarRefresh || noticiasAtuais.length === 0) {
            noticias = await carregarMultiplasFontes();
            noticiasAtuais = noticias;
        } else {
            noticias = noticiasAtuais;
        }

        if (loadingMsg) loadingMsg.style.display = 'none';

        if (noticias.length === 0) {
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'Não foi possível carregar as notícias. Tente novamente mais tarde.';
            }
            return;
        }

        // Exibir notícias
        noticias.forEach(noticia => {
            const card = document.createElement('div');
            card.className = 'noticia-card';

            card.innerHTML = `
                <div class="noticia-card-content">
                    <div class="noticia-fonte">${noticia.fonte}</div>
                    <h3 class="noticia-titulo">${noticia.titulo}</h3>
                    <p class="noticia-descricao">${noticia.descricao}</p>
                    <div class="noticia-footer">
                        <span class="noticia-data">📅 ${noticia.data}</span>
                        <a href="${noticia.link}" target="_blank" rel="noopener noreferrer" class="noticia-link">Ler mais →</a>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        if (loadingMsg) loadingMsg.style.display = 'none';
        if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Erro ao carregar notícias. A usar dados de demonstração.';
        }

        // Fallback para dados mock
        mostrarNoticiasMock(container);
    }
}

/**
 * Mostra notícias mock em caso de erro
 * @param {HTMLElement} container
 */
function mostrarNoticiasMock(container) {
    const mockNoticias = getNoticiasMock();

    mockNoticias.forEach(noticia => {
        const card = document.createElement('div');
        card.className = 'noticia-card';

        card.innerHTML = `
            <div class="noticia-card-content">
                <div class="noticia-fonte">📰 ${noticia.fonte}</div>
                <h3 class="noticia-titulo">${noticia.titulo}</h3>
                <p class="noticia-descricao">${noticia.descricao}</p>
                <div class="noticia-footer">
                    <span class="noticia-data">📅 ${noticia.data}</span>
                    <span class="noticia-link demo">(Demo)</span>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}