const display = document.getElementById('display'); //Obtém uma referência ao elemento de entrada com o ID "display", que é o visor da calculadora, e armazena essa referência na variável "display" para uso posterior.

function getCurrentNumber() { //Função para obter o número atual que está sendo digitado no visor, dividindo a expressão atual por operadores matemáticos e retornando a última parte, que é o número em construção.
    const parts = display.value.split(/[+\-*/]/); //Divide o valor atual do visor em partes usando uma expressão regular que corresponde a qualquer um dos operadores matemáticos (+, -, *, /). Isso cria um array de partes da expressão.
    return parts[parts.length - 1]; //Retorna a última parte do array, que é o número atual que o usuário está digitando. Isso é útil para evitar a inserção de múltiplas vírgulas em um mesmo número.
}

function formatResult(value) { //Função para formatar o resultado da expressão, convertendo o ponto decimal para vírgula, que é o formato usado em muitos países de língua portuguesa.
    return String(value).replaceAll('.', ','); //Converte o valor para string e substitui todos os pontos por vírgulas, garantindo que o resultado seja exibido no formato correto para o usuário.
}

function normalizeExpression(expression) { //Função para normalizar a expressão matemática, convertendo vírgulas para pontos e validando que a expressão contém apenas caracteres permitidos (números, operadores e pontos).
    const normalizedExpression = expression.replaceAll(',', '.'); //Substitui todas as vírgulas na expressão por pontos, garantindo que a expressão esteja no formato correto para avaliação pelo JavaScript.

    if (!/^[0-9+\-*/. ]+$/.test(normalizedExpression)) {//Verifica se a expressão normalizada contém apenas caracteres válidos (números, operadores, pontos e espaços). Se a expressão contiver caracteres inválidos, lança um erro.
        throw new Error('Expressao invalida'); //Lança um erro com a mensagem "Expressao invalida" se a expressão contiver caracteres que não são números, operadores ou pontos, prevenindo a execução de código malicioso ou inválido.
    }

    return normalizedExpression; //Retorna a expressão normalizada, pronta para ser avaliada pela função de cálculo.
}

function appendToDisplay(input) { //Função para adicionar um valor ao visor da calculadora. Verifica se o visor atualmente exibe "Erro" e, se for o caso, limpa o visor antes de adicionar o novo input. Também impede a inserção de múltiplas vírgulas em um mesmo número.
    if (display.value === "Erro") display.value = ""; //Se o visor atualmente exibe "Erro", limpa o visor para permitir que o usuário comece a digitar uma nova expressão sem precisar limpar manualmente o erro.

    if (input === ',' && getCurrentNumber().includes(',')) return; //Se o input é uma vírgula e o número atual já contém uma vírgula, a função retorna sem adicionar o input, prevenindo a inserção de múltiplas vírgulas em um mesmo número, o que tornaria a expressão inválida.

    display.value += input; //Adiciona o input ao final do valor atual do visor, permitindo que o usuário construa a expressão matemática digitando números e operadores.
}

function clearDisplay() { //Função para limpar o visor da calculadora, definindo seu valor como uma string vazia. Isso é usado para resetar a calculadora e permitir que o usuário comece a digitar uma nova expressão.
    display.value = ""; //Limpa o visor da calculadora, removendo qualquer expressão ou resultado que esteja atualmente exibido, preparando o visor para uma nova entrada do usuário.
}

