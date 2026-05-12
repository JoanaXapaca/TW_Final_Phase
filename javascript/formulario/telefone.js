const select_box = document.querySelector('.options');
const search_box = document.querySelector('input[name="search-box"]');
const input_box = document.querySelector('input[type="tel"]');
const selected_option = document.querySelector('.selected-option > div');

let options = null;

/**
 * Loop que itera por todos os paises e os adiciona ao site 
 */
for(country of countries){
    const option = `<li class="option">
                        <div>
                            <span class="iconify" data-icon="flag:${country.code.toLowerCase()}-4x3"></span>
                            <span class="country-name">${country.name}</span>
                        </div>
                        <strong>+${country.phone}</strong>
                    </li>`;

    select_box.querySelector('ol').insertAdjacentHTML('beforeend', option)
    options = document.querySelectorAll('.option')
}

selected_option.addEventListener('click', () =>{
    select_box.classList.toggle('active');
    selected_option.classList.toggle('active')
})

/**
 * Nesta função quando o utilizador seleciona uma linguagem do seu telefone
 * o telefone ativo é alterado pelo selecionado.
 */
function selectOption(){
    console.log(this);
    const icon = this.querySelector('.iconify').cloneNode(true);
    phone_code = this.querySelector('strong').cloneNode(true);

    selected_option.textContent = '';
    selected_option.append(icon,phone_code);
}

/**
 * Esta função permite o utilizador pesquisar pelo país do seu telefone
 * através do input que escreveu
 */
function searchCountry(){
    let searchEl = search_box.value.toLowerCase();
    for(option of options){
        let is_matched = option.querySelector('.country-name').textContent.toLowerCase().includes(searchEl);
        option.classList.toggle('hide', !is_matched);
    }
}

//Evento que altera o simbolo quando o utilizador clica
options.forEach(option=> option.addEventListener('click', selectOption))

//Evento que filtra os pais que aparecem pelo input do utilizador
search_box.addEventListener('input', searchCountry);