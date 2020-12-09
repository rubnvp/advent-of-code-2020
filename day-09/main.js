// var inputText = `
// 35
// 20
// 15
// 25
// 47
// 40
// 62
// 55
// 65
// 95
// 102
// 117
// 150
// 182
// 127
// 219
// 299
// 277
// 309
// 576
// `;

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(line => parseInt(line));
}

function resolve1(numbers) {
    // const windowLength = 5;
    const windowLength = 25

    return numbers
        .slice(windowLength)
        .find((number, index) => {
            const range = numbers.slice(index, index + windowLength);
            return !range
                .some((num1, i) => range
                    .slice(i)
                    .some(num2 => num1 + num2 === number)
                );
        });
}

function resolve2(numbers) {
    const targetNumber = resolve1(numbers);

    let range;
    let rangeSum = 0;

    for (let i = 0; i < numbers.length && rangeSum !== targetNumber; i++) {
        rangeSum = 0;
        for (
            let j = i + 2;  // 2 is because we already know that 2 numbers dont add up the targetNumber
            j < numbers.length && rangeSum < targetNumber;
            j++
        ) {
            range = numbers.slice(i, j + 1)
            rangeSum = range.reduce((sum, num) => sum + num);
        }
    }

    return Math.min(...range) + Math.max(...range);
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);