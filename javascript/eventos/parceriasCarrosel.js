let slideIndex = 1;
let slideTimer;
showSlides(slideIndex);

/**
 * Move os slides para a direita ou esqueda dependendo da seta que foi clicada
 * @param {int} direction - direcao que os slides devem mover-se
 */
function plusSlides(direction) {
  clearTimeout(slideTimer); 
  showSlides(slideIndex += direction);
}
/**
 * @param {int} n - index do  slide
 * a funcao  corre a funcao showslides
*/
function currentSlide(n) {
  clearTimeout(slideTimer);
  showSlides(slideIndex = n);
}
/**
 * @param {int} n - 
 */
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    slides[i].classList.remove("active");
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "flex"; 
  slides[slideIndex - 1].classList.add("active");
  dots[slideIndex - 1].className += " active";
  
  slideTimer = setTimeout(function() {
    plusSlides(1); 
  }, 5000); 
}