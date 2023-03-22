
//seta o index para cada elemento do carousel
let currentCarouselItem = 0;

//seta o número total de elementos do carousel - buscar forma de fazer isso automaticamente
let maxCarouselItem = 7;

//cria constantes para os botões
const nextBtn = document.getElementById('proximo');
const prevBtn = document.getElementById('prev');
const sendBtn = document.getElementById('enviarHidden')
const stars = document.querySelectorAll('.star');
const rating = document.querySelector('#rating');
nextBtn.disabled = true;


// testando validação --------------------------------

(function () {
  'use strict';
  window.addEventListener('load', function () {
    // fetch all the forms we want to apply custom style
    var inputs = document.getElementsByClassName('form-control')

    // loop over each input and watch blue event
    var validation = Array.prototype.filter.call(inputs, function (input) {

      input.addEventListener('input', function (event) {
        // reset
        nextBtn.disabled = true;
        input.classList.remove('is-invalid')
        input.classList.remove('is-valid')
        // se o input é invalido, adiciona alerta de invalido no campo de input e disabilita o botao "proximo"
        if (input.checkValidity() === false) {
          input.classList.add('is-invalid')
          nextBtn.disabled = true;
        }
        // se o input é valido, adiciona alerta de valido no campo de input e habilita o botao "proximo"
        else {
          input.classList.add('is-valid');
          nextBtn.disabled = false;
        }


      }, false);
    });
  }, false);
})()

//função de validação extra, roda quando o slide é finalizado e evita que o usuário precise dar um input novamente em caso de campos pré-preenchidos 
$('#carouselExampleControls').on('slid.bs.carousel', function (e) {
  var target = document.querySelector('.carousel-item.active');
  var currentInput = target.getElementsByClassName('form-control');

  if (currentInput.length > 0) {
    var firstInput = currentInput[0];
    var firstInputId = firstInput.id;
    // se o input é invalido, adiciona alerta de invalido no campo de input e disabilita o botao "proximo"
   if (firstInput.checkValidity() === false) {
    firstInput.classList.add('is-invalid')
    nextBtn.disabled = true;
   }
  // se o input é valido, adiciona alerta de valido no campo de input e habilita o botao "proximo"
    else {
    firstInput.classList.add('is-valid');
    nextBtn.disabled = false;
    }
  }
});

// validador de cpf
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g,'');
  if(cpf == '') return false;
  // Elimina CPFs inválidos conhecidos
  if (cpf.length != 11 || 
      cpf == "00000000000" || 
      cpf == "11111111111" || 
      cpf == "22222222222" || 
      cpf == "33333333333" || 
      cpf == "44444444444" || 
      cpf == "55555555555" || 
      cpf == "66666666666" || 
      cpf == "77777777777" || 
      cpf == "88888888888" || 
      cpf == "99999999999")
          return false;
  // Valida 1o digito
  add = 0;
  for (i=0; i < 9; i ++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
      rev = 11 - (add % 11);
      if (rev == 10 || rev == 11)
          rev = 0;
      if (rev != parseInt(cpf.charAt(9)))
          return false;
  // Valida 2o digito
  add = 0;
  for (i = 0; i < 10; i ++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
      rev = 11 - (add % 11);
      if (rev == 10 || rev == 11)
          rev = 0;
      if (rev != parseInt(cpf.charAt(10)))
          return false;
  return true;
}

// chamar no onsubmit
function validarFormulario() {
  var cpf = document.getElementById("cpf").value;
  if (!validarCPF(cpf)) {
    alert("CPF inválido");
    return false;
  }
  return true;
}






//evento de clique do botao "próximo" ---------------------------

nextBtn.addEventListener("click", function () {
  // disabilita o botao por 700ms enquanto rola a animação, previne cliques múltiplos que somariam no contador
  nextBtn.disabled = true;
  // setTimeout(function () { nextBtn.disabled = false; }, 700)
  //adiciona ao contador
  // removido para ligar o botão através da validação dos dados
  currentCarouselItem = currentCarouselItem + 1;
  //torna o botão "voltar" visível
  prevBtn.style.visibility = "visible"
  //condicional para esconder o "proximo" e aparecer o botão "enviar" quando chega ao último slide
  if (currentCarouselItem == maxCarouselItem) {
    nextBtn.style.visibility = "collapse"
    sendBtn.style.visibility = "visible"
  }
}


);

//evento de clique do botao "voltar" ----------------------------

prevBtn.addEventListener("click", function () {
  prevBtn.disabled = true;
  setTimeout(function () { prevBtn.disabled = false; }, 700)
  //subtrai do contador
  currentCarouselItem = currentCarouselItem - 1;
  //se volta para o primeiro campo do carousel, esconde o botão voltar
  if (currentCarouselItem == 0) {
    prevBtn.style.visibility = "collapse"
  }
  //se volta do último campo do carousel, esconde o botão enviar e apresenta novamente o botão "próximo"
  else if (currentCarouselItem < maxCarouselItem) {
    sendBtn.style.visibility = "collapse"
    nextBtn.style.visibility = "visible"
  }
});



//inicio do script das estrelas



// FODA-SE AS ESTRELAS

stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    // marca as estrelas clicadas e desmarca as outras
    stars.forEach((s, i) => {
      if (i <= index) {
        s.classList.add('selected');
      } else {
        s.classList.remove('selected');
      }
    });

    // atualiza o valor da avaliação
    var rating = index + 1;
    updateRating = document.getElementById('rating');
    updateRating.value = rating;
    console.log(updateRating.value)
  });
});


// <!-- INICIO SCRIPT mask  -->


$('#telefone').mask('(00) 00000-0000');
$('#cpf').mask('000.000.000-00', { reverse: true });
$('#data_nascimento').mask('00/00/0000');

