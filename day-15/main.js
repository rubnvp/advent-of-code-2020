var inputText = `
0,3,6
`; // expected output: 436 (part 1) 175594 (part 2)

function parseInput(inputText) {
    return inputText
        .trim()
        .split(',')
        .map(num => parseInt(num));
}

function resolve1(numbers) {
    const MAX_TURN = 2020;
    for (let i = numbers.length; i < MAX_TURN; i++) {
        let nextNumber;
        const [lastNumber, ...previousNumbers] = numbers.slice().reverse();
        if (previousNumbers.includes(lastNumber)) {
            nextNumber = previousNumbers.findIndex(num => num === lastNumber) + 1;
        } else {
            nextNumber = 0;
        }
        numbers.push(nextNumber);
    }
    return numbers[MAX_TURN - 1];
}

function resolve2(numbers) {
    const MAX_TURN = 3000000;// for 3000000 (expected 3240) // for 120000 (expected 2216) // 30000000
    const length = numbers.length;
    const numberPos = numbers
        .slice(0, length - 1)
        .reduce((numberPos, num, i)=> ({
            ...numberPos,
            [num]: i + 1,
        }), {});
    
    let lastNumber = numbers[length - 1];
    for (let i = length; i < MAX_TURN; i++) {
        const nextNumber = numberPos[lastNumber] !== undefined
            ? i - numberPos[lastNumber]
            : 0;
        numberPos[lastNumber] = i;
        lastNumber = nextNumber;
    }

    return lastNumber;
}

console.time('time');
const input = parseInput(inputText);
const output = resolve2(input);
console.timeEnd('time');

console.log(output);