function calculatePercentage() { //Função para calcular o valor percentual com base na expressão atual no visor. Verifica se a expressão contém uma operação com um número seguido por um operador e um valor percentual, e calcula o resultado de acordo. Se a expressão for apenas um número, calcula o valor percentual desse número.
    try { //Tenta executar o código para calcular o percentual. Se ocorrer um erro durante a execução (por exemplo, se a expressão for inválida), o bloco catch irá capturar o erro e exibir "Erro" no visor.
        const expression = normalizeExpression(display.value); //Normaliza a expressão atual no visor, convertendo vírgulas para pontos e validando que a expressão contém apenas caracteres permitidos. Isso garante que a expressão esteja no formato correto para avaliação.
        const operation = expression.match(/^(.*)([+\-*/])(\d+(?:\.\d+)?)$/); //Usa uma expressão regular para verificar se a expressão contém uma operação com um número seguido por um operador (+, -, *, /) e um valor percentual. A expressão regular captura três grupos: a parte antes do operador, o operador em si, e o valor percentual. Se a expressão corresponder a esse formato, a variável "operation" conterá os grupos capturados; caso contrário, será null.

        if (operation) { //Se a expressão corresponde ao formato de uma operação com um número seguido por um operador e um valor percentual, o código dentro deste bloco será executado para calcular o resultado do percentual com base na operação.
            const [, baseExpression, operator, percentageValue] = operation; // Desestrutura os grupos capturados pela expressão regular. "baseExpression" contém a parte da expressão antes do operador, "operator" contém o operador (+, -, *, /), e "percentageValue" contém o valor percentual que será usado no cálculo.
            const baseValue = Function(`"use strict"; return (${baseExpression})`)(); //Avalia a parte da expressão antes do operador para obter o valor base. Isso é necessário para calcular o percentual em relação a esse valor. A função é criada dinamicamente para avaliar a expressão de forma segura, usando "use strict" para evitar a execução de código malicioso.
            const value = Number(percentageValue); //Converte o valor percentual capturado para um número, garantindo que ele possa ser usado em cálculos matemáticos.
            const percentage = ['+', '-'].includes(operator) //Verifica se o operador é de adição ou subtração. Se for, o percentual é calculado como uma porcentagem do valor base (baseValue * value / 100). Se o operador for de multiplicação ou divisão, o percentual é calculado como um valor absoluto (value / 100), pois nesses casos o percentual não depende do valor base.
                ? baseValue * value / 100 //Calcula o percentual como uma porcentagem do valor base para operadores de adição e subtração.
                : value / 100; //Calcula o percentual como um valor absoluto para operadores de multiplicação e divisão.

            display.value = formatResult(`${baseExpression}${operator}${percentage}`); //Atualiza o visor com a nova expressão que inclui o valor percentual calculado. A expressão é formatada para garantir que o resultado seja exibido no formato correto para o usuário.
        } else if (expression !== '' && isFinite(expression)) { //Se a expressão não corresponde ao formato de uma operação com um número seguido por um operador e um valor percentual, mas é um número válido, o código dentro deste bloco será executado para calcular o valor percentual desse número.
            display.value = formatResult(Number(expression) / 100); //Calcula o valor percentual do número atual no visor dividindo-o por 100 e atualiza o visor com o resultado formatado. Isso permite que o usuário obtenha rapidamente o valor percentual de um número digitado sem precisar realizar uma operação adicional.
        }
    } catch (error) { //Se ocorrer um erro durante a execução do código para calcular o percentual (por exemplo, se a expressão for inválida), o bloco catch irá capturar o erro e definir o visor para exibir "Erro", informando ao usuário que a operação não pôde ser realizada devido a uma expressão inválida.
        display.value = "Erro"; //Define o visor para exibir "Erro" se ocorrer um erro durante o cálculo do percentual, indicando que a expressão fornecida não é válida para essa operação.
    }
}

function calculate() { //Função para calcular o resultado da expressão matemática atual no visor. Normaliza a expressão, avalia o resultado usando a função Function para criar uma função dinâmica, e formata o resultado para exibição. Se ocorrer um erro durante a avaliação (por exemplo, se a expressão for inválida), o visor exibirá "Erro".
    try { //Tenta executar o código para calcular o resultado da expressão. Se ocorrer um erro durante a execução (por exemplo, se a expressão for inválida), o bloco catch irá capturar o erro e exibir "Erro" no visor.
        const expression = normalizeExpression(display.value); //Normaliza a expressão atual no visor, convertendo vírgulas para pontos e validando que a expressão contém apenas caracteres permitidos. Isso garante que a expressão esteja no formato correto para avaliação.
        const result = Function(`"use strict"; return (${expression})`)(); //Avalia a expressão matemática usando a função Function para criar uma função dinâmica. A expressão é passada como um argumento para a função, e "use strict" é usado para garantir que o código seja executado em modo estrito, prevenindo a execução de código malicioso ou inválido.
        if (!isFinite(result)) { //Verifica se o resultado da avaliação é um número finito. Se o resultado for infinito ou NaN (Not a Number), isso indica que a expressão é inválida ou que ocorreu um erro matemático (como divisão por zero), e o visor será atualizado para exibir "Erro".
            display.value = "Erro"; 
        } else { //Se o resultado for um número finito, ele é formatado para exibição usando a função formatResult, que converte pontos decimais para vírgulas, e o visor é atualizado para mostrar o resultado formatado.
            display.value = formatResult(result); //Atualiza o visor para exibir o resultado da expressão matemática, formatado para garantir que os pontos decimais sejam exibidos como vírgulas, conforme o formato usado em muitos países de língua portuguesa.
        }
    } catch (error) { //Se ocorrer um erro durante a avaliação da expressão (por exemplo, se a expressão for inválida), o bloco catch irá capturar o erro e definir o visor para exibir "Erro", informando ao usuário que a operação não pôde ser realizada devido a uma expressão inválida.
        display.value = "Erro"; 
    }
}

function deleteLast() { //Função para deletar o último caractere do visor da calculadora. Isso é útil para permitir que o usuário corrija erros de digitação sem precisar limpar toda a expressão.
    display.value = display.value.slice(0, -1); //Atualiza o visor para exibir o valor atual, mas com o último caractere removido. A função slice(0, -1) retorna uma nova string que inclui todos os caracteres do valor atual do visor, exceto o último, permitindo que o usuário corrija erros de digitação de forma rápida e eficiente.
}

// Suporte ao teclado físico
document.addEventListener('keydown' , (event) => { //Adiciona um ouvinte de evento para o evento "keydown" no documento, permitindo que a calculadora responda a entradas do teclado físico. Quando uma tecla é pressionada, a função fornecida será executada, recebendo o evento como argumento.
    const key = event.key; //Obtém a tecla que foi pressionada a partir do evento e armazena essa informação na variável "key" para uso posterior na lógica de processamento das entradas do teclado.
    if (/[0-9]/.test(key)) appendToDisplay(key); //Se a tecla pressionada for um número (0-9), a função appendToDisplay é chamada com o valor da tecla, adicionando o número ao visor da calculadora.
    if (['+', '-', '*', '/'].includes(key)) appendToDisplay(key); //Se a tecla pressionada for um dos operadores matemáticos (+, -, *, /), a função appendToDisplay é chamada com o valor da tecla, adicionando o operador ao visor da calculadora.
    if (key === ',' || key === '.') appendToDisplay(','); //Se a tecla pressionada for uma vírgula ou um ponto, a função appendToDisplay é chamada com uma vírgula, garantindo que o formato decimal seja consistente no visor da calculadora, independentemente de qual tecla de separação decimal o usuário tenha pressionado.
    if (key === 'Enter' || key === '=') calculate(); //Se a tecla pressionada for "Enter" ou "=", a função calculate é chamada para processar a expressão atual no visor e exibir o resultado.
    if (key === 'Escape') clearDisplay(); //Se a tecla pressionada for "Escape", a função clearDisplay é chamada para limpar o visor da calculadora, permitindo que o usuário comece a digitar uma nova expressão.
    if (key === 'Backspace') display.value = display.value.slice(0, -1); //Se a tecla pressionada for "Backspace", o visor é atualizado para exibir o valor atual, mas com o último caractere removido, permitindo que o usuário corrija erros de digitação de forma rápida e eficiente usando o teclado físico.
});
