// Lista de ícones disponíveis no jogo
const ICONS = [
    'apple', 'apricot', 'banana', 'big_win', 'cherry', 'grapes', 'lemon', 'lucky_seven', 'orange', 'pear', 'strawberry', 'watermelon',
];

// Configurações de tempo para as animações
const BASE_SPINNING_DURATION = 2.7;    // Duração base do giro em segundos
const COLUMN_SPINNING_DURATION = 0.3;  // Duração adicional por coluna

// Variáveis globais
var cols;                   // Referência às colunas do jogo
let playerBalance = 1000;   // Saldo inicial do jogador
let currentBet = 10;       // Valor inicial da aposta

// Inicialização quando o DOM estiver carregado
window.addEventListener('DOMContentLoaded', function(event) {
    cols = document.querySelectorAll('.col');
    setInitialItems();
    updateUI();
});

/**
 * Preenche as colunas com ícones aleatórios iniciais
 */
function setInitialItems() {
    let baseItemAmount = 40;  // Quantidade base de ícones por coluna

    for (let i = 0; i < cols.length; ++i) {
        let col = cols[i];
        let amountOfItems = baseItemAmount + (i * 3); // Incrementa a quantidade para cada coluna
        let elms = '';
        let firstThreeElms = '';

        // Gera os ícones aleatórios
        for (let x = 0; x < amountOfItems; x++) {
            let icon = getRandomIcon();
            let item = '<div class="icon" data-item="' + icon + '"><img src="items/' + icon + '.png"></div>';
            elms += item;

            if (x < 3) firstThreeElms += item; // Backup dos primeiros três itens
        }
        col.innerHTML = elms + firstThreeElms;
    }
}

/**
 * Atualiza a interface com o saldo e aposta atual
 */
function updateUI() {
    document.getElementById('balance').textContent = playerBalance;
    document.getElementById('current-bet').textContent = currentBet;
}

/**
 * Aumenta o valor da aposta em 10 moedas
 */
function increaseBet() {
    if (currentBet + 10 <= playerBalance) {
        currentBet += 10;
        updateUI();
    }
}

/**
 * Diminui o valor da aposta em 10 moedas
 */
function decreaseBet() {
    if (currentBet - 10 >= 10) {
        currentBet -= 10;
        updateUI();
    }
}

/**
 * Inicia o giro do caça-níquel
 * @param {HTMLElement} elem - O botão que iniciou o giro
 */
function spin(elem) {
    // Verifica se há saldo suficiente
    if (playerBalance < currentBet) {
        window.alert("Saldo insuficiente!");
        return;
    }
    
    // Deduz a aposta do saldo
    playerBalance -= currentBet;
    updateUI();

    let duration = BASE_SPINNING_DURATION + randomDuration();

    // Configura a duração da animação para cada coluna
    for (let col of cols) {
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    }

    // Desabilita o botão durante o giro
    elem.setAttribute('disabled', true);

    // Inicia a animação
    document.getElementById('container').classList.add('spinning');

    // Define o resultado após metade do tempo base
    window.setTimeout(setResult, BASE_SPINNING_DURATION * 1000 / 2);

    // Reativa o botão após o fim da animação
    window.setTimeout(function () {
        document.getElementById('container').classList.remove('spinning');
        elem.removeAttribute('disabled');
    }.bind(elem), duration * 1000);
}

/**
 * Define o resultado do giro e verifica vitórias
 */
function setResult() {
    let allResults = [];
    for (let col of cols) {
        // Gera 3 ícones aleatórios para cada coluna
        let results = [
            getRandomIcon(),
            getRandomIcon(),
            getRandomIcon()
        ];
        allResults.push(results[1]); // Guarda o item do meio para verificação

        // Atualiza os ícones na coluna
        let icons = col.querySelectorAll('.icon img');
        for (let x = 0; x < 3; x++) {
            icons[x].setAttribute('src', 'items/' + results[x] + '.png');
            icons[(icons.length - 3) + x].setAttribute('src', 'items/' + results[x] + '.png');
        }
    }
    
    // Verifica se ganhou (3 ícones iguais no meio)
    if (allResults[0] === allResults[1] && allResults[1] === allResults[2]) {
        const prize = currentBet * 5; // Prêmio é 5x o valor apostado
        playerBalance += prize;
        window.alert(`Parabéns! Você ganhou ${prize} moedas!!`);
        updateUI();
    }
}

/**
 * Retorna um ícone aleatório da lista de ícones
 * @returns {string} Nome do ícone selecionado
 */
function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

/**
 * Gera uma duração aleatória para adicionar variação à animação
 * @returns {number} Valor entre 0.00 e 0.09
 */
function randomDuration() {
    return Math.floor(Math.random() * 10) / 100;
}