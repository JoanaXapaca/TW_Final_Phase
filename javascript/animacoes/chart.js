const ctx = document.getElementById("myChart");
let myChart;
let jsonData;
let currentChartType = "bar";

/**
 * Esta funcao determina o tamanho da fonte do chart
 * através do comprimento da janela da página
 * @retuns tamanho da fonte (em pixeis) para o chart
 */
function getChartFontSize() {
  if (window.innerWidth <= 600) return 9;
  if (window.innerWidth <= 1350) return 12;
  return 15.5;
}


Chart.defaults.font.size = getChartFontSize();
window.addEventListener('resize', () => {
  Chart.defaults.font.size = getChartFontSize();
  if (jsonData) Createchart(jsonData, currentChartType);
});

/**
 * Esta funcao verifica se a diretoria do ficheiro json existe, bem como
 * se o tipo de grafico é valida para o chart. Caso ambos sejam validos
 * cria um chart novo
 * @param {json} jsonUrl - diretoria do ficheiro json
 * @param {string} tipo - tipo de grafico a ser utilizado
 */
function loadData(jsonUrl,tipo) {
  fetch(jsonUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Falha ao carregar os dados de: ${jsonUrl}`);
    })
    .then(function (data) {
      jsonData = data;
      Createchart(jsonData, currentChartType,tipo);
    })
    .catch(function (error) {
      console.error(error);
    });
}

/**
 * define o tipo de chart que vai ser utilizado
 * @param {string} chartType - tipo de chart para ser exposto
 */
function setChartType(chartType) {
  currentChartType = chartType;
  if (jsonData) {
    Createchart(jsonData, currentChartType,tipo);
  }
}

/**
 * Esta funcao cria um novo chart com a informacao fornecida.
 * Primeiro verifica a existencia do canvas e  caso este exista 
 * ele elimina o chart ja existente  e cria um novo com a nova informação
 * 
 * @param {json} data - informacao a ser utilizada para o chart
 * @param {String} type - tipo de chart a ser utilizado
 * @param {string} fontSize - tamanho da font
 */
function Createchart(data, type,fontSize) {
  if (!ctx) {
    console.warn("Canvas element not found: #myChart");
    return;
  }

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: type,
    data: {
      labels: data.map((row) => row.month),
      datasets: [
        {
          label: fontSize,
          data: data.map((row) => row.income),
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        }       
      },
    },
  });
}

loadData('utils/datainvestigacao.json','numero de investigadores');