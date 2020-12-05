// var inputText = `
// FBFBBFFRLR
// `;

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(text => parseInt(text
            .replaceAll('B', '1')
            .replaceAll('R', '1')
            .replaceAll('F', '0')
            .replaceAll('L', '0'), 2)
        );
}

function resolve1(seatIds) {
    return Math.max(...seatIds);
}

function resolve2(seatIds) {
    return seatIds
        .sort((a, b) => a - b)
        .map((id, i, arr) => ({
            id,
            diffNext: arr[i + 1] - id
        }))
        .find(({diffNext}) => diffNext !== 1);
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);