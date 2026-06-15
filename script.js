const display = document.getElementById('display');
function appendToDisplay(input) {
    if (display.value === "Erro") display.value = "";
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function calculatePercentage() {
    const expression = display.value.replace(',', '.');
    const operation = expression.match(/^(.*)([+\-*/])(\d+(?:\.\d+)?)$/);

    try {
        if (operation) {
            const [, baseExpression, operator, percentageValue] = operation;
            const baseValue = eval(baseExpression);
            const value = Number(percentageValue);
            const percentage = ['+', '-'].includes(operator)
                ? baseValue * value / 100
                : value / 100;

            display.value = `${baseExpression}${operator}${percentage}`;
        } else if (expression !== '' && isFinite(expression)) {
            display.value = Number(expression) / 100;
        }
    } catch (error) {
        display.value = "Erro";
    }
}

function calculate() {
    try {
        const result = eval(display.value);
        if (!isFinite(result)) {
            display.value = "Erro";
        } else {
            display.value = result;
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
    if (key === 'Enter' || key === '=') calculate();
    if (key === 'Escape') clearDisplay();
    if (key === 'Backspace') display.value = display.value.slice(0, -1);
});
