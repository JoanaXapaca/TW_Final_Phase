const btnScroll = document.querySelector(".scroll-to-top");

/**
 * Controla a visibilidade de um elemento com base na posição do scroll
 * @param {HTMLElement} elemento - O elemento a mostrar/esconder
 * @param {number} distancia - A distância em pixels do topo
 */
function atualizarVisibilidadeScroll(elemento, distancia) {
    
    if (document.documentElement.scrollTop > distancia) {
        elemento.style.display = "block";
    } else {
        elemento.style.display = "none";
    }
}

/**
 * Esta função faz um scroll suave até ao topo da página
 */
function voltarAoTopo() {window.scrollTo({ top: 0, behavior: "smooth" });}

/**
 * 
 * @param {event} scroll - evento de scroll
 */
window.addEventListener("scroll", function(){atualizarVisibilidadeScroll(btnScroll, 150);});

btnScroll.addEventListener("click", voltarAoTopo);