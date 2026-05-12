const btnInvestigacao = document.querySelectorAll('button[name="investigacaoBotao"]');

/***
 * Expoe texto para o utilizador caso ele clique no botão de "saber mais".
 * @param {HTMLElement} btn - botão que foi clicado
 */
btnInvestigacao.forEach((btn) => {
    btn.addEventListener("click", function() {
        const contentor = this.closest('.investigacao-contentor');
        const saberMaisTexto = contentor.querySelector(".saberTexto");
        if (saberMaisTexto.style.display === "block") {
            saberMaisTexto.style.display = "none";
            this.textContent = "Saber Mais";
        } else {
            saberMaisTexto.style.display = "block";
            this.textContent = "Fechar";
        }
    });
});