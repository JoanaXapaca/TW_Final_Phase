/**
 * Lista global que armazena os contextos de todos os logótipos 3D ativos.
 * Permite o controlo centralizado de animação e redimensionamento.
 * @type {Array<Object>}
 */
const logosAtivos = [];

/**
 * Obtém as dimensões de um elemento HTML ou retorna valores padrão caso o elemento não tenha tamanho.
 * @param {HTMLElement} el - O elemento contentor.
 * @param {number} wP - Largura padrão (fallback).
 * @param {number} hP - Altura padrão (fallback).
 * @returns {{w: number, h: number}} Objeto contendo largura (w) e altura (h).
 */
const getDims = (el, wP, hP) => ({
    w: el.getBoundingClientRect().width || wP,
    h: el.getBoundingClientRect().height || hP
});

/**
 * Cria e configura o renderizador WebGL do Three.js.
 * @param {number} comprimento - Largura inicial do canvas.
 * @param {number} altura - Altura inicial do canvas.
 * @returns {THREE.WebGLRenderer} O renderizador configurado.
 */
function criarRenderer(comprimento, altura) {
    const r = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    r.setPixelRatio(window.devicePixelRatio);
    r.setSize(comprimento, altura);
    r.domElement.style.display = 'block';
    return r;
}

/**
 * Carrega uma nova textura e substitui o objeto 3D no contexto fornecido.
 * @param {Object} ctx - O contexto do logo.
 * @param {string} url - O caminho para a imagem da textura.
 */
function setLogo(ctx, url) {
    new THREE.TextureLoader().load(url, (tex) => {
        const geometry = new THREE.PlaneGeometry((tex.image.width / tex.image.height) * 1.5, 1.5);
        const material = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });

        if (ctx.mesh) ctx.scene.remove(ctx.mesh);
        ctx.mesh = new THREE.Mesh(geometry, material);
        ctx.scene.add(ctx.mesh);
    });
}

/**
 * Inicializa a cena 3D, câmara e renderizador num elemento específico.
 * @param {string} seletor - Seletor CSS do elemento contentor.
 * @param {string} img - Caminho inicial da imagem do logotipo.
 * @param {number} width - Largura padrão para inicialização.
 * @param {number} height - Altura padrão para inicialização.
 * @returns {Object|null} O objeto de contexto criado ou null se o elemento não for encontrado.
 */
function initLogo(seletor, img, width, height) {
    const el = document.querySelector(seletor);
    if (!el) return null;

    const dimensao = getDims(el, width, height);
    const ctx = {
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(45, dimensao.w / dimensao.h, 0.1, 1000),
        renderer: criarRenderer(dimensao.w, dimensao.h),
        mesh: null, 
        el, 
        wP: width, 
        hP: height
    };

    ctx.camera.position.z = 3;
    ctx.scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    el.replaceChildren(ctx.renderer.domElement); 

    setLogo(ctx, img);
    logosAtivos.push(ctx);
    return ctx;
}

/**
 * Loop de animação principal. Roda a aproximadamente 60fps.
 * Aplica a rotação a todos os logótipos e renderiza as cenas.
 */
function loop() {
    requestAnimationFrame(loop);
    logosAtivos.forEach(element => {
        if (element.mesh) element.mesh.rotation.y += 0.015;
        element.renderer.render(element.scene, element.camera);
    });
}

/**
 * Listener global para o evento de redimensionamento da janela.
 * Atualiza a proporção da câmara e o tamanho do renderizador de todos os logos ativos.
 */
window.addEventListener('resize', () => {
    logosAtivos.forEach(element => {
        const d = getDims(element.el, element.wP, element.hP);
        element.camera.aspect = d.w / d.h;
        element.camera.updateProjectionMatrix();
        element.renderer.setSize(d.w, d.h);
    });
});

// --- Execução ---

const principal = initLogo('.logotipo', 'imagens/logotipos/logotipo.png', 334, 128);

initLogo('.logotipo-mobile', 'imagens/logotipos/logotipo-mobile.png', 60, 70);

loop();

// --- Lógica de Breakpoint ---

/** @type {MediaQueryList} Monitor de largura de ecrã para troca de imagens */
const mq = window.matchMedia('(max-width: 1350px)');

/**
 * Callback executado quando o breakpoint é cruzado.
 * @param {MediaQueryListEvent|MediaQueryList} e - O evento de mudança de média.
 */
const swap = (e) => principal && setLogo(principal, e.matches ? 'imagens/logotipos/logotipo_tablet.png' : 'imagens/logotipos/logotipo.png');

mq.addListener(swap);
swap(mq); // Execução inicial para definir a imagem correta no carregamento