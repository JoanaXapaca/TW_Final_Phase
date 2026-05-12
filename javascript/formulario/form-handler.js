/**
 * A função verifica se o email está num formato aceitavel
 *  através de um regex, no qual verifica se
 * tem um texto de inicio, um @(algo).com
 * @param {string} email 
 * @returns boolean
 */
function validateEmail(email) {
  return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g);
};

/**
 * A função verifica se o número de telefone está num formato
 * valido
 * @param {string} phone 
 * @returns boolean
 */
function validatePhone(phone) {
    const digitos = phone.replace(/[\s\-\(\)\+]/g, '').trim();
    return /^\d{7,15}$/.test(digitos);
}

/**
 * 
 * @param {htmlElement} quickReplyText 
 * @param {htmlElement} form 
 */
function selectQuickMessage(form, quickMessage){
  const formEl = document.getElementById(form);
  const quickMessageEl = document.getElementById(quickMessage)
  formEl.value = quickMessageEl.value;
}

/**
 * A função verifica se o utilizador tem todos os parametros do formulário preenchidos, estes sendo
 * o nome, email e mensagem. Em caso de falha é exposto no ecrã uma mensagem de erro, indicando o
 * parametro não preenchido ou inválido. Caso estejam em um formato aceitavel, é exposto ao
 * utiliador uma mensagem de sucesso * 
 * @param {htmlElement} nome
 * @param {htmlElement} email
 * @param {htmlElement} mensagem
 * @param {htmlElement} falha
 * @param {htmlElement}sucesso
 */
function sendEmail(nome,email,mensagem,falha,sucesso){
    const nomeEl =  document.getElementById(nome);
    const emailEl = document.getElementById(email);
    const mensagemEl = document.getElementById(mensagem);
    const falhaEL = document.querySelector(falha);
    const sucessoEL = document.querySelector(sucesso);

    if (nomeEl.value == ""){
        falhaEL.textContent = "Erro: Nome inválido";
        falhaEL.style.display= "flex";
        setTimeout(function(){
          falhaEL.style.display= "none"  
        } , 3000);
    }
    
    else if (emailEl.value == "" || !validateEmail(emailEl.value)){
        falhaEL.textContent = "Erro: Email Inválido";
        falhaEL.style.display= "flex";
        setTimeout(function(){
          falhaEL.style.display= "none"  
        } , 3000);
    }
    else if (mensagemEl.value == ""){
        falhaEL.textContent = "Erro: Mensagem vazia";
        falhaEL.style.display= "flex";
        setTimeout(function(){
          falhaEL.style.display= "none"  
        } , 3000);
    }

    else if (!validatePhone(input_box.value)){
        falhaEL.textContent = "Erro: Telefone Inválido";
        falhaEL.style.display= "flex";
        setTimeout(function(){
          falhaEL.style.display= "none"  
        } , 3000);
    }
    else{
        sucessoEL.style.display= "flex";
        setTimeout(function(){
          sucessoEL.style.display= "none"  
        } , 3000);
    }
}