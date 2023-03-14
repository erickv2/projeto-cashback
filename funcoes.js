function avaliar(estrela) {
    var url = window.location;
    url = url.toString()
    url = url.split("index.html")
    url = url[0]

    var s1 =
    document.getElementById('s1').src
    var s2 =
    document.getElementById('s2').src
    var s2 =
    document.getElementById('s2').src
    var s3 =
    document.getElementById('s3').src
    var s4 =
    document.getElementById('s4').src
    var s5 =
    document.getElementById('s5').src

    var avaliacao = 0

    // 5 ESTRELAS

    if(estrela == 5) {

        if (s5 == url + "img/star0.png")

        document.getElementById("s1").src = "img/star1.png"
        document.getElementById("s2").src = "img/star1.png"
        document.getElementById("s3").src = "img/star1.png"
        document.getElementById("s4").src = "img/star1.png"
        document.getElementById("s5").src = "img/star1.png"
        avaliacao = 5
    }else{

        if (s5 == url + "img/star0.png")

        document.getElementById("s1").src = "img/star1.png"
        document.getElementById("s2").src = "img/star1.png"
        document.getElementById("s3").src = "img/star1.png"
        document.getElementById("s4").src = "img/star1.png"
        document.getElementById("s5").src = "img/star0.png"
        avaliacao = 4
    }

    // 4 ESTRELAS

    if(estrela == 4) {

        if (s4 == url + "img/star0.png")

        document.getElementById("s1").src = "img/star1.png"
        document.getElementById("s2").src = "img/star1.png"
        document.getElementById("s3").src = "img/star1.png"
        document.getElementById("s4").src = "img/star1.png"
        document.getElementById("s5").src = "img/star0.png"
        avaliacao = 4
    }else{

        if (s5 == url + "img/star0.png")

        document.getElementById("s1").src = "img/star1.png"
        document.getElementById("s2").src = "img/star1.png"
        document.getElementById("s3").src = "img/star1.png"
        document.getElementById("s4").src = "img/star0.png"
        document.getElementById("s5").src = "img/star0.png"
        avaliacao = 3
    }
    
    // 3 ESTRELAS

    if(estrela == 4) {

        if (s4 == url + "img/star0.png")

        document.getElementById("s1").src = "img/star1.png"
        document.getElementById("s2").src = "img/star1.png"
        document.getElementById("s3").src = "img/star1.png"
        document.getElementById("s4").src = "img/star0.png"
        document.getElementById("s5").src = "img/star0.png"
        avaliacao = 4
    }else{

        if (s3 == url + "img/star0.png")

        document.getElementById("s1").src = "img/star1.png"
        document.getElementById("s2").src = "img/star1.png"
        document.getElementById("s3").src = "img/star0.png"
        document.getElementById("s4").src = "img/star0.png"
        document.getElementById("s5").src = "img/star0.png"
        avaliacao = 3
    }

    // 2 ESTRELAS
    
    if(estrela == 4) {

        if (s4 == url + "img/star0.png")

        document.getElementById("s1").src = "img/star1.png"
        document.getElementById("s2").src = "img/star1.png"
        document.getElementById("s3").src = "img/star1.png"
        document.getElementById("s4").src = "img/star0.png"
        document.getElementById("s5").src = "img/star0.png"
        avaliacao = 4
    }else{

        if (s3 == url + "img/star0.png")

        document.getElementById("s1").src = "img/star1.png"
        document.getElementById("s2").src = "img/star1.png"
        document.getElementById("s3").src = "img/star0.png"
        document.getElementById("s4").src = "img/star0.png"
        document.getElementById("s5").src = "img/star0.png"
        avaliacao = 3
    }
}
