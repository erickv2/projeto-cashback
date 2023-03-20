
  //seta o index para cada elemento do carousel
  let currentCarouselItem = 0;

  //seta o número total de elementos do carousel - buscar forma de fazer isso automaticamente
  let maxCarouselItem = 7;

  //cria constantes para os botões
  const nextBtn = document.getElementById('proximo');
  const prevBtn = document.getElementById('prev');
  const sendBtn = document.getElementById('enviar')
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

          if (input.checkValidity() === false) {
            input.classList.add('is-invalid')
            nextBtn.disabled = true;
          }
          else {
            input.classList.add('is-valid');
            nextBtn.disabled = false;
          }
        }, false);
      });
    }, false);
  })()

  //evento de clique do botao "próximo" ---------------------------

  nextBtn.addEventListener("click", function () {
    // disabilita o botao por 700ms enquanto rola a animação, previne cliques múltiplos que somariam no contador
    nextBtn.disabled = true;
    setTimeout(function () { nextBtn.disabled = false; }, 700)
    //adiciona ao contador
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
      rating.value = index + 1;
    });
  });


  // <!-- INICIO SCRIPT mask  -->


  $('#telefone').mask('(00) 00000-0000');
  $('#cpf').mask('000.000.000-00');
  $('#data_nascimento').mask('00/00/0000');

