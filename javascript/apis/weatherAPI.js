/**
 * Busca previsão meteorológica para um local e data
 * @param {string} local - Nome da cidade/local
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {Promise<Object>} - Objeto com a previsão
 */
async function buscarPrevisaoMeteorologica(local, data) {
    try {
        // Limpar e formatar o local para a URL
        const localFormatado = encodeURIComponent(local.trim());

        console.log(`Buscando previsão para: ${local}`);

        // PASSO 1: Converter o nome do local em coordenadas (geocoding)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${localFormatado}&count=1&language=pt&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Local não encontrado');
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;
        const nomeLocal = geoData.results[0].name;
        const paisLocal = geoData.results[0].country || '';

        console.log(`Coordenadas encontradas: ${lat}, ${lon} para ${nomeLocal}`);

        // PASSO 2: Buscar previsão para essas coordenadas
        // Formatar a data para YYYY-MM-DD (sem hora)
        const dataObj = new Date(data);
        const dataStr = dataObj.toISOString().split('T')[0];

        // Open-Meteo retorna previsão para 7 dias
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,wind_speed_10m_max&timezone=auto&forecast_days=7`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Encontrar o índice da data procurada
        let diaIndex = -1;
        for (let i = 0; i < weatherData.daily.time.length; i++) {
            if (weatherData.daily.time[i] === dataStr) {
                diaIndex = i;
                break;
            }
        }

        if (diaIndex === -1) {
            throw new Error('Data fora do período de previsão (máximo 7 dias)');
        }

        // Mapear códigos de condição para descrições em português (mesmo estilo do wttr.in)
        const weatherCodes = {
            0: '☀️ Céu limpo',
            1: '🌤️ Maioritariamente limpo',
            2: '⛅ Parcialmente nublado',
            3: '☁️ Nublado',
            45: '🌫️ Nevoeiro',
            48: '🌫️ Nevoeiro gelado',
            51: '🌧️ Chuvisco leve',
            53: '🌧️ Chuvisco moderado',
            55: '🌧️ Chuvisco denso',
            56: '🌨️ Chuvisco gelado leve',
            57: '🌨️ Chuvisco gelado denso',
            61: '🌧️ Chuva leve',
            63: '🌧️ Chuva moderada',
            65: '🌧️ Chuva intensa',
            66: '🌧️ Chuva gelada leve',
            67: '🌧️ Chuva gelada intensa',
            71: '❄️ Neve leve',
            73: '❄️ Neve moderada',
            75: '❄️ Neve intensa',
            77: '❄️ Grãos de neve',
            80: '🌧️ Aguaceiro leve',
            81: '🌧️ Aguaceiro moderado',
            82: '🌧️ Aguaceiro intenso',
            85: '❄️ Aguaceiro de neve leve',
            86: '❄️ Aguaceiro de neve intenso',
            95: '⛈️ Trovoada',
            96: '⛈️ Trovoada com granizo leve',
            99: '⛈️ Trovoada com granizo intenso'
        };

        const weatherCode = weatherData.daily.weathercode[diaIndex];
        const condicao = weatherCodes[weatherCode] || '🌤️ Informação não disponível';

        // Temperaturas (máxima e mínima)
        const tempMax = weatherData.daily.temperature_2m_max[diaIndex];
        const tempMin = weatherData.daily.temperature_2m_min[diaIndex];
        const temperatura = `${Math.round(tempMin)}°C / ${Math.round(tempMax)}°C`;

        // Probabilidade de precipitação
        const probChuva = weatherData.daily.precipitation_probability_max[diaIndex];
        const humidade = probChuva ? `${probChuva}% (prob. chuva)` : 'N/A';

        // Velocidade do vento
        const velocidadeVento = weatherData.daily.wind_speed_10m_max[diaIndex];
        const vento = velocidadeVento ? `${Math.round(velocidadeVento)} km/h` : 'N/A';

        const localCompleto = paisLocal ? `${nomeLocal}, ${paisLocal}` : nomeLocal;

        return {
            condicao: condicao,
            temperatura: temperatura,
            humidade: humidade,
            vento: vento,
            local: localCompleto,
            data: data
        };

    } catch (error) {
        console.error('Erro ao buscar previsão do tempo:', error);

        // Retornar dados simulados em caso de erro (fallback)
        return {
            condicao: '🌤️ Informação temporariamente indisponível',
            temperatura: 'N/A',
            humidade: 'N/A',
            vento: 'N/A',
            local: local,
            data: data
        };
    }
}

/**
 * Busca previsão atual para uma localização
 * @param {string} local - Nome da cidade/local
 * @returns {Promise<Object>}
 */
async function buscarPrevisaoAtual(local) {
    const dataAtual = new Date().toISOString().split('T')[0];
    return buscarPrevisaoMeteorologica(local, dataAtual);
}