const player1 = {
    NOME: 'Mario',
    VELOCIDADE: 4,
    MANOBRABILIDADE: 3,
    PODER: 3,
    PONTOS: 0,
};

const player2 = {
    NOME: 'Luigi',
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    PODER: 4,
    PONTOS: 0,
};

async function rolldice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBloc() {
    let random = Math.random();
    let result;

    switch (true) {
        case random < 0.33:
            result = 'RETA';
            break;
        case random < 0.66:
            result = 'CURVA';
            break;
        default:
            result = 'CONFRONTO';
    }
    return result;
}

async function logRollResult(characterName, skillType, diceResult, attribute) {
    console.log(
        `${characterName} 🎲 rolou um dado de ${skillType} ${diceResult} + ${attribute} = ${
            diceResult + attribute
        }`
    );
}

// Nova função para sortear o item de punição
async function sortearItemPunicao() {
    const itens = ['CASCO', 'BOMBA'];
    const randomIndex = Math.floor(Math.random() * itens.length);
    return itens[randomIndex];
}

async function handleConfronto(character1, character2, diceResult1, diceResult2) {
    const powerResult1 = diceResult1 + character1.PODER;
    const powerResult2 = diceResult2 + character2.PODER;

    console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);

    await logRollResult(character1.NOME, 'poder', diceResult1, character1.PODER);
    await logRollResult(character2.NOME, 'poder', diceResult2, character2.PODER);

    if (powerResult1 > powerResult2) {
        console.log(`${character1.NOME} venceu o confronto!`);
        const itemPunicao = await sortearItemPunicao();
        console.log(`${character2.NOME} pegou um ${itemPunicao}!`);

        if (itemPunicao === 'CASCO' && character2.PONTOS > 0) {
            character2.PONTOS--;
            console.log(`${character2.NOME} perdeu 1 ponto.`);
        } else if (itemPunicao === 'BOMBA' && character2.PONTOS > 0) {
            character2.PONTOS = Math.max(0, character2.PONTOS - 2); // Garante que pontos não fiquem negativos
            console.log(`${character2.NOME} perdeu 2 pontos.`);
        }
        
        // Vencedor ganha turbo
        character1.PONTOS++;
        console.log(`${character1.NOME} ganhou um TURBO e +1 ponto!`);

    } else if (powerResult2 > powerResult1) {
        console.log(`${character2.NOME} venceu o confronto!`);
        const itemPunicao = await sortearItemPunicao();
        console.log(`${character1.NOME} pegou um ${itemPunicao}!`);

        if (itemPunicao === 'CASCO' && character1.PONTOS > 0) {
            character1.PONTOS--;
            console.log(`${character1.NOME} perdeu 1 ponto.`);
        } else if (itemPunicao === 'BOMBA' && character1.PONTOS > 0) {
            character1.PONTOS = Math.max(0, character1.PONTOS - 2); // Garante que pontos não fiquem negativos
            console.log(`${character1.NOME} perdeu 2 pontos.`);
        }

        // Vencedor ganha turbo
        character2.PONTOS++;
        console.log(`${character2.NOME} ganhou um TURBO e +1 ponto!`);
    } else {
        console.log('Confronto empatado! Nenhum ponto foi perdido.');
    }
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round}`);

        // Sortear bloco
        let block = await getRandomBloc();
        console.log(`Bloco: ${block}`);

        // Rolar os dados
        let diceResult1 = await rolldice();
        let diceResult2 = await rolldice();

        // Teste de habilidade
        let totalTesteSkill1 = 0;
        let totalTesteSkill2 = 0;

        if (block === 'RETA') {
            totalTesteSkill1 = diceResult1 + character1.VELOCIDADE;
            totalTesteSkill2 = diceResult2 + character2.VELOCIDADE;

            await logRollResult(
                character1.NOME,
                'velocidade',
                diceResult1,
                character1.VELOCIDADE
            );
            await logRollResult(
                character2.NOME,
                'velocidade',
                diceResult2, // Corrigido para diceResult2
                character2.VELOCIDADE
            );
        } else if (block === 'CURVA') { // Usar else if para melhor clareza e performance
            totalTesteSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTesteSkill2 = diceResult2 + character2.MANOBRABILIDADE;

            await logRollResult(
                character1.NOME,
                'manobrabilidade',
                diceResult1,
                character1.MANOBRABILIDADE
            );
            await logRollResult(
                character2.NOME,
                'manobrabilidade',
                diceResult2, // Corrigido para diceResult2
                character2.MANOBRABILIDADE
            );
        } else if (block === 'CONFRONTO') {
            await handleConfronto(character1, character2, diceResult1, diceResult2);
            // No confronto, os pontos são ajustados dentro de handleConfronto
            // Não há ganho de ponto padrão aqui como nas outras pistas
            totalTesteSkill1 = 0; // Resetar para evitar contagem dupla de pontos
            totalTesteSkill2 = 0; // Resetar para evitar contagem dupla de pontos
        }

        // Verificando o vencedor da rodada (apenas para RETA e CURVA)
        if (block !== 'CONFRONTO') {
            if (totalTesteSkill1 > totalTesteSkill2) {
                console.log(`${character1.NOME} marcou um ponto!`);
                character1.PONTOS++;
            } else if (totalTesteSkill2 > totalTesteSkill1) {
                console.log(`${character2.NOME} marcou um ponto!`);
                character2.PONTOS++;
            } else {
                console.log("Rodada empatada! Ninguém marcou ponto.");
            }
        }
        
        console.log("--------------------");
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado final");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if (character1.PONTOS > character2.PONTOS) {
        console.log(`\n ${character1.NOME} venceu a corrida! Parabéns!🏆`);
    } else if (character2.PONTOS > character1.PONTOS) {
        console.log(`\n ${character2.NOME} venceu a corrida! Parabéns!🏆`);
    } else {
        console.log('A corrida terminou em empate');
    }
}

(async function main() {
    console.log(`🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);
})();