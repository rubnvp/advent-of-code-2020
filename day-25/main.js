// var inputText = `
// 5764801
// 17807724
// `; // 14897079

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(num => parseInt(num));
}

function resolve1([pk1, pk2]) {
    let value = 1;
    let loopSize = 0;
    while (value !== pk1) {
        value *= 7;
        value = value % 20201227;
        loopSize++;
    }
    value = 1;
    for (let loop = 0; loop < loopSize; loop++) {
        value *= pk2;
        value = value % 20201227;
    }
    return value;
}

console.time('time');
const input = parseInput(inputText);
const output = resolve1(input);
console.timeEnd('time');

console.log(output);