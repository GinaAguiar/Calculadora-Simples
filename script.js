const display = document.getElementById('display');

function getCurrentNumber() {
    const parts = display.value.split(/[+\-*/]/);
    return parts[parts.length - 1];
}

function formatResult(value) {
    return String(value).replaceAll('.', ',');
}

function normalizeExpression(expression) {
    const normalizedExpression = expression.replaceAll(',', '.');

    if (!/^[0-9+\-*/. ]+$/.test(normalizedExpression)) {
        throw new Error('Expressao invalida');
    }

    return normalizedExpression;
}

function appendToDisplay(input) {
    if (display.value === "Erro") display.value = "";

    if (input === ',' && getCurrentNumber().includes(',')) return;

    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function calculatePercentage() {
    try {
        const expression = normalizeExpression(display.value);
        const operation = expression.match(/^(.*)([+\-*/])(\d+(?:\.\d+)?)$/);

        if (operation) {
            const [, baseExpression, operator, percentageValue] = operation;
            const baseValue = Function(`"use strict"; return (${baseExpression})`)();
            const value = Number(percentageValue);
            const percentage = ['+', '-'].includes(operator)
                ? baseValue * value / 100
                : value / 100;

            display.value = formatResult(`${baseExpression}${operator}${percentage}`);
        } else if (expression !== '' && isFinite(expression)) {
            display.value = formatResult(Number(expression) / 100);
        }
    } catch (error) {
        display.value = "Erro";
    }
}

function calculate() {
    try {
        const expression = normalizeExpression(display.value);
        const result = Function(`"use strict"; return (${expression})`)();
        if (!isFinite(result)) {
            display.value = "Erro";
        } else {
            display.value = formatResult(result);
        }
    } catch (error) {
        display.value = "Erro";
    }
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Suporte ao teclado físico
document.addEventListener('keydown' , (event) => {
    const key = event.key;
    if (/[0-9]/.test(key)) appendToDisplay(key);
    if (['+', '-', '*', '/'].includes(key)) appendToDisplay(key);
    if (key === ',' || key === '.') appendToDisplay(',');
    if (key === 'Enter' || key === '=') calculate();
    if (key === 'Escape') clearDisplay();
    if (key === 'Backspace') display.value = display.value.slice(0, -1);
});
