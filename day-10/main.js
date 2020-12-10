// var inputText = `
// 28
// 33
// 18
// 42
// 31
// 14
// 46
// 20
// 48
// 47
// 24
// 23
// 49
// 45
// 19
// 38
// 39
// 11
// 1
// 32
// 25
// 35
// 8
// 17
// 7
// 9
// 4
// 2
// 34
// 10
// 3
// `; // 8

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(num => parseInt(num))
        .sort((a, b) => a - b);
}

function resolve1(voltages) {
    const differences = {
        1: 0,
        2: 0,
        3: 0,
    };
    voltages = [0, ...voltages, voltages[voltages.length - 1] + 3];
    let i = 0;
    while (i < voltages.length && (voltages[i + 1] - voltages[i]) <= 3) {
        const diff = voltages[i + 1] - voltages[i];
        differences[diff]++;
        i++;
    }
    return differences[1] * differences[3];
}

function resolve2(voltages) {
    // collect the diferences with the next one
    const differences = [];
    voltages = [0, ...voltages, voltages[voltages.length - 1] + 3];
    let i = 0;
    while (i < voltages.length && (voltages[i + 1] - voltages[i]) <= 3) {
        const diff = voltages[i + 1] - voltages[i];
        differences.push(diff);
        i++;
    }
    // get blocks of 1 and the possible combinations
    // with a previous analysis in the input we have that there are only
    // steps of 1 or 3 and the maximum 1 steps in serie is 3
    
    return differences
        .join('')
        .split('3')
        .map(block => block.length)
        .filter(width => width >= 2)
        .map(width => width - 1)
        .reduce((mult, num) => mult * (Math.pow(2, num) - (num===3?1:0)), 1);
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);