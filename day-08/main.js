// var inputText = `
// nop +0
// acc +1
// jmp +4
// acc +3
// jmp -3
// acc -99
// acc +1
// jmp -4
// acc +6
// `;

function parseInput(inputText) {
    return inputText
        .trim()
        .split('\n')
        .map(line => {
            const [instruction, valueText] = line.split(' ');
            return {
                instruction,
                value: parseInt(valueText),
            };
        });
}

function resolve1(lines) {
    let lineCount = 0;
    let acc = 0;
    
    const instructionMap = {
        'nop': () => {
            lineCount++;
        },
        'acc': value => {
            acc += value;
            lineCount++;
        },
        'jmp': value => {
            lineCount += value
        },
    }
    
    const executedLines = new Set();
    while (lineCount < lines.length && !executedLines.has(lineCount)) {
        executedLines.add(lineCount);
        const {instruction, value} = lines[lineCount];
        instructionMap[instruction](value);
    }

    return acc;
}

function tryInstructions(lines) {
    let lineCount = 0;
    let acc = 0;
    const instructionMap = {
        'nop': () => {
            lineCount++;
        },
        'acc': value => {
            acc += value;
            lineCount++;
        },
        'jmp': value => {
            lineCount += value
        },
    };
    const executedLines = new Set();
    while (lineCount < lines.length) {
        if (executedLines.has(lineCount)) {
            return null; // null means these instructions failed
        }
        executedLines.add(lineCount);
        const {instruction, value} = lines[lineCount];
        instructionMap[instruction](value);
    }
    return acc;
}

function resolve2(lines) {
    let result = null;
    for (let i = 0; i < lines.length && result === null; i++) {
        const {instruction, value} = lines[i];
        if (instruction === 'jmp' || instruction === 'nop') {
            const newInstruction = instruction === 'jmp'
                ? 'nop'
                : 'jmp';
            result = tryInstructions([
                ...lines.slice(0, i),
                {instruction: newInstruction, value},
                ...lines.slice(i + 1, lines.length),
            ]);
        }
    }
    return result;
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);