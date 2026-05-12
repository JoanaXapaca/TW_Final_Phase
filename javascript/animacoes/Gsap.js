const sections = document.querySelectorAll('.missao, .objetivo, .investigacao-main, .slideshow-container, .conquistas');

// Regista o plugin ScrollTrigger do GSAP para permitir animações baseadas no scroll
gsap.registerPlugin(ScrollTrigger);

/**
 * Configuração inicial do estado dos elementos.
 * Define a propriedade autoAlpha como 0,
 * garantindo que as secções começam o carregamento da página invisíveis.
 */
gsap.set(sections, { autoAlpha: 0 });

/**
 * Aplica uma animação de "fade-in" individual a cada secção da lista.
 * A animação é controlada pelo scroll do utilizador, tornando o elemento visível
 * quando este entra na área de visualização (viewport).
 * 
 * @param {HTMLElement} section - O elemento individual que será animado.
 * @param {Object} scrollTrigger - Configuração do gatilho de scroll.
 * @param {string} start - Define o ponto de ativação (quando o topo da secção chega a 100px do fundo).
 * @param {string} toggleActions - Define o comportamento (reproduz ao entrar, reverte ao sair por cima).
 */
sections.forEach((section) => {
  gsap.to(section, {autoAlpha: 1,
    scrollTrigger: {
      trigger: section,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse',
    }
  });

})