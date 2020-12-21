var inputText = `
base input
`;

function parseInput(inputText) {
    return inputText;
}

function resolve1(input) {
    return input;
}

console.time('time');
const input = parseInput(inputText);
const output = resolve1(input);
console.timeEnd('time');

console.log(output);