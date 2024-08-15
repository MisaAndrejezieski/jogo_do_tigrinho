function multiplicador() {
    const quantidadeDeSlot = 9;
    var imagens = [
        "./images/j001.jpg",
        "./images/j002.jpg",
        "./images/j003.jpg",
        "./images/j004.jpg",
        "./images/j005.jpg",
        "./images/j006.jpg",
        "./images/j007.jpg",
        "./images/j008.jpg",
        "./images/j009.jpg",
        "./images/j010.jpg",
        "./images/j011.jpg",
        "./images/j012.jpg"
    ];

    var pesos = [5, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.2, 0.2, 0.1];
    var multiplicadores = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
    var resultados = [];
    var divImagens = document.querySelector(".images");
    var divResultado = document.getElementById("results");
    var creditos = document.getElementById("creditos");
    var aposta = document.getElementById("aposta");
    var ganhos = document.getElementById("ganhos");

    var apostaValor = parseInt(aposta.value);
    var creditosValor = parseInt(creditos.value);

    if (apostaValor > creditosValor) {
        divResultado.innerHTML = "Créditos insuficientes!";
        divResultado.classList = 'lost';
        return;
    }

    creditosValor -= apostaValor;
    creditos.value = creditosValor;

    divResultado.classList = "";
    divResultado.innerHTML = "Rodando...";

    var rodando = setInterval(rodar, 100);

    setTimeout(function () {
        clearInterval(rodando);
        verifiqueSeGanhou();
    }, 1000);

    function rodar() {
        for (var i = 0; i < quantidadeDeSlot; i++) {
            var aleatorio = selecionarImagemComPeso();
            var slotName = '.slot-' + (i + 1);
            var slotAtual = divImagens.querySelector(slotName);

            slotAtual.src = imagens[aleatorio];
            resultados[i] = imagens[aleatorio];
        }
    }

    function selecionarImagemComPeso() {
        var totalPesos = pesos.reduce((a, b) => a + b, 0);
        var numeroAleatorio = Math.random() * totalPesos;
        var somaPesos = 0;

        for (var i = 0; i < pesos.length; i++) {
            somaPesos += pesos[i];
            if (numeroAleatorio < somaPesos) {
                return i;
            }
        }
    }

    function verifiqueSeGanhou() {
        var linhas = [
            [resultados[0], resultados[1], resultados[2]],
            [resultados[3], resultados[4], resultados[5]],
            [resultados[6], resultados[7], resultados[8]]
        ];

        var ganhoTotal = 0;
        var ganhou = false;

        for (var i = 0; i < linhas.length; i++) {
            if (linhas[i][0] === linhas[i][1] && linhas[i][0] === linhas[i][2]) {
                var indiceImagem = imagens.indexOf(linhas[i][0]);
                var multiplicadorGanho = multiplicadores[indiceImagem];
                var ganho = apostaValor * multiplicadorGanho;
                ganhoTotal += ganho;
                ganhou = true;
            }
        }

        if (resultados.every((val, i, arr) => val === arr[0])) {
            ganhoTotal = multiplicadores * 10;
            ganhou = true;
        }

        if (ganhou) {
            creditosValor += ganhoTotal;
            creditos.value = creditosValor;
            ganhos.value = ganhoTotal;
            divResultado.innerHTML = "Parabéns! Você ganhou " + ganhoTotal + " créditos!";
            divResultado.classList = 'won';
        } else {
            ganhos.value = 0;
            divResultado.innerHTML = "Infelizmente você perdeu!";
            divResultado.classList = 'lost';
        }
    }
}
