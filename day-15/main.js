// var inputText = `
// 0,3,6
// `; // expected output: 436 (part 1) 175594 (part 2)

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
    const MAX_TURN = 30000000;// for 3000000 (expected 3240) // for 120000 (expected 2216) // 30000000
    const length = numbers.length;
    // this is really strange, the difference in performance using an object and a Map is so huge
    // with an array initialized like new Array(MAX_TURN) (not new Array({length: MAX_TURN})) it goes even faster
    const numberPos = new Map();
    numbers
        .slice(0, length - 1)
        .forEach((num, i)=> {
            numberPos.set(num, i + 1);
        });
    
    let lastNumber = numbers[length - 1];
    for (let i = length; i < MAX_TURN; i++) {
        const nextNumber = numberPos.get(lastNumber) !== undefined
            ? i - numberPos.get(lastNumber)
            : 0;
            numberPos.set(lastNumber, i);
        lastNumber = nextNumber;
    }

    return lastNumber;
}

console.time('time');
const input = parseInput(inputText);
const output = resolve2(input);
console.timeEnd('time');

console.log(output);