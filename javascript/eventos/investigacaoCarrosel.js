let currentIndex = 0;

/**
 * Retorna o número de slides que devem ser visiveis
 *  retorna 1  se a plataforma é mobile
 *  retorna 2  se a plataforma é o tablet
 *  retorna 3  se a plataforma é desktop
 * @returns 
 */
function getVisibleCount() {
  if (window.innerWidth <= 980) return 1;
  if (window.innerWidth <= 1350) return 2;
  return 3;
}

/**
 * Esta funcao irá indicar se os slides devem mexer-se para a direita ou esquerda
 * se o numero for negativo, move-se para a esquerda
 * se o numero for positivo, move-se para a direita
 * 
 * @param {int} direction - direcao que vai mover os slides
 */
function moveSlide(direction) {
  currentIndex += direction;
  updateSlider();
}

/**
 * Atualiza a posição visual do carrossel (slider) de investigação.
 * Calcula o deslocamento do "track" com base no índice atual, no número de 
 * cartões visíveis (dependente da resolução) e na largura total de cada cartão 
 * (incluindo margens), aplicando uma transformação CSS para mover os slides.
 */
function updateSlider() {
  const track = document.getElementById('track');

  const cards = track.querySelectorAll('.investigacao-contentor');
  const total = cards.length;
  const visible = getVisibleCount();
  const maxIndex = total - visible;

  if (currentIndex < 0) currentIndex = maxIndex;
  if (currentIndex > maxIndex) currentIndex = 0;

  const card = cards[0];
  const style = globalThis.getComputedStyle(card);
  const cardWidth = card.offsetWidth
    + Number.parseInt(style.marginLeft)
    + Number.parseInt(style.marginRight);

  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

window.addEventListener('resize', updateSlider); 